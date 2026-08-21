# Adding a New Project (New Stack)

This repo is a **monorepo of independent toolkits**, one per stack. Nothing at the root knows anything stack-specific, which is what lets `TypeScript-Playwright-Automation` sit next to `Python-Playwright-Automation` without either one interfering with the other.

## The contract

Every project under `projects/` must satisfy all five:

| # | Requirement | Why |
|---|---|---|
| 1 | Live entirely under `projects/<Project-Name>/` | No project may write outside its own folder |
| 2 | Ship its own `README.md` with a copy-pasteable quickstart | A reader should never need the root README to run it |
| 3 | Declare its own dependencies (`requirements.txt`, `package.json`, …) | No shared/global dependency file |
| 4 | Ship its own `docs/interview-prep/` in the seven-part format | The notes-plus-proof pairing is the point of the repo |
| 5 | Add **one** path-filtered workflow at `.github/workflows/<project-slug>.yml` | Editing a Python file must not trigger the TypeScript suite |

## Naming

- Folders: `PascalCase-With-Hyphens` → `Python-Playwright-Automation`
- Workflows: `lowercase-with-hyphens.yml` → `python-playwright.yml`

## Path filtering is mandatory

Without it, every project's CI runs on every push and the repo becomes unusable. Every workflow starts like this:

```yaml
on:
  push:
    paths:
      - 'projects/Your-Project-Name/**'
      - '.github/workflows/your-project-name.yml'
  pull_request:
    paths:
      - 'projects/Your-Project-Name/**'
      - '.github/workflows/your-project-name.yml'
  workflow_dispatch:

defaults:
  run:
    working-directory: projects/Your-Project-Name
```

## Steps

1. `mkdir -p projects/Your-Project-Name`
2. Copy the folder skeleton from `Python-Playwright-Automation` (structure only, not the Python code).
3. Write the project README — quickstart first, everything else after.
4. Add the path-filtered workflow.
5. Add a row to the project table in the root README, with an honest status: ✅ Active / 🚧 WIP / 🕓 Planned.
6. Open a PR.

## Non-negotiables, wherever the code runs

- No secrets in the repo. GitHub Actions encrypted secrets only.
- No load testing against third-party sites. Ship a local target instead.
- No employer-identifying interview content.
- Synthetic test data only.
