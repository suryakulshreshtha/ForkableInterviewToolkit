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

| Kind | Convention | Examples |
|---|---|---|
| Project folder | `PascalCase-With-Hyphens` | `Python-Playwright-Automation`, `TypeScript-Playwright-Automation` |
| Workflow file | `lowercase-with-hyphens.yml` | `python-playwright.yml`, `typescript-playwright.yml` |

Casing is not cosmetic here — the workflow's `working-directory` and `paths` filters must match the folder exactly, and case mismatches that work on macOS will fail on GitHub's Linux runners.

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

## Two reference implementations

When you add a stack, these are the slots you're filling. Both existing projects solve the same problems with different tools — copy the *shape*, not the tooling:

| Concern | Python project | TypeScript project | Yours |
|---|---|---|---|
| Test runner | pytest | `@playwright/test` | ? |
| Config file | `pytest.ini` | `playwright.config.ts` | ? |
| Dependency manifest | `requirements.txt` | `package.json` + lockfile | ? |
| Fixtures / setup | `conftest.py` | `framework/fixtures/fixtures.ts` | ? |
| Page Objects | `framework/pages/*.py` | `framework/pages/*.ts` | ? |
| Data-driven | `@pytest.mark.parametrize` | `for…of` around `test()` | ? |
| Test selection | markers (`-m smoke`) | tags (`--grep @smoke`) | ? |
| BDD | pytest-bdd | playwright-bdd | ? |
| Load testing | Locust + Flask target | Artillery + Express target | ? |
| Selector health check | `scripts/verify_selectors.py` | `scripts/verify-selectors.ts` | ? |

Two conventions that matter more than the tooling choices:

- **All selectors live in one Page Object file per page.** A markup change must be a one-file fix that never touches a test.
- **Page Objects expose actions and state, never assertions.** The test decides what is correct.

## Steps

1. `mkdir -p projects/Your-Project-Name`
2. Copy the folder skeleton from an existing project (structure only, not the code).
3. Write the project README — quickstart first, everything else after.
4. Add the path-filtered workflow.
5. **Extend the root `.gitignore`** with your ecosystem's build/dependency artifacts (`node_modules/`, `target/`, `vendor/`, …). Keep it in a clearly labelled section so the file stays readable.
6. Add a row to the project table in the root README, with an honest status: ✅ Active / 🚧 WIP / 🕓 Planned.
7. Open a PR.

## Non-negotiables, wherever the code runs

- No secrets in the repo. GitHub Actions encrypted secrets only.
- No load testing against third-party sites. Ship a local target instead.
- No employer-identifying interview content.
- Synthetic test data only.
