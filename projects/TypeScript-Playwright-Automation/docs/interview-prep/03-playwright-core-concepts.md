# 3. Playwright — Core Concepts

Fixtures, auto-waiting, dialogs, locators, parallelism. Running versions of all of it live in [`../../framework/`](../../framework/).

---

### 3.1 What Are Fixtures in Playwright, and How Do You Write Custom Ones?

**Source:** Commonly asked — Playwright technical round. This is where the TS API differs most from Python.

#### 1. Direct Answer

Fixtures are reusable, lazily-initialised test dependencies. Playwright ships `page`, `context`, `browser`, and `request`; you add your own with `base.extend<T>()`.

Two properties make them more than just setup helpers: they're **lazy** (a fixture only runs if a test actually requests it) and **automatically torn down** (everything after `await use(...)` runs as cleanup, even if the test fails).

Scope matters: `{ scope: 'worker' }` runs once per worker process rather than per test — the right choice for expensive setup like a logged-in auth state.

This is a genuine API difference from Python, where the same job is done by pytest's `@pytest.fixture` rather than anything Playwright-specific.

#### 2. Real-Time Project Example

Rather than hardcoding the app URL in every spec, an `appUrl` fixture resolves it from an env var with a QA default and injects it into any test that asks.

#### 3. Coding / Practical Example

```typescript
type MyFixtures = {
  appUrl: string;
  practicePage: AutomationPracticePage;
};

export const test = base.extend<MyFixtures>({
  appUrl: async ({}, use) => {
    await use(process.env.BASE_URL ?? 'https://qa.myshop.com');
  },

  practicePage: async ({ page, appUrl }, use) => {
    const po = new AutomationPracticePage(page);
    await page.goto(appUrl);
    await use(po);          // test body runs here
    // anything after use() is teardown -- runs even on failure
  },
});
```

#### 5. Interview-Ready Answer

> "Fixtures are lazy, automatically-torn-down test dependencies. Playwright provides page and context; I add custom ones with base.extend() for app URLs, Page Objects, authenticated sessions, and API clients. Worker-scoped fixtures handle expensive setup like auth state."

#### 6. Important Interview Point

- Know that code after `await use(...)` is teardown, and that fixtures are lazy — both come up as follow-ups, and both are things people who've only copy-pasted fixtures tend to miss.

#### 7. One-Line Revision

⚡ **Fixture = lazy, auto-torn-down dependency via base.extend(); code after `use()` is teardown.**

---
### 3.2 How Does Playwright's Auto-Waiting Differ From Selenium's Waits?

**Source:** Commonly asked — Playwright vs Selenium comparison round.

#### 1. Direct Answer

Selenium makes you choose between a global implicit wait and a targeted explicit wait. Playwright removes the choice: every action runs **actionability checks** first — element attached, visible, stable, receives events, enabled — retrying until they pass or the timeout expires.

Web-first assertions work the same way: `expect(locator).toBeVisible()` polls until true or timeout.

Playwright can be faster in many setups thanks to efficient browser communication, lightweight contexts, and parallel workers — but framework design, infrastructure, and test data affect runtime too, so I wouldn't claim it's universally faster.

Manual waits are for genuine edge cases only: `waitForLoadState('networkidle')`, `waitForResponse()`, or a custom event.

#### 2. Real-Time Project Example

A suite ported from Selenium still carried explicit-wait scaffolding out of habit. Removing it made the tests shorter and, in most cases, more stable — the leftover waits were fighting Playwright's own retries.

#### 3. Coding / Practical Example

```typescript
// No wait code needed -- actionability checks are automatic
await page.getByRole('button', { name: 'Login' }).click();
await expect(page.locator('#dashboard')).toBeVisible();

// Manual waits: reserved for what auto-waiting can't cover
await page.waitForLoadState('networkidle');
await page.waitForResponse((r) => r.url().includes('/api/orders'));
```

#### 4. STAR Method Answer

| | |
|---|---|
| **S — Situation** | After migrating from Selenium, the team kept writing explicit-wait-style code out of habit. |
| **T — Task** | I needed to show most of it was redundant and get the team trusting Playwright's actionability checks. |
| **A — Action** | I removed the redundant waits, replaced sleeps with web-first assertions, and kept `waitForLoadState` only for the few genuine network-idle cases. |
| **R — Result** | The suite got shorter and easier to read with no loss of stability — in most cases stability improved. |

#### 5. Interview-Ready Answer

> "Playwright runs actionability checks before every action and retries web-first assertions until they pass, so there's no implicit-vs-explicit choice to make. I only add a manual wait for things auto-waiting can't see, like network idle or a specific API response."

#### 6. Important Interview Point

- Don't overclaim speed — “can be faster,” not “always faster.”
- Know the actionability checks by name: attached, visible, stable, receives events, enabled.
- Leftover Selenium-style waits in a Playwright repo are a code smell worth calling out.
- `storageState` auth reuse is usually a bigger speed win than any wait tuning.

#### 7. One-Line Revision

⚡ **Actionability checks + retrying assertions replace implicit/explicit waits entirely.**

---
### 3.3 How Do You Handle Alerts, Frames, and New Tabs?

**Source:** Commonly asked — practical Playwright round.

#### 1. Direct Answer

**Dialogs** are events, not a context you switch into: register `page.on('dialog', ...)` *before* the triggering action, then `accept(text)` or `dismiss()`. Without a handler Playwright auto-dismisses, which can silently break a flow expecting a prompt value.

**Frames** use `frameLocator()`, which scopes queries into the iframe's document — no switch-in/switch-out bookkeeping.

**New tabs** arrive as `page` events on the context. Use `Promise.all` so you're listening before the click that opens them.

#### 2. Real-Time Project Example

A prompt asks for a customer reference: register the handler, trigger the action, and the handler supplies the text and accepts.

#### 3. Coding / Practical Example

```typescript
// Dialogs -- handler FIRST, then the action
page.on('dialog', async (dialog) => {
  expect(dialog.type()).toBe('prompt');
  await dialog.accept('TEST-1001');
});
await page.click('#open-prompt-button');

// Frames
const frame = page.frameLocator('#courses-iframe');
await expect(frame.getByRole('heading')).toBeVisible();

// New tabs
const [newPage] = await Promise.all([
  context.waitForEvent('page'),
  page.click('#opentab'),
]);
await newPage.waitForLoadState('domcontentloaded');
```

#### 5. Interview-Ready Answer

> "Dialogs are event-driven — register the handler before the action, then accept or dismiss. Frames use frameLocator() to scope queries, and new tabs come through context page events, captured with Promise.all so you're listening before the click."

#### 6. Important Interview Point

- The ordering trap is the real question here: register the dialog listener, or start waiting for the popup, BEFORE the action. Get that backwards and it fails intermittently.

#### 7. One-Line Revision

⚡ **Dialogs = page.on('dialog') before the action; frames = frameLocator(); tabs = Promise.all + waitForEvent('page').**

---
### 3.4 What Locator Strategies Does Playwright Recommend?

**Source:** Commonly asked — one of the most frequent Playwright-specific questions.

#### 1. Direct Answer

Playwright pushes user-facing locators first: `getByRole`, `getByLabel`, `getByText`, `getByPlaceholder`, `getByTestId`. They mirror how a real user or screen reader finds an element, so they survive markup churn far better than CSS or XPath.

`getByRole` is the strongest default because it asserts the accessible role and name — which doubles as a light accessibility check.

CSS/XPath remain available for elements with no accessible name. Chaining (`.filter()`, `.and()`, `.nth()`) usually beats writing one clever selector.

Strict mode is on by default: a locator resolving to multiple elements throws rather than silently taking the first. That's a feature — it catches ambiguity early.

#### 2. Real-Time Project Example

Preferring `getByRole('button', { name: 'Login' })` over `div.form > button:nth-child(3)` means a markup refactor doesn't quietly break the locator.

#### 3. Coding / Practical Example

```typescript
await page.getByRole('button', { name: 'Login' }).click();
await page.getByLabel('Username').fill('test_user');
await page.getByPlaceholder('Search products').fill('headphones');
await page.getByTestId('cart-icon').click();

// Filtering beats a clever selector
await page
  .getByRole('listitem')
  .filter({ hasText: 'Forkable Mug' })
  .getByRole('button', { name: 'Add to cart' })
  .click();

// CSS fallback when there's no accessible name
await page.locator('#dashboard').click();
```

#### 5. Interview-Ready Answer

> "I default to role, label, and text locators because they mirror how users find elements and survive restyles. CSS or XPath is the fallback for elements with no accessible name, and I chain filters rather than writing one brittle selector."

#### 6. Important Interview Point

- Interviewers probe *why*, not *what*. Lead with resilience to markup change and the accessibility side-benefit — not “it's the newer API.”

#### 7. One-Line Revision

⚡ **Prefer getByRole/Label/Text; chain .filter(); CSS/XPath only as fallback.**

---
### 3.5 How Does Parallel Execution Work in Playwright Test?

**Source:** Commonly asked — scaling / performance round.

#### 1. Direct Answer

Playwright Test parallelises by default across **worker processes** — separate Node processes, each with its own browser instance, so tests are isolated. Files run in parallel; tests within a file run serially unless you opt in with `test.describe.configure({ mode: 'parallel' })`.

`workers` controls the count; `fullyParallel: true` parallelises at test level across all files.

The prerequisite is **test independence**: no shared mutable state, no ordering assumptions, no fighting over the same account or record.

For very large suites, **sharding** (`--shard=1/4`) splits across CI machines, with `blob` reporters merged afterwards into one report.

The biggest single speed win usually isn't more workers — it's reusing authentication via `storageState` so every test doesn't log in through the UI.

#### 2. Real-Time Project Example

A 40-minute suite dropped to ~10 by enabling 4 workers and adding a setup project that logs in once and saves `storageState` for everyone else to reuse.

#### 3. Coding / Practical Example

```typescript
// playwright.config.ts
export default defineConfig({
  workers: process.env.CI ? 4 : undefined,
  fullyParallel: true,

  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      use: { storageState: 'playwright/.auth/user.json' },
      dependencies: ['setup'],   // login once, reuse everywhere
    },
  ],
});
```

Sharding across CI machines:

```bash
npx playwright test --shard=1/4
npx playwright merge-reports --reporter=html ./blob-report
```

#### 5. Interview-Ready Answer

> "Playwright parallelises across worker processes by default, with files parallel and tests within a file serial unless configured otherwise. It only works if tests are independent. For big suites I shard across CI machines, and I reuse auth via storageState — usually a bigger win than adding workers."

#### 6. Important Interview Point

- If asked how to speed up a slow suite, don't just say “more workers.” Lead with auth reuse via storageState and cutting UI steps that could be API calls.

#### 7. One-Line Revision

⚡ **Workers parallelise by file; fullyParallel goes per-test; shard across machines; storageState is the real speed win.**

---

[← Back to interview-prep index](README.md)
