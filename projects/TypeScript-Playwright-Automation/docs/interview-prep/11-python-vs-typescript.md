# 11. Python ↔ TypeScript — What Actually Differs

Playwright's two most popular bindings share concepts but differ in real, nameable ways. Interviewers use these differences to separate people who've genuinely used a binding from people who've read about "Playwright" in the abstract.

This repo has both editions, so every row below is backed by working code in the two projects.

---

## Quick reference

| Concern | Python | TypeScript |
|---|---|---|
| Runner | pytest | `@playwright/test` |
| Config | `pytest.ini` / `pyproject.toml` | `playwright.config.ts` |
| Custom fixtures | `@pytest.fixture` in `conftest.py` | `base.extend<T>()` |
| Data-driven | `@pytest.mark.parametrize` | `for…of` loop around `test()` |
| Test selection | markers, `-m smoke` | tags in title, `--grep @smoke` |
| Assertions | `expect(x).to_be_visible()` | `await expect(x).toBeVisible()` |
| Async | sync API by default | everything async |
| Parallelism | `pytest-xdist` | built-in workers |
| BDD | pytest-bdd | playwright-bdd |
| Load testing | Locust | Artillery |
| Dependencies | `requirements.txt` | `package.json` + lockfile |

---

## The four that actually matter

### 1. Fixtures — a real API difference, not just syntax

TypeScript has `base.extend()`, a **Playwright-specific** fixture mechanism. Python has no equivalent; it uses pytest's own fixture system instead.

```python
# Python — pytest's mechanism, not Playwright's
@pytest.fixture
def app_url():
    return os.getenv("BASE_URL", "https://qa.myshop.com")
```

```typescript
// TypeScript — Playwright's own, and typed
export const test = base.extend<MyFixtures>({
  appUrl: async ({}, use) => {
    await use(process.env.BASE_URL ?? 'https://qa.myshop.com');
  },
});
```

The TS version gives every spec compile-time knowledge of the fixture's name and type. The Python version is more familiar to anyone who already knows pytest.

**Worth saying out loud:** *"`base.extend()` is a Playwright API; in Python the same job is done by pytest fixtures."* That one sentence signals you understand both.

---

### 2. Async — the single biggest practical difference

Python's sync API means no `await` anywhere. TypeScript is async throughout, and a **missing `await` is the number-one cause of "flaky" TS tests** — the action fires, the test moves on, and you get a race that only shows up under CI load.

```typescript
// WRONG — the click may not have completed
page.getByRole('button', { name: 'Submit' }).click();
await expect(page.locator('#result')).toBeVisible();

// RIGHT
await page.getByRole('button', { name: 'Submit' }).click();
await expect(page.locator('#result')).toBeVisible();
```

Enable `@typescript-eslint/no-floating-promises` and this whole class of bug becomes a lint error instead of a 2am CI mystery. Python simply cannot have this bug in the sync API.

---

### 3. Data-driven — decorator vs loop

```python
# Python
@pytest.mark.parametrize("user,expected", [
    ("valid_user", "/dashboard"),
    ("bad_user", "/login?error=1"),
])
def test_login(page, user, expected):
    ...
```

```typescript
// TypeScript — no parametrize; a loop registers each test at collection time
for (const { user, expected } of cases) {
  test(`login as ${user}`, async ({ page }) => {
    // ...
  });
}
```

The TS gotcha: **interpolate the data into the title**. Duplicate test titles make reports ambiguous and break `--grep`. pytest generates unique IDs for you; TypeScript does not.

---

### 4. `toHaveURL` — a genuine signature difference

This one bites people porting code between the two:

```python
# Python — string or COMPILED REGEX only.
expect(page).to_have_url(re.compile(r"AutomationPractice"))

# A lambda raises: "value must be a string or regular expression"
```

```typescript
// TypeScript — string, regex, OR a predicate function
await expect(page).toHaveURL(/AutomationPractice/);
await expect(page).toHaveURL((url) => url.pathname.includes('AutomationPractice'));
```

The predicate form is JS-only. Assuming otherwise produces a confusing runtime error rather than anything that looks like an API mismatch.

---

## Which should you learn?

Both, eventually — but pick based on context, and be able to defend it:

- **TypeScript** if your front-end is JS/TS. Tests live beside the app, reuse its types, and new Playwright features land in this API first.
- **Python** if your team already lives in Python, or you need the data/ML ecosystem for test-data generation and analysis.

The honest interview answer: *"They're the same engine with different ergonomics. I picked X because of Y about my team."* Claiming one is objectively superior is a weaker answer than explaining the fit.

---

[← Back to interview-prep index](README.md)
