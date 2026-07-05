import fs from "node:fs/promises";
import path from "node:path";

const MAX_FILES = Number(process.env.REVIEW_MAX_FILES ?? 25);
const MAX_PATCH_CHARS = Number(process.env.REVIEW_MAX_PATCH_CHARS ?? 60000);
const MAX_COMMENTS = Number(process.env.REVIEW_MAX_COMMENTS ?? 12);
const MODEL = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";
const MARKER = "<!-- ai-code-review-agent -->";

const githubToken = process.env.GITHUB_TOKEN;
const openAiKey = process.env.OPENAI_API_KEY;
const repository = process.env.GITHUB_REPOSITORY;
const eventPath = process.env.GITHUB_EVENT_PATH;

if (!githubToken) {
  throw new Error("GITHUB_TOKEN is required.");
}

if (!openAiKey) {
  throw new Error("OPENAI_API_KEY is required. Add it as a repository or organization secret.");
}

if (!repository || !eventPath) {
  throw new Error("GITHUB_REPOSITORY and GITHUB_EVENT_PATH are required.");
}

const event = JSON.parse(await fs.readFile(eventPath, "utf8"));
const pullRequest = event.pull_request;

if (!pullRequest) {
  console.log("No pull_request payload found. Nothing to review.");
  process.exit(0);
}

if (pullRequest.draft) {
  console.log("Draft pull request detected. Skipping AI review.");
  process.exit(0);
}

const [owner, repo] = repository.split("/");
const prNumber = pullRequest.number;
const commitId = pullRequest.head.sha;
const apiBase = "https://api.github.com";

const reviewableExtensions = new Set([
  ".ts",
  ".html",
  ".scss",
  ".css",
  ".js",
  ".json",
  ".yml",
  ".yaml",
  ".md",
]);

const ignoredPathPatterns = [
  /(^|\/)node_modules\//,
  /(^|\/)dist\//,
  /(^|\/)coverage\//,
  /(^|\/)\.angular\//,
  /package-lock\.json$/,
  /(^|\/)yarn\.lock$/,
  /(^|\/)pnpm-lock\.yaml$/,
  /\.(png|jpe?g|gif|ico|svg|webp|pdf|zip)$/i,
];

async function github(pathname, options = {}) {
  const response = await fetch(`${apiBase}${pathname}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${githubToken}`,
      "User-Agent": "nominet-ai-code-review",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API ${response.status} ${response.statusText}: ${body}`);
  }

  if (response.status === 204) {
    return undefined;
  }

  return response.json();
}

async function getPullRequestFiles() {
  const files = [];
  let page = 1;

  while (page <= 10) {
    const batch = await github(
      `/repos/${owner}/${repo}/pulls/${prNumber}/files?per_page=100&page=${page}`,
    );

    files.push(...batch);
    if (batch.length < 100) {
      break;
    }

    page += 1;
  }

  return files;
}

function shouldReviewFile(file) {
  if (!file.patch || file.status === "removed") {
    return false;
  }

  if (ignoredPathPatterns.some((pattern) => pattern.test(file.filename))) {
    return false;
  }

  return reviewableExtensions.has(path.extname(file.filename).toLowerCase());
}

function parseChangedLines(patch) {
  const changed = new Set();
  let newLine = 0;

  for (const row of patch.split("\n")) {
    const hunk = row.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
    if (hunk) {
      newLine = Number(hunk[1]);
      continue;
    }

    if (row.startsWith("+") && !row.startsWith("+++")) {
      changed.add(newLine);
      newLine += 1;
      continue;
    }

    if (row.startsWith("-") && !row.startsWith("---")) {
      continue;
    }

    if (newLine > 0) {
      newLine += 1;
    }
  }

  return changed;
}

function trimPatch(files) {
  let remaining = MAX_PATCH_CHARS;
  const selected = [];

  for (const file of files.slice(0, MAX_FILES)) {
    if (remaining <= 0) {
      break;
    }

    const patch = file.patch.slice(0, Math.max(0, remaining));
    remaining -= patch.length;
    selected.push({
      filename: file.filename,
      status: file.status,
      additions: file.additions,
      deletions: file.deletions,
      changes: file.changes,
      patch,
    });
  }

  return selected;
}

function retrieveGuidelines(guidelines, files) {
  const lowerNames = files.map((file) => file.filename.toLowerCase()).join(" ");
  const sections = guidelines.split(/\n(?=## )/);

  const keywords = [
    lowerNames.includes(".ts") ? "Angular TypeScript subscriptions dependency injection reactive forms any" : "",
    lowerNames.includes(".html") ? "HTML templates forms unsafe user data" : "",
    lowerNames.includes(".scss") || lowerNames.includes(".css") ? "styles layout accessibility" : "",
    "bugs security tests runtime behavior",
  ]
    .join(" ")
    .toLowerCase()
    .split(/\W+/)
    .filter(Boolean);

  return sections
    .map((section) => {
      const text = section.toLowerCase();
      const score = keywords.reduce((sum, word) => sum + (text.includes(word) ? 1 : 0), 0);
      return { section, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((entry) => entry.section)
    .join("\n\n");
}

function buildPrompt({ guidelines, files }) {
  return [
    {
      role: "system",
      content:
        "You are a senior code reviewer for an Angular and TypeScript repository. Review only the supplied pull request diff. Return strict JSON only.",
    },
    {
      role: "user",
      content: JSON.stringify(
        {
          instructions: [
            "Find only actionable issues that a maintainer should consider before merge.",
            "Comment only on added or modified lines visible in the diff.",
            "Prefer correctness, security, reliability, Angular, TypeScript, and missing-test findings.",
            "Avoid style-only comments and avoid repeating the same root cause.",
            `Return at most ${MAX_COMMENTS} comments.`,
          ],
          retrieved_review_guidelines: guidelines,
          pull_request: {
            number: prNumber,
            title: pullRequest.title,
            base: pullRequest.base.ref,
            head: pullRequest.head.ref,
          },
          changed_files: files,
        },
        null,
        2,
      ),
    },
  ];
}

async function askOpenAi(messages) {
  const schema = {
    name: "pull_request_review",
    strict: true,
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        summary: {
          type: "string",
          description: "Short summary of the review.",
        },
        comments: {
          type: "array",
          maxItems: MAX_COMMENTS,
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              path: {
                type: "string",
                description: "Repository-relative file path from the diff.",
              },
              line: {
                type: "integer",
                description: "New-file line number for a changed line in the diff.",
              },
              severity: {
                type: "string",
                enum: ["critical", "high", "medium", "low"],
              },
              body: {
                type: "string",
                description: "Actionable PR review comment.",
              },
            },
            required: ["path", "line", "severity", "body"],
          },
        },
      },
      required: ["summary", "comments"],
    },
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openAiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.1,
      messages,
      response_format: {
        type: "json_schema",
        json_schema: schema,
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenAI API ${response.status} ${response.statusText}: ${body}`);
  }

  const payload = await response.json();
  return JSON.parse(payload.choices[0].message.content);
}

function filterValidComments(review, files) {
  const changedLinesByFile = new Map(
    files.map((file) => [file.filename, parseChangedLines(file.patch)]),
  );

  const seen = new Set();
  const comments = [];

  for (const comment of review.comments ?? []) {
    const changedLines = changedLinesByFile.get(comment.path);
    const key = `${comment.path}:${comment.line}:${comment.body}`;

    if (!changedLines || !changedLines.has(comment.line) || seen.has(key)) {
      continue;
    }

    seen.add(key);
    comments.push({
      path: comment.path,
      line: comment.line,
      side: "RIGHT",
      body: `**${comment.severity.toUpperCase()}** ${comment.body}`,
    });
  }

  return comments.slice(0, MAX_COMMENTS);
}

async function postReview({ summary, comments }) {
  const body = `${MARKER}
AI code review completed.

${summary}`;

  if (comments.length === 0) {
    await github(`/repos/${owner}/${repo}/issues/${prNumber}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        body: `${body}\n\nNo actionable changed-line findings were found.`,
      }),
    });
    return;
  }

  await github(`/repos/${owner}/${repo}/pulls/${prNumber}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      commit_id: commitId,
      event: "COMMENT",
      body,
      comments,
    }),
  });
}

const allFiles = await getPullRequestFiles();
const reviewableFiles = allFiles.filter(shouldReviewFile);

if (reviewableFiles.length === 0) {
  await postReview({
    summary: "No reviewable source changes were found in this pull request.",
    comments: [],
  });
  process.exit(0);
}

const guidelinesPath = new URL("../ai-review-guidelines.md", import.meta.url);
const guidelines = await fs.readFile(guidelinesPath, "utf8");
const selectedFiles = trimPatch(reviewableFiles);
const retrievedGuidelines = retrieveGuidelines(guidelines, selectedFiles);
const review = await askOpenAi(buildPrompt({ guidelines: retrievedGuidelines, files: selectedFiles }));
const comments = filterValidComments(review, selectedFiles);

await postReview({
  summary: review.summary,
  comments,
});

console.log(`AI review posted with ${comments.length} inline comment(s).`);
