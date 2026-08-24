# Part C — CI/CD Fundamentals

> Every example is taken from the **live workflows in this repository**, not invented.

**Chapters:** [4. Anatomy](#4-anatomy-of-a-workflow) · [5. Path filtering](#5-path-filtering) · [6. Caching](#6-caching) · [7. Matrix](#7-matrix-builds) · [8. Artifacts](#8-artifacts) · [9. Secrets](#9-secrets) · [10. Lockfiles](#10-lockfiles-and-the-dependency-break) · [11. Version drift](#11-version-drift) · [12. Controls](#12-branch-protection-concurrency-manual-runs)

---

## What CI/CD actually means

| Term | Plain English | In this repo |
|---|---|---|
| **CI** — Continuous Integration | Every push is automatically built and tested | Both suites run on every relevant push |
| **CD** — Continuous Delivery | Every passing build is *ready* to ship | Reports and traces published as artifacts |
| **CD** — Continuous Deployment | Every passing build ships *automatically* | Not used — a test repo has nothing to deploy |

The distinction between the two CDs is a common interview question. **Delivery** = always releasable, human approves. **Deployment** = no human in the loop.

### Why it matters

Without CI, "it works on my machine" is a hypothesis nobody tests until it's expensive. CI replaces that with a clean-room check on every push. Blocker cases [B-5](02-blocker-cases.md#b-5-the-git-folder-went-missing) and [B-6](02-blocker-cases.md#b-6-no-space-left-on-device) were both *"my machine"* problems — a CI runner starts fresh every time and would have been immune to both.

---

## 4. Anatomy of a workflow

A GitHub Actions workflow is a YAML file in `.github/workflows/`. Here's the real Python one, annotated:

```yaml
name: Python + Playwright          # shown in the Actions tab

on:                                # WHEN to run
  push:
    paths:
      - 'projects/Python-Playwright-Automation/**'
  pull_request:
    paths:
      - 'projects/Python-Playwright-Automation/**'
  workflow_dispatch:               # manual "Run workflow" button

defaults:
  run:
    working-directory: projects/Python-Playwright-Automation

jobs:
  test:                            # job id
    runs-on: ubuntu-latest         # fresh VM, destroyed after
    steps:
      - uses: actions/checkout@v4  # clone the repo
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install -r requirements.txt
      - run: playwright install --with-deps chromium
      - run: pytest framework/tests -v
```

### The hierarchy

```
Workflow  (one .yml file)
└── Job          (runs on its own fresh VM; jobs run in parallel by default)
    └── Step     (runs in order; a failure stops the job)
        ├── uses:  a prebuilt action from the marketplace
        └── run:   a shell command
```

**Key consequence:** each job gets a *clean machine*. Nothing persists between jobs unless you explicitly cache or upload it. That isolation is the entire value — and the reason `working-directory` must be set explicitly, per [B-3](02-blocker-cases.md#b-3-cd-too-many-arguments).

### Local equivalents

| Workflow step | What you'd run locally |
|---|---|
| `actions/checkout@v4` | `git clone` |
| `actions/setup-python@v5` | Install Python + `python -m venv .venv` |
| `pip install -r requirements.txt` | Same |
| `pytest framework/tests -v` | Same |

**CI is just your terminal commands, on someone else's clean computer.** That's the whole idea.

---

## 5. Path filtering

The single most valuable technique in a multi-project repo.

### The problem

This repo has three projects. Without filtering, editing a TypeScript file would run the Python suite too — wasted minutes, confusing red badges, slower feedback.

### The solution

Each workflow declares which paths it cares about:

```yaml
# python-playwright.yml
on:
  push:
    paths:
      - 'projects/Python-Playwright-Automation/**'
      - '.github/workflows/python-playwright.yml'

# typescript-playwright.yml
on:
  push:
    paths:
      - 'projects/TypeScript-Playwright-Automation/**'
      - '.github/workflows/typescript-playwright.yml'
```

### Behaviour

| Commit touches | Python CI | TypeScript CI |
|---|---|---|
| Only Python files | ✅ Runs | ⬜ Never triggered |
| Only TypeScript files | ⬜ Never triggered | ✅ Runs |
| Both | ✅ Runs | ✅ Runs |
| Only root `README.md` | ⬜ | ⬜ |

**"Never triggered" is literal** — the run doesn't appear in the Actions tab at all. GitHub evaluates paths *before* queueing, so it isn't "runs then skips."

### Each workflow watches its own file

```yaml
- '.github/workflows/python-playwright.yml'
```

Without this, editing the workflow wouldn't test the workflow. Easy to forget, annoying to debug.

### ⚠️ Path filters don't apply to `schedule:`

A cron-triggered workflow runs regardless of what changed. Worth knowing before adding nightly runs.

### 💬 Interview angle

> **"How do you keep CI fast as a monorepo grows?"**
>
> Path filtering first — each project's workflow only triggers on its own directory, so a change in one never runs another's suite. Then caching, then parallelism via matrix jobs. Path filtering gives the biggest win because the cheapest job is the one that never starts.

---

## 6. Caching

Dependency installs dominate CI time. Caching them is usually the second-biggest win.

```yaml
- uses: actions/setup-python@v5
  with:
    python-version: '3.11'
    cache: 'pip'
    cache-dependency-path: projects/Python-Playwright-Automation/requirements.txt

- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'
    cache-dependency-path: projects/TypeScript-Playwright-Automation/package-lock.json
```

### How it works

The cache key is a **hash of the dependency file**. Same `requirements.txt` → cache hit → skip download. Change one version → different hash → fresh install.

This is why `cache-dependency-path` must point at the **lockfile**, not the project folder. Hashing the folder would invalidate the cache on every source edit.

| Cached | Typical saving |
|---|---|
| pip packages | 30–60s |
| npm packages | 60–120s |
| Playwright browsers | 60–90s |

### ⚠️ Don't cache the thing you're testing

Caching `node_modules` directly (rather than the npm cache) can mask a broken `package-lock.json`. Cache the *download*, install fresh.

---

## 7. Matrix builds

Run the same job across multiple configurations, in parallel:

```yaml
strategy:
  fail-fast: false
  matrix:
    browser: [chromium, firefox, webkit]

steps:
  - run: npx playwright test --project=${{ matrix.browser }}
```

Three parallel jobs, one per browser.

| Setting | Effect |
|---|---|
| `fail-fast: false` | Let all combinations finish — you see *every* failure, not just the first |
| `fail-fast: true` (default) | Cancel siblings on first failure — faster, less information |

**Use `fail-fast: false` for test matrices.** Knowing "WebKit fails, Chromium and Firefox pass" is far more useful than "something failed."

Matrices multiply: `browser: [3] × node: [2]` = 6 jobs. Watch your minutes.

---

## 8. Artifacts

Jobs run on a VM that's destroyed afterwards. Anything you want to keep must be uploaded.

```yaml
- name: Upload report & traces
  uses: actions/upload-artifact@v4
  if: always()
  with:
    name: playwright-report-${{ matrix.browser }}
    path: |
      projects/TypeScript-Playwright-Automation/playwright-report/
      projects/TypeScript-Playwright-Automation/test-results/
    retention-days: 14
```

### `if: always()` is the critical line

By default a step is skipped when a previous step fails. But **a failed test run is exactly when you need the report.** `if: always()` forces the upload regardless.

| Condition | Runs when |
|---|---|
| *(default)* | All previous steps passed |
| `if: always()` | Always — including after failure |
| `if: failure()` | Only after a failure |
| `if: success()` | Explicit default |

Without this, a red build gives you a red X and nothing to debug with.

### Downloading

Actions tab → the run → **Artifacts** section. For Playwright:

```bash
npx playwright show-trace path/to/trace.zip
```

Step-by-step replay with DOM snapshots, network calls, and console logs.

---

## 9. Secrets

**Never commit credentials.** Git history is permanent — a later deletion doesn't remove them.

### Storing

Repo → Settings → Secrets and variables → Actions → *New repository secret*

### Using

```yaml
- name: Run tests
  env:
    API_TOKEN: ${{ secrets.API_TOKEN }}
    BASE_URL: ${{ vars.BASE_URL }}
  run: pytest
```

| Type | For | Visible in logs? |
|---|---|---|
| **Secrets** | Tokens, passwords, keys | ❌ Masked automatically |
| **Variables** | URLs, flags, non-sensitive config | ✅ Plain text |

GitHub masks secret values in logs — but only exact matches. A base64-encoded or partially-printed secret can still leak.

### The pattern this repo uses

Neither project needs credentials (the practice site is public), but the structure is in place:

```
.env              ← gitignored, never committed
.env.example      ← committed template, no real values
```

```gitignore
.env
.env.*
!.env.example
```

### 🔒 If a secret does get committed

1. **Revoke and rotate it immediately** — the only step that truly matters
2. Then optionally scrub history with `git filter-repo` or BFG

Assume anything pushed is public forever. Rotation first.

---

## 10. Lockfiles and the dependency break

> A **real** break from building this repo.

### What happened

`package.json` specified:

```json
"@playwright/test": "^1.47.0",
"playwright-bdd": "^7.4.0"
```

The `^` means *"this version or any compatible newer one."* npm resolved Playwright to **1.62.1** — released after the file was written. Playwright 1.62 restructured `lib/common/`, and playwright-bdd 7.x expected the old layout:

```
Error: Cannot find module '.../playwright/lib/common/configLoader'
```

Nothing in the source changed. A **transitive upgrade** broke the build.

### Fix

Upgrade to a compatible pairing:

```bash
npm install -D playwright-bdd@^9.2.0
```

### The lesson: `npm ci` vs `npm install`

| | `npm install` | `npm ci` |
|---|---|---|
| Reads | `package.json` | `package-lock.json` |
| May upgrade? | ✅ Yes, within ranges | ❌ Never — exact versions |
| Updates lockfile? | ✅ | ❌ |
| Speed | Slower | Faster |
| **Use in CI?** | ❌ | ✅ **Always** |

**`npm ci` in CI makes builds reproducible.** Without it, a build can break with zero code changes — the hardest failure to diagnose, because `git log` shows nothing.

| Ecosystem | Lockfile | Reproducible install |
|---|---|---|
| npm | `package-lock.json` | `npm ci` |
| Python (pip) | `requirements.txt` with `==` pins | `pip install -r requirements.txt` |
| Python (Poetry) | `poetry.lock` | `poetry install` |
| Maven | `pom.xml` (exact versions) | `mvn -B verify` |
| Gradle | `gradle.lockfile` | `gradle --write-locks` |

**Commit your lockfile.** It's the difference between a reproducible build and a coin flip.

### 💬 Interview angle

> **"CI broke but nobody changed code. What happened?"**
>
> Almost always a dependency. A caret range let a transitive dependency upgrade into an incompatible version. I hit exactly this — a Playwright minor bump restructured internal paths that a BDD plugin depended on. The fix is `npm ci` against a committed lockfile so CI installs exact versions, and Dependabot to surface upgrades as reviewable PRs rather than surprises.

---

## 11. Version drift

> Another real break.

### What happened

A JSON import that worked in one Node version failed in another:

```
TypeError: Module "..../practice-data.json" needs an import attribute of "type: json"
```

Node's ESM JSON-import rules changed across versions: Node 18 used `assert { type: 'json' }`, newer versions use `with { type: 'json' }`, and behaviour differs by version.

### Fix

Sidestep the moving target entirely — read the file with `fs`:

```typescript
const path = resolve(HERE, '../test-data/practice-data.json');
return JSON.parse(readFileSync(path, 'utf8'));
```

Works on every Node version, and keeps the data file editable JSON.

### The general lesson

**Pin your runtime, not just your dependencies.**

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'        # explicit, not "latest"

- uses: actions/setup-python@v5
  with:
    python-version: '3.11'    # explicit
```

`ubuntu-latest` is also a moving target — GitHub upgrades it periodically. For maximum reproducibility, pin `ubuntu-22.04`. Trade-off: pinned runners eventually reach end of support.

| Layer | How to pin |
|---|---|
| Runner OS | `runs-on: ubuntu-22.04` |
| Language runtime | `node-version: '20'` |
| Dependencies | lockfile + `npm ci` |
| Actions | `actions/checkout@v4` (or a full SHA) |
| Containers | `python:3.11-slim`, never `:latest` |

---

## 12. Branch protection, concurrency, manual runs

### Branch protection

Settings → Branches → Add rule. Makes CI *enforcing* rather than advisory:

| Rule | Effect |
|---|---|
| Require status checks | Can't merge until CI passes |
| Require PR before merging | No direct pushes to `main` |
| Require review | Another human must approve |
| Require up-to-date branch | Must rebase on latest `main` first |

Without this, CI is a suggestion — red builds can be merged.

### Concurrency

Cancel superseded runs to save minutes:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

Push three times quickly and only the newest survives. **Don't use `cancel-in-progress` on deployment workflows** — cancelling mid-deploy leaves things half-shipped.

### Manual runs

```yaml
on:
  workflow_dispatch:
```

Adds a **"Run workflow"** button. Both workflows here have it — useful for re-running after a flaky failure without a dummy commit.

With inputs:

```yaml
on:
  workflow_dispatch:
    inputs:
      browser:
        description: 'Browser to test'
        required: true
        default: 'chromium'
        type: choice
        options: [chromium, firefox, webkit]
```

### Status badges

```markdown
[![Python](https://github.com/you/repo/actions/workflows/python-playwright.yml/badge.svg)](../../actions/workflows/python-playwright.yml)
```

A green badge is the fastest credibility signal a repo can offer. It also means **you can't quietly ship a broken `main`** — which is the real value.

---

## 💬 Interview angles for Part C

> **"Walk me through your CI pipeline."**
>
> Path-filtered triggers so only the affected project runs. Checkout, pin the runtime, restore a dependency cache keyed on the lockfile, install with `npm ci` for reproducibility, install browsers, run the suite across a browser matrix with `fail-fast: false`. Reports and traces upload with `if: always()` so a red build is diagnosable. Branch protection requires the check to pass before merge.

> **"CI passes but production breaks. How?"**
>
> The environments differ. Common causes: unpinned dependency versions, a different runtime version, missing environment variables that default silently, or test data that only exists in CI. Fix by pinning everything — runner OS, runtime, dependencies via lockfile — and running against an environment as production-like as practical.

> **"How do you handle flaky tests in CI?"**
>
> Confirm it's genuinely flaky rather than an intermittent real bug — re-run in isolation and read the trace. Usually it's a weak locator or a missing wait for an async condition. Fix the root cause; use retries only for known-unreliable third-party dependencies. Anything unfixable gets quarantined and tracked, never silently retried, because a rising retry count masks real regressions.

---

**Next:** [Part D — The Wider Ecosystem](04-ecosystem.md)

[← Back to index](README.md)
