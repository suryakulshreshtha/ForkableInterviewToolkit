# 7. CI/CD & Reporting

Getting the suite running on every push, and making a red build diagnosable. The live workflow: [`.github/workflows/python-playwright.yml`](../../../../.github/workflows/python-playwright.yml).

---

### 7.1 How Do You Integrate Pytest + Playwright into a CI/CD Pipeline?

**Source:** New — added to broaden coverage into CI/CD.

> 🆕 **New Addition:** Not sourced from any screenshot — added because CI/CD integration is a near-certain follow-up to any framework-design discussion.

#### 1. Direct Answer

Install Python and dependencies, run playwright install --with-deps to fetch browser binaries in the CI image, then run pytest with whatever reporting flags you need. Cache dependencies where possible to keep pipeline runs fast, and fail the build on a non-zero pytest exit code so a red pipeline actually blocks a bad merge.

#### 2. Real-Time Project Example

A GitHub Actions workflow that runs on every push/PR, installs Python, restores a pip cache, installs Playwright browsers, runs the suite, and uploads the Allure/HTML report and trace files as build artifacts for debugging failed runs.

#### 3. Coding / Practical Example

```yaml
name: Playwright Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - run: pip install -r requirements.txt
      - run: playwright install --with-deps
      - run: pytest --alluredir=allure-results
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: allure-results
          path: allure-results
```

#### 4. STAR Method Answer

| | |
|---|---|
| **S — Situation** | Regression testing was still a manual, someone-remembers-to-run-it step before release. |
| **T — Task** | I needed the suite to run automatically and block merges on failure, without slowing the team down. |
| **A — Action** | I wrote a GitHub Actions workflow that installs dependencies, runs the suite on every PR, and uploads the Allure report and Playwright traces as build artifacts on failure. |
| **R — Result** | Regressions were caught before merge instead of after release, and a failing trace was one click away instead of a re-run-and-hope debugging session. |

#### 5. Interview-Ready Answer

> "I install dependencies, run playwright install --with-deps, then run pytest on every push/PR through GitHub Actions (or Jenkins), uploading the Allure/trace artifacts so a red build is immediately diagnosable, not just a red X."

#### 6. Important Interview Point

- Always upload the report/trace artifacts on failure (if: always()) — a red CI run with no artifacts just moves the debugging pain from “not run” to “not diagnosable.”

#### 7. One-Line Revision

⚡ **CI/CD = install deps → playwright install --with-deps → run pytest → publish report/trace artifacts → block merge on failure.**

---
### 7.2 What Reporting / Debugging Tools Do You Use With Pytest + Playwright?

**Source:** New — added to broaden coverage into reporting/debugging.

> 🆕 **New Addition:** Not sourced from any screenshot — added as a common follow-up to the CI/CD entry above.

#### 1. Direct Answer

Allure (via the allure-pytest plugin) gives a rich, filterable HTML report with history trends; pytest-html gives a lightweight single-file report when Allure is overkill. Playwright's own trace viewer is the most valuable failure-debugging tool — it replays a failed test step-by-step with DOM snapshots, network calls, and console logs.

#### 2. Real-Time Project Example

A flaky-looking failure in CI gets root-caused in minutes by opening the uploaded trace.zip in the trace viewer, rather than trying to reproduce it locally blind.

#### 3. Coding / Practical Example

```bash
# Allure
pytest --alluredir=allure-results
allure serve allure-results

# Lightweight single-file HTML report
pytest --html=report.html --self-contained-html

# Playwright trace viewer (record traces via pytest-playwright's --tracing flag)
pytest --tracing=retain-on-failure
playwright show-trace test-results/.../trace.zip
```

#### 5. Interview-Ready Answer

> "Allure or pytest-html for the readable report, and Playwright's trace viewer for step-by-step failure debugging — I turn tracing on for CI/failure-triage runs specifically, not by default locally."

#### 6. Important Interview Point

- Turn tracing on only for CI/failure-triage runs (--tracing=retain-on-failure), not every local run — traces add overhead and disk usage you don't want by default.

#### 7. One-Line Revision

⚡ **Allure/pytest-html for the report; Playwright's trace viewer (--tracing) for step-by-step failure debugging.**

---

[← Back to interview-prep index](README.md)
