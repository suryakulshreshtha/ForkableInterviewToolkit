# 2. TypeScript for Test Automation — Core Concepts

Language fundamentals as they show up in automation work. §2.2 covers the single most common cause of 'flaky' TypeScript tests — a missing `await`.

---

### 2.1 How Do Types and Interfaces Help in a Test Framework?

**Source:** Commonly asked — TypeScript fundamentals round.

#### 1. Direct Answer

Types turn a whole class of runtime failures into compile-time errors. In a test framework the highest-value places are: fixture shapes (`base.extend<MyFixtures>()` makes every fixture name and type known to every spec), test-data files (`resolveJsonModule` types your JSON), and API response payloads.

`interface` and `type` are near-interchangeable; `interface` supports declaration merging, `type` handles unions and mapped types. Most framework code uses `type`.

Strict mode is where the value actually comes from — `strict: true`, `noUnusedLocals`, `noImplicitReturns`. Without it you get TypeScript's syntax and none of its safety.

#### 2. Real-Time Project Example

Typing the fixture object means a spec asking for `{ practicePage }` gets full autocomplete on its methods, and renaming a Page Object method breaks the build instead of failing at 2am in CI.

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
});

// Every spec now gets typed, autocompleted fixtures:
test('login', async ({ practicePage, appUrl }) => {
  // practicePage is fully typed -- typos fail the build, not the run
});
```

#### 5. Interview-Ready Answer

> "I type fixtures, test data, and API payloads so contract drift fails at compile time rather than in CI. Strict mode is what makes that real — without it you get the syntax and none of the safety."

#### 6. Important Interview Point

- If asked `interface` vs `type`: interfaces merge declarations, types do unions and mapped types. Pick one for consistency; don't pretend there's a deep difference for most framework code.

#### 7. One-Line Revision

⚡ **Types catch contract drift at compile time — fixtures, test data, and API payloads are where it pays off most.**

---
### 2.2 How Does async/await Work, and Why Is Everything in Playwright Async?

**Source:** Commonly asked — the single most common source of flaky TS test code.

#### 1. Direct Answer

Nearly every Playwright call crosses a process boundary to the browser, so it returns a Promise. `await` suspends the async function until that Promise settles, letting you write sequential-looking code without blocking the event loop.

The number-one bug in TS test code is a **missing `await`**: the action fires, the test moves on, and you get a race condition that looks like flakiness. `expect()` assertions on locators are async too and must be awaited.

For genuinely independent work use `Promise.all` — essential for the click-that-opens-a-popup pattern, where you must start listening *before* the click.

#### 2. Real-Time Project Example

A test clicked Submit without awaiting, then asserted on the result. It passed locally on a fast machine and failed ~30% of the time in CI — classic missing-await, misdiagnosed as a flaky environment for two sprints.

#### 3. Coding / Practical Example

```typescript
// WRONG -- no await: the click may not have finished
page.getByRole('button', { name: 'Submit' }).click();
await expect(page.locator('#result')).toBeVisible();

// RIGHT
await page.getByRole('button', { name: 'Submit' }).click();
await expect(page.locator('#result')).toBeVisible();

// Promise.all -- start listening BEFORE the click that triggers the popup
const [popup] = await Promise.all([
  context.waitForEvent('page'),
  page.getByRole('link', { name: 'Open' }).click(),
]);
```

#### 4. STAR Method Answer

| | |
|---|---|
| **S — Situation** | A regression suite failed intermittently in CI but passed locally, and the team had written it off as environment flakiness. |
| **T — Task** | I needed to find the real cause before the failures started masking genuine regressions. |
| **A — Action** | I enabled the `no-floating-promises` ESLint rule, which immediately surfaced several missing `await` calls on clicks and assertions. |
| **R — Result** | The intermittent failures disappeared. The rule now runs in CI, so the same class of bug can't reach main again. |

#### 5. Interview-Ready Answer

> "Everything crossing to the browser returns a Promise, so it must be awaited — including `expect()` on locators. A missing await is the most common cause of 'flaky' TS tests, and `@typescript-eslint/no-floating-promises` catches it at lint time."

#### 6. Important Interview Point

- Turn on `no-floating-promises`. It converts the most common flakiness cause in TS automation from a 2am CI mystery into a red squiggle in your editor.

#### 7. One-Line Revision

⚡ **Every Playwright call returns a Promise — await it, including assertions; lint for floating promises.**

---
### 2.3 How Do You Manage Dependencies and Config in a TypeScript Project?

**Source:** Commonly asked — setup / environment round.

#### 1. Direct Answer

`package.json` declares dependencies and the scripts everyone runs; `package-lock.json` pins the exact resolved tree and **must** be committed so CI and local installs match. Test tooling belongs in `devDependencies`.

`tsconfig.json` controls compilation: `strict` for safety, `include`/`exclude` to scope what's checked, and `paths` for import aliases instead of `../../../`.

Always run `npx playwright install` after installing packages — the npm package and the browser binaries are separate downloads.

#### 2. Real-Time Project Example

A new engineer clones the repo, runs `npm ci && npx playwright install`, and is running the full suite in minutes with a byte-identical dependency tree to CI.

#### 3. Coding / Practical Example

```bash
npm install                    # dev: updates package-lock.json
npm ci                         # CI: installs exactly from the lockfile
npx playwright install --with-deps

npm test                       # scripts keep commands consistent for everyone
npm run typecheck
```

#### 5. Interview-Ready Answer

> "Dependencies in package.json with a committed lockfile, `npm ci` in CI for reproducibility, tsconfig for strictness and path aliases, and `playwright install` for the browser binaries — which are a separate download from the npm package."

#### 6. Important Interview Point

- `npm ci` vs `npm install` is a common probe: `ci` installs exactly from the lockfile and fails if package.json disagrees. That's what you want in a pipeline.

#### 7. One-Line Revision

⚡ **package.json + committed lockfile + `npm ci` + tsconfig strict + `playwright install` = reproducible setup.**

---

[← Back to interview-prep index](README.md)
