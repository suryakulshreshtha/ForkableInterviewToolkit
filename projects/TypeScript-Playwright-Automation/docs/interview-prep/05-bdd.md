# 5. BDD With playwright-bdd

Gherkin bound to TypeScript steps, running on Playwright's own runner. Runnable version: [`../../examples/bdd-playwright-bdd/`](../../examples/bdd-playwright-bdd/).

---

### 5.1 Why Would You Use BDD, and When Is It Not Worth It?

**Source:** Commonly asked — BDD / process round.

#### 1. Direct Answer

BDD earns its place when the project benefits from a shared, business-readable specification that QA, developers, and stakeholders all use. Gherkin expresses behaviour as Given/When/Then; step definitions bind those lines to automation code.

The real value isn't English-like syntax — it's shared understanding, visible acceptance criteria, and traceability from business rule to automated test.

But I wouldn't adopt it just because it's popular. If nobody outside QA ever opens a `.feature` file, the extra indirection and step-definition maintenance is pure cost. That trade-off is the answer interviewers are actually listening for.

#### 2. Real-Time Project Example

For a banking transfer feature, the rule is expressed as a scenario describing customer, action, and expected result — reviewable by stakeholders before or alongside implementation.

#### 3. Coding / Practical Example

```gherkin
Feature: Login

  Scenario: Successful login
    Given the user is on the login page
    When the user enters valid credentials
    And clicks Login
    Then the dashboard should be displayed
```

#### 5. Interview-Ready Answer

> "I use BDD when it genuinely improves collaboration and makes acceptance criteria executable and readable. I evaluate whether non-QA people will actually read the scenarios before adopting it — otherwise it's indirection without the payoff."

#### 6. Important Interview Point

- Be ready to explain feature files, step definitions, hooks, tags, and how Gherkin maps to TypeScript step functions. And volunteer the downside — candidates who only sell BDD's upside sound junior.

#### 7. One-Line Revision

⚡ **BDD = shared behaviour spec + collaboration + executable acceptance criteria — worth it only if non-QA people read it.**

---
### 5.2 How Do You Wire Gherkin to Playwright in TypeScript?

**Source:** Commonly asked — practical BDD implementation.

> 🆕 **New Addition:** Added so the BDD answer above has a concrete implementation to point at.

#### 1. Direct Answer

`playwright-bdd` generates real spec files from `.feature` files, which Playwright then runs on **its own test runner**. That's the deciding advantage over `@cucumber/cucumber`: custom fixtures, parallel workers, trace viewer, HTML reporter, and retries all keep working, because they aren't reimplemented.

Steps are plain functions from `createBdd(test)`, and they receive the same fixture object any normal spec does.

One wiring detail worth knowing: the `test` you pass to `createBdd` must be extended from `playwright-bdd`'s base, not `@playwright/test`, and the fixtures file must be listed in the config's `steps` so codegen can find it.

#### 2. Real-Time Project Example

Reusing the same Page Object and fixtures as the main suite, so BDD scenarios and normal specs share one framework rather than duplicating it.

#### 3. Coding / Practical Example

```typescript
import { createBdd } from 'playwright-bdd';
import { expect, test } from './fixtures';

const { Given, When, Then } = createBdd(test);

Given('the user is on the practice page', async ({ practicePage }) => {
  await expect(practicePage.dropdown).toBeVisible();
});

When('the user selects dropdown option {string}',
  async ({ practicePage }, value: string) => {
    await practicePage.selectDropdownByValue(value);
  });

Then('the dropdown should show {string}',
  async ({ practicePage }, value: string) => {
    await expect(practicePage.dropdown).toHaveValue(value);
  });
```

Generate specs, then run them:

```bash
npx bddgen --config=examples/bdd-playwright-bdd/playwright.config.ts
npx playwright test --config=examples/bdd-playwright-bdd/playwright.config.ts
```

#### 5. Interview-Ready Answer

> "playwright-bdd generates specs from .feature files and runs them on Playwright's own runner, so fixtures, workers, traces, and reporters all still work. Steps are plain functions receiving the same fixtures as any spec — it's a binding layer, not a second framework."

#### 6. Important Interview Point

- The `.features-gen/` output is generated — gitignore it. Committing generated specs means reviewing the same change twice and inevitable drift.

#### 7. One-Line Revision

⚡ **playwright-bdd = .feature → generated specs → Playwright's own runner, fixtures and traces intact.**

---

[← Back to interview-prep index](README.md)
