# AI Code Review Guidelines

Use these rules when reviewing pull requests for this Angular application.

## Review priorities

- Flag defects that can change runtime behavior, break user flows, hide errors, or produce incorrect data.
- Flag security issues, especially unsafe HTML handling, exposed secrets, injection risks, insecure HTTP usage, and overly broad permissions.
- Flag Angular and TypeScript issues such as missing subscriptions cleanup, incorrect dependency injection, unsafe `any` usage around user data, broken reactive forms, and change detection mistakes.
- Flag missing or weak tests when the pull request changes meaningful behavior.
- Prefer comments that point to a concrete changed line and explain the impact.

## Comment style

- Be concise, specific, and actionable.
- Do not comment on formatting, naming, or personal style unless it causes a real maintainability or correctness issue.
- Do not repeat the same issue across many lines.
- Do not ask for broad rewrites when a focused fix would solve the risk.
- If there is uncertainty, say what assumption the finding depends on.

## Project context

- The app is an Angular frontend generated with Angular CLI.
- Source code lives under `nominetWebApp/src`.
- Package and Angular configuration live under `nominetWebApp`.
- GitHub Actions runs from the outer repository root.
