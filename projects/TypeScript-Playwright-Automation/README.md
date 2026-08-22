<div align="center">

# TypeScript-Playwright-Automation

**Interview notes with runnable proof attached.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-Test-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev/)
[![playwright-bdd](https://img.shields.io/badge/BDD-playwright--bdd-6DB33F)](https://vitalets.github.io/playwright-bdd/)
[![Artillery](https://img.shields.io/badge/Load-Artillery-FF5A5F)](https://www.artillery.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../../LICENSE)

*Part of [**ForkableInterviewToolkit**](../../README.md) — fully self-contained, runs without touching the rest of the repo.*

</div>

---

## ⚡ Quickstart

```bash
cd projects/TypeScript-Playwright-Automation

npm ci                                # exact versions from package-lock
npx playwright install --with-deps    # browser binaries

npm run verify:selectors              # ~20s markup health check
npm test                              # 22 tests × 3 browsers
```

> **First time here?** Run `verify:selectors` before `test`. It checks all 16 locators against the live practice site in one pass and tells you instantly whether a failure is *your code* or *their markup*.

---

## 🗂 Layout

```
TypeScript-Playwright-Automation/
│
├── playwright.config.ts          # main suite: projects, workers, reporters, tracing
├── playwright.bdd.config.ts      # BDD only — keeps `npm test` fast
├── playwright.api.config.ts      # API only — no browser needed
├── tsconfig.json                 # strict mode + path aliases
├── package.json
│
├── scripts/
│   ├── verify-selectors.ts       # one-command locator health check
│   └── run-load-test.ts          # guarded Artillery runner (local targets only)
│
├── docs/
│   ├── TypeScript_QA_Automation_Handbook.md    # single-file quick reference
│   └── interview-prep/                          # 12 chapters · 29 entries · 7-part format
│
├── framework/
│   ├── pages/                    # Page Objects — actions only, never assertions
│   ├── fixtures/                 # base.extend() custom fixtures
│   ├── utils/                    # config + test-data loading
│   ├── test-data/                # synthetic JSON
│   └── tests/                    # 4 spec files, 22 tests
│
└── examples/
    ├── api-testing/              # request fixture vs a public mock API
    ├── bdd-playwright-bdd/       # Gherkin bound to TypeScript steps
    └── load-artillery/           # load testing — local Express target only
```

---

## 🏃 Running things

### Main suite

| Command | What it does |
|---|---|
| `npm test` | Full suite — 22 tests × 3 browsers |
| `npm run test:smoke` | Critical path only (`--grep @smoke`) |
| `npm run test:headed` | Watch the browser drive |
| `npm run test:firefox` | Single browser |
| `npm run test:ui` | **Playwright UI mode** — best for authoring |
| `npm run test:debug` | Playwright Inspector, step-through |

**Tags:** `@smoke` · `@ui` · `@table` · `@dialogs` — filter any of them with `npx playwright test --grep @table`.

### Reporting & debugging

```bash
npm run report                                  # open the HTML report
npm run trace test-results/**/trace.zip         # replay a failed run, step by step
npm run typecheck                               # tsc --noEmit, no test run
```

### Examples (each has its own config)

```bash
npm run test:api        # API tests vs reqres.in — no browser
npm run test:bdd        # generates specs from .feature, then runs them

npm run load:target     # terminal 1 — local Express target
npm run load:test       # terminal 2 — guard check, then Artillery
```

---

## 🧠 Design decisions worth defending in an interview

| Decision | Reasoning |
|---|---|
| **Selectors live only in Page Objects** | Markup changes = one-file fix, specs untouched |
| **Page Objects never assert** | They expose actions and state; the test owns correctness |
| **Tables located by header text** | `.filter({ hasText: 'Instructor' })` survives a restyle; a CSS class doesn't |
| **Fixture logic shared, not duplicated** | `definitions.ts` feeds both the framework and BDD bases, which have incompatible fixture types |
| **`strict: true` + `noUnusedLocals`** | Without strict mode you get TypeScript's syntax and none of its safety |
| **Zero `waitForTimeout`** | Playwright auto-waits; fixed sleeps are slower *and* flakier |
| **Examples have separate configs** | `npm test` stays fast and focused on the framework suite |
| **Config via env vars** | Same code runs locally and in CI, no edits |

Each maps to a chapter in [`docs/interview-prep/`](docs/interview-prep/) — the notes and the code are meant to be read side by side.

---

## 🐍 ↔ 🟦 Coming from the Python project?

Same architecture, different plumbing. The honest differences:

| Concern | Python | TypeScript |
|---|---|---|
| Custom fixtures | `@pytest.fixture` in `conftest.py` | `base.extend()` — the *native* API |
| Data-driven | `@pytest.mark.parametrize` | `for…of` loop around `test()` |
| Test selection | markers (`-m smoke`) | tags (`--grep @smoke`) |
| API testing | `requests` library | `request` fixture, built in |
| Load testing | Locust + Flask | Artillery + Express |
| URL assertion | string or **compiled regex only** | string, regex, **or predicate** |

[**Chapter 11**](docs/interview-prep/11-python-vs-typescript.md) covers all of it in detail — including the gotchas that bite when you port habits across.

---

## 🛡 Test target & responsible use

UI tests run against **[rahulshettyacademy.com/AutomationPractice](https://rahulshettyacademy.com/AutomationPractice/)**, published publicly by Rahul Shetty Academy for automation practice. Thanks to them for hosting it. 🙏

| | Policy |
|---|---|
| ✅ | Functional tests, one CI pass per push |
| ❌ | **No load testing against it** — Artillery ships its own local Express target plus a guard that hard-exits on any non-localhost target |
| ❌ | No scraping or republishing its content |
| ❌ | No credentials committed anywhere (the site needs none) |

It's third-party and can change without notice. `npm run verify:selectors` is your first move whenever something breaks.

> **⚠️ Status:** these selectors are the same set **verified passing 22/22 in the [Python project](../Python-Playwright-Automation/)**. The TypeScript suite is typechecked with all 22 tests collected, but has not yet had a full green run against the live site. Run `verify:selectors` then `test` on first clone — or just check the CI badge on the [root README](../../README.md).

---

## 📚 Where the docs live

<table>
<tr>
<td width="50%" valign="top">

### 🚀 Quick reference
[`TypeScript_QA_Automation_Handbook.md`](docs/TypeScript_QA_Automation_Handbook.md)

One file. Skim it on the train before an interview.

</td>
<td width="50%" valign="top">

### 📖 Full guide
[`docs/interview-prep/`](docs/interview-prep/)

12 chapters, 29 entries, every one in the same shape.

</td>
</tr>
</table>

Every entry follows the same seven parts, so you always know where to look:

> **1.** Direct Answer → **2.** Real-Time Example → **3.** Code → **4.** STAR Answer → **5.** Interview-Ready Answer → **6.** Interview Tip → **7.** One-Line Revision

---

<div align="center">

**Fork it. Break it. Make it yours.** 🍴

[Root README](../../README.md) · [Python project](../Python-Playwright-Automation/) · [Contributing](../../CONTRIBUTING.md)

</div>
