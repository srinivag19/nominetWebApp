# AI Code Review Setup

This repository includes an automated AI pull request reviewer.

## Required GitHub secret

Add this repository or organization secret:

- `OPENAI_API_KEY`: your OpenAI API key.

GitHub provides `GITHUB_TOKEN` automatically. The workflow uses it to read the pull request diff and post review comments.

## Optional GitHub variable

Add this repository or organization variable if you want to override the default model:

- `OPENAI_MODEL`: defaults to `gpt-4.1-mini`.

## Workflow behavior

- Runs when a pull request is opened, updated, reopened, or marked ready for review.
- Skips draft pull requests.
- Reviews source-like files and skips generated output, dependencies, lock files, and binary assets.
- Posts one grouped pull request review with inline comments on changed lines.
- Uses `.github/ai-review-guidelines.md` as the local review knowledge base for retrieval-augmented review context.

## Tuning

The workflow can be tuned in `.github/workflows/ai-code-review.yml`:

- `REVIEW_MAX_COMMENTS`: maximum inline comments per review.
- `REVIEW_MAX_FILES`: maximum changed files included in one AI review request.
- `REVIEW_MAX_PATCH_CHARS`: maximum diff text sent to the model.
