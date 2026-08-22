# 4. Test Automation Framework Design

The deepest-dive question in most automation interviews. The framework described here is the one actually implemented in [`../../framework/`](../../framework/).

---

### 4.1 Explain Your TypeScript + Playwright Framework in Detail

**Source:** Commonly asked — the deepest-dive question in most automation interviews.

#### 1. Direct Answer

A good answer covers folder structure *and* execution flow. This framework contains:

- `framework/tests/` — spec files, organised by feature.
- `framework/pages/` — Page Object classes; the only place selectors live.
- `framework/fixtures/` — custom fixtures via `base.extend()`; shared setup.
- `framework/utils/` — config helpers and reusable utilities.
- `framework/test-data/` — JSON data, typed via `resolveJsonModule`.
- `playwright.config.ts` — projects, workers, retries, reporters, baseURL, trace settings.
- `examples/` — standalone demos (API, BDD, load), each with its own config.
- `scripts/` — maintenance tooling such as the selector verifier.
- `.github/workflows/` — path-filtered CI.

The core principle is separation of concerns: specs describe business behaviour, Page Objects encapsulate UI interaction, fixtures centralise setup. A UI change should touch one Page Object, not fifty specs.

#### 2. Real-Time Project Example

E-commerce app, 500 regression specs. If the Login locator changes I update `LoginPage.ts` only. CI runs on every PR, publishes an HTML report, and the trace viewer root-causes failures.

#### 3. Coding / Practical Example

```text
TypeScript-Playwright-Automation/
├── playwright.config.ts
├── tsconfig.json
├── package.json
├── framework/
│   ├── pages/
│   │   ├── BasePage.ts
│   │   └── AutomationPracticePage.ts
│   ├── fixtures/
│   │   ├── definitions.ts
│   │   └── fixtures.ts
│   ├── utils/config.ts
│   ├── test-data/practice-data.json
│   └── tests/
│       ├── smoke.spec.ts
│       ├── ui-widgets.spec.ts
│       ├── dialogs-frames.spec.ts
│       └── web-table.spec.ts
├── examples/
│   ├── api-testing/
│   ├── bdd-playwright-bdd/
│   └── load-artillery/
└── scripts/verify-selectors.ts
```

#### 4. STAR Method Answer

| | |
|---|---|
| **S — Situation** | The suite was growing and UI changes were causing constant maintenance. |
| **T — Task** | We needed structure that allowed reuse and made failures fast to diagnose. |
| **A — Action** | I separated specs from Page Objects, centralised setup in fixtures, isolated every selector to one file per page, and wired CI to publish traces and HTML reports. |
| **R — Result** | Maintenance became a one-file change per UI update, and root-causing a CI failure went from guesswork to opening a trace. |

#### 5. Interview-Ready Answer

> "Specs describe behaviour, Page Objects own UI interaction and are the only place selectors live, fixtures centralise setup, and playwright.config.ts controls projects, workers, retries, and tracing. CI runs it per PR and publishes traces, so failures are diagnosable rather than just red."

#### 6. Important Interview Point

- Use your real folder names when you answer live, and be ready to trace one full test end-to-end: which fixture builds the page, which Page Object method runs, where the trace lands.

#### 7. One-Line Revision

⚡ **Framework = tests + pages (POM) + fixtures + utils + test-data + config + CI + trace reporting.**

---
### 4.2 How Do You Structure a Page Object Model in TypeScript?

**Source:** Commonly asked — the standard follow-up to any framework question.

#### 1. Direct Answer

A `BasePage` holds shared behaviour and the `page` reference. Each page extends it, declares its locators as `readonly` class properties, and exposes high-level actions (`login()`, `addToCart()`) that combine several low-level calls into one meaningful step.

Two rules matter more than the structure: **Page Objects never assert** — they perform actions and expose state, the test decides what's correct — and **specs never touch raw locators**, so a UI change is a one-file fix.

Locators are declared, not resolved, at construction time. Playwright locators are lazy, so building them in the constructor costs nothing and re-queries on each use.

#### 2. Real-Time Project Example

`LoginPage.login(user, pass)` wraps three calls, so every spec needing a login calls one method instead of three raw interactions.

#### 3. Coding / Practical Example

```typescript
export class BasePage {
  constructor(protected readonly page: Page) {}

  async open(path = ''): Promise<this> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    return this;
  }
}

export class LoginPage extends BasePage {
  readonly username: Locator;
  readonly password: Locator;
  readonly submit: Locator;

  constructor(page: Page) {
    super(page);
    this.username = page.getByLabel('Username');
    this.password = page.getByLabel('Password');
    this.submit = page.getByRole('button', { name: 'Login' });
  }

  async login(user: string, pass: string): Promise<void> {
    await this.username.fill(user);
    await this.password.fill(pass);
    await this.submit.click();
  }
}
```

#### 5. Interview-Ready Answer

> "A BasePage holds the page reference and shared navigation; each page declares readonly locators and exposes high-level actions. Page Objects never assert and specs never touch raw locators — that's what makes a UI change a one-file fix."

#### 6. Important Interview Point

- “Should Page Objects contain assertions?” is a deliberate trap. No — they expose state; the test asserts. Otherwise failure messages lose context and Page Objects turn into mini test suites.

#### 7. One-Line Revision

⚡ **BasePage + one class per page; readonly locators; actions not assertions; specs never see a selector.**

---
### 4.3 How Do You Do Data-Driven Testing in Playwright Test?

**Source:** Commonly asked — follow-up to framework design; a real API difference from pytest.

#### 1. Direct Answer

There's no `parametrize` decorator. You wrap `test()` in a plain loop — each iteration registers a separate test at collection time, so they run and report independently and parallelise normally.

The critical detail: **give each generated test a unique title**, usually by interpolating the data. Duplicate titles make reports ambiguous and break `--grep` targeting.

Data can be inline, imported JSON (`resolveJsonModule`), or read from CSV/API at module load. Anything available synchronously at collection time works.

#### 2. Real-Time Project Example

Running the same login spec against valid and invalid credential sets without duplicating the test body.

#### 3. Coding / Practical Example

```typescript
import data from '../test-data/users.json';

const cases = [
  { user: 'valid_user',   pass: 'valid_pass', expected: '/dashboard' },
  { user: 'invalid_user', pass: 'wrong',      expected: '/login?error=1' },
];

for (const { user, pass, expected } of cases) {
  // Unique title per case -- essential for reporting and --grep
  test(`login as ${user}`, async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Username').fill(user);
    await page.getByLabel('Password').fill(pass);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(new RegExp(expected));
  });
}
```

#### 5. Interview-Ready Answer

> "A `for...of` loop around `test()` — each iteration registers an independent test, so they parallelise and report separately. The one rule is a unique, data-derived title per case, or reports get ambiguous and --grep stops working."

#### 6. Important Interview Point

- If you know pytest, say so explicitly: 'TypeScript has no parametrize decorator; a loop around test() is the idiom.' Naming the difference shows you understand both, rather than pattern-matching one onto the other.

#### 7. One-Line Revision

⚡ **Loop around test() with a unique interpolated title per case — the TS answer to parametrize.**

---

[← Back to interview-prep index](README.md)
