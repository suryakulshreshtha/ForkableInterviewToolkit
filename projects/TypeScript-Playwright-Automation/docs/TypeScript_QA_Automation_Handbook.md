# TypeScript + Playwright QA Automation Handbook

A single-file, condensed quick-reference. For the full seven-part interview-prep entries, see [`interview-prep/`](interview-prep/) — this handbook is the skim-before-you-walk-in version.

---

## 📑 Quick Navigation Index

- [Roles & Responsibilities](#-roles--responsibilities)
- [TypeScript Core Concepts](#-typescript-core-concepts)
  - [Types & Interfaces](#types--interfaces)
  - [async/await](#asyncawait)
  - [Dependency Management](#dependency-management)
- [Playwright Concepts](#-playwright-concepts)
  - [Fixtures](#fixtures)
  - [Auto-Waiting](#auto-waiting)
  - [Dialogs, Frames & Tabs](#dialogs-frames--tabs)
  - [Locator Strategies](#locator-strategies)
  - [Parallel Execution](#parallel-execution)
- [Framework Design](#-framework-design)
- [CI/CD Integration](#-cicd-integration)
- [QA Process & Strategy](#-qa-process--strategy)
- [Python ↔ TypeScript](#-python--typescript)
- [Key Takeaways](#-key-takeaways)

---

## 🧑‍💻 Roles & Responsibilities

Automation Engineers own the testing lifecycle end-to-end: requirement analysis, test design, automation, defect management, and release validation. Senior QAs extend this with framework maintenance, CI/CD pipeline ownership, code reviews, mentoring juniors, and test strategy contributions.

👉 **Interview emphasis:** ownership language (framework, CI/CD, mentoring) rather than just execution.

---

## 🟦 TypeScript Core Concepts

### Types & Interfaces

- Types turn contract drift into compile-time errors — highest value on fixtures, test data, and API payloads.
- `strict: true` is where the safety actually comes from; without it you get syntax only.
- `interface` merges declarations; `type` handles unions and mapped types. Pick one for consistency.

### async/await

- Every Playwright call crosses to the browser, so it returns a Promise — **including `expect()` on locators**.
- A **missing `await` is the #1 cause of "flaky" TS tests**. Enable `@typescript-eslint/no-floating-promises`.
- Use `Promise.all` to start listening *before* a click that opens a popup.

### Dependency Management

- `package.json` + **committed lockfile**; `npm ci` in CI for byte-identical installs.
- Test tooling belongs in `devDependencies`.
- `npx playwright install` — browser binaries are a separate download from the npm package.

---

## 🎭 Playwright Concepts

### Fixtures

- Built-in: `page`, `context`, `browser`, `request`. Custom via `base.extend<T>()`.
- **Lazy** — only run if a test requests them. Code after `await use(...)` is **teardown**.
- `{ scope: 'worker' }` for expensive setup like auth state.

### Auto-Waiting

- Actionability checks before every action: attached, visible, stable, receives events, enabled.
- Web-first assertions retry until true or timeout — no implicit/explicit choice to make.
- Manual waits only for edge cases: `waitForLoadState('networkidle')`, `waitForResponse()`.

### Dialogs, Frames & Tabs

- Dialogs are **events**: `page.on('dialog', …)` **before** the action → `accept()` / `dismiss()`.
- Frames: `frameLocator()` scopes queries into the iframe.
- Tabs: `Promise.all([context.waitForEvent('page'), click()])` — listen before clicking.

### Locator Strategies

- Prefer `getByRole` / `getByLabel` / `getByText` / `getByTestId` — resilient to markup change, plus a light a11y check.
- Chain `.filter()` rather than writing one clever selector.
- Strict mode: multiple matches **throw** instead of silently taking the first.
- CSS/XPath only when there's no accessible name.

### Parallel Execution

- Workers are separate processes; files parallel by default, tests within a file serial unless `fullyParallel`.
- Requires genuine test independence — no shared mutable state.
- `--shard=1/4` across CI machines; merge `blob` reports afterwards.
- **`storageState` auth reuse is usually the biggest speed win** — bigger than adding workers.

---

## 🏗 Framework Design

- **Page Objects own selectors** — the only place they live, so a UI change is a one-file fix.
- **Page Objects never assert** — they expose actions and state; the test decides correctness.
- **Specs never touch raw locators.**
- Data-driven = `for…of` loop around `test()`, with a **unique interpolated title per case**.
- Fixtures centralise setup so no spec duplicates it.

---

## ⚙️ CI/CD Integration

- `npm ci` → `npx playwright install --with-deps` → `npx playwright test`.
- **Path-filter workflows per project** in a monorepo so unrelated edits don't trigger every suite.
- Upload report + traces with `if: always()` — a red build with no artifacts isn't actionable.
- `forbidOnly: true` in CI so a stray `test.only` fails the build.
- Debugging: **trace viewer** for failures, `--ui` for authoring, `--debug` for step-through.

---

## 📊 QA Process & Strategy

- Lifecycle: requirement analysis → test design → automation → defect reporting → regression → release validation.
- **Automate by** repeatability × stability × business risk. Volatile UI stays manual until it settles.
- **Flaky tests:** confirm → read the trace → fix root cause (missing await / loose locator / shared state) → quarantine if unresolved. Retries only for genuine external unreliability.
- **Pyramid:** push logic and validation to API tests; UI tests only where the interaction itself is under test.
- **Defect disputes:** evidence → impact → discussion → triage → documented decision.

---

## 🔄 Python ↔ TypeScript

| Concern | Python | TypeScript |
|---|---|---|
| Fixtures | `@pytest.fixture` | `base.extend<T>()` |
| Data-driven | `@pytest.mark.parametrize` | `for…of` around `test()` |
| Assertions | `to_be_visible()` | `await …toBeVisible()` |
| Async | sync API | everything async |
| `toHaveURL` | string / compiled regex | string / regex / **predicate** |
| Load testing | Locust | Artillery |

Naming these precisely signals you understand Playwright, not just one binding.

---

## ✅ Key Takeaways

- TypeScript + Playwright = one multi-browser API, auto-waiting, and the same language and types as the app under test.
- **Await everything** — including assertions. Lint for floating promises.
- Selectors live in Page Objects; Page Objects don't assert.
- Emphasize framework ownership and CI/CD integration in interviews.
- Hedge honestly: *"can be faster"*, not *"is faster"*.
- Always align automation practices with responsible-use policies — never load-test infrastructure you don't own.
