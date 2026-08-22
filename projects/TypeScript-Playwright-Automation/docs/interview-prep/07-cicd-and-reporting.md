# 7. CI/CD & Reporting

Running on every push and making a red build diagnosable. Live workflow: [`.github/workflows/typescript-playwright.yml`](../../../../.github/workflows/typescript-playwright.yml).

---

### 7.1 How Do You Integrate a Playwright Suite into CI/CD?

**Source:** Commonly asked — near-certain follow-up to framework design.

#### 1. Direct Answer

Install Node, run `npm ci` for a lockfile-exact install, run `npx playwright install --with-deps` for the browser binaries, then run the suite. Cache `~/.npm` and the browser download to keep runs fast.

In a monorepo, **path-filter each workflow** so editing one project doesn't trigger every other project's suite, and set `working-directory` so commands run in the right folder.

Always upload the HTML report and traces as artifacts with `if: always()` — a red build with no artifacts just moves the pain from “not run” to “not diagnosable.”

Set `forbidOnly: true` in CI so a stray `test.only` fails the build instead of silently skipping the rest of the suite.

#### 2. Real-Time Project Example

A workflow runs on every PR touching this project, executes the suite across Chromium, and uploads traces on failure so a reviewer can replay the exact failing run.

#### 3. Coding / Practical Example

```yaml
name: TypeScript + Playwright

on:
  pull_request:
    paths:
      - 'projects/TypeScript-Playwright-Automation/**'

defaults:
  run:
    working-directory: projects/TypeScript-Playwright-Automation

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: projects/TypeScript-Playwright-Automation/playwright-report/
```

#### 4. STAR Method Answer

| | |
|---|---|
| **S — Situation** | Regression testing was a manual, someone-remembers-to-run-it step before release. |
| **T — Task** | I needed it automatic and blocking on failure, without slowing the team down. |
| **A — Action** | I wrote a path-filtered workflow that runs on every relevant PR and uploads the HTML report and traces as artifacts on failure. |
| **R — Result** | Regressions were caught before merge instead of after release, and a failing trace was one click away instead of a re-run-and-hope session. |

#### 5. Interview-Ready Answer

> "npm ci for a lockfile-exact install, playwright install for browsers, then the suite — path-filtered per project so unrelated changes don't trigger it. I always upload reports and traces with if: always(), because a red build without artifacts isn't actionable."

#### 6. Important Interview Point

- `npm ci` over `npm install`, and `if: always()` on artifact upload. Both are small details that signal you've actually maintained a pipeline rather than copied one.

#### 7. One-Line Revision

⚡ **npm ci → playwright install → test → upload report/traces always → path-filter per project.**

---
### 7.2 What Reporting and Debugging Tools Do You Use?

**Source:** Commonly asked — follow-up to CI integration.

#### 1. Direct Answer

The **trace viewer** is the highest-value tool by a wide margin: it replays a failed test step by step with DOM snapshots, network activity, console logs, and before/after screenshots for every action. `trace: 'retain-on-failure'` keeps the cost off passing runs.

The built-in **HTML reporter** covers most needs; the `github` reporter annotates PRs inline; `blob` + `merge-reports` combines sharded runs into one report.

For local debugging, `--debug` opens Playwright Inspector for step-through, and **UI mode** (`--ui`) gives a watch-mode runner with time-travel — usually the fastest way to develop a new test.

Codegen (`npx playwright codegen`) is useful for discovering locators, but treat its output as a starting point, not committed code.

#### 2. Real-Time Project Example

A CI-only failure gets root-caused in minutes by downloading the trace artifact and replaying it locally, instead of trying to reproduce it blind.

#### 3. Coding / Practical Example

```bash
npx playwright test --ui              # watch mode + time travel (best for authoring)
npx playwright test --debug           # step-through Inspector
npx playwright show-report            # open the HTML report
npx playwright show-trace trace.zip   # replay a failed run
npx playwright codegen <url>          # discover locators

# Sharded runs -> one merged report
npx playwright merge-reports --reporter=html ./blob-report
```

#### 5. Interview-Ready Answer

> "Trace viewer for failure debugging — it replays the run with DOM snapshots, network, and console. HTML reporter for results, github reporter for PR annotations. Locally I use UI mode for authoring and --debug for step-through."

#### 6. Important Interview Point

- Naming UI mode and the trace viewer specifically signals hands-on experience. Candidates who've only read about Playwright tend to stop at “it has HTML reports.”

#### 7. One-Line Revision

⚡ **Trace viewer for failures, HTML/github reporters for results, UI mode for authoring.**

---

[← Back to interview-prep index](README.md)
