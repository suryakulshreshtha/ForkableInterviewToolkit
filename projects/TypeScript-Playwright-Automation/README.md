# TypeScript-Playwright-Automation

> Interview notes with runnable proof attached. TypeScript · Playwright Test · playwright-bdd · Artillery ^_^

Part of [**ForkableInterviewToolkit**](../../README.md). Fully self-contained — you can run everything here without touching the rest of the repo.

---

## Quickstart

```bash
cd projects/TypeScript-Playwright-Automation

npm ci                                # or: npm install
npx playwright install --with-deps

npm run verify:selectors              # ~20s markup health check
npm test
```

---

## Layout

```
TypeScript-Playwright-Automation/
├── playwright.config.ts        # projects, workers, reporters, tracing
├── tsconfig.json               # strict mode + path aliases
├── package.json
├── scripts/
│   └── verify-selectors.ts     # one-command locator health check
├── docs/
│   ├── TypeScript_QA_Automation_Handbook.md   # single-file quick reference
│   └── interview-prep/         # 12 chapters, 29 entries, 7-part format
├── framework/
│   ├── pages/                  # Page Objects — actions only, never assertions
│   ├── fixtures/               # base.extend() custom fixtures
│   ├── utils/                  # config helpers
│   ├── test-data/              # synthetic JSON data
│   └── tests/                  # the suite (22 tests × 3 browsers)
└── examples/
    ├── api-testing/            # request fixture vs a public mock API
    ├── bdd-playwright-bdd/     # Gherkin bound to TypeScript steps
    └── load-artillery/         # load testing — local target only
```

---

## Running things

```bash
npm test                             # full suite, all 3 browsers
npm run test:smoke                   # --grep @smoke
npm run test:ui                      # --grep @ui
npm run test:headed                  # watch it drive
npm run test:firefox                 # single browser
npm run test:debug                   # Playwright Inspector

npx playwright test --ui             # UI mode — best for authoring
npm run report                       # open the HTML report
npm run trace test-results/**/trace.zip

npm run typecheck                    # tsc --noEmit
```

Tags: `@smoke`, `@ui`, `@table`, `@dialogs` — filtered with `--grep`.

### Examples (each has its own config)

```bash
npm run test:api                     # API tests vs reqres.in
npm run test:bdd                     # generates specs from .feature, then runs

npm run load:target                  # terminal 1 — local Express target
npm run load:run                     # terminal 2 — guard, then Artillery
```

---

## Design decisions worth defending in an interview

| Decision | Reasoning |
|---|---|
| **Selectors live only in Page Objects** | Markup changes = one-file fix, specs untouched |
| **Page Objects never assert** | They expose actions and state; the test owns correctness |
| **Tables located by header text** | `.filter({ hasText: 'Instructor' })` survives a restyle; a CSS class doesn't |
| **Fixture logic shared, not duplicated** | `definitions.ts` is imported by both the framework and BDD bases, which have different fixture types |
| **`strict: true` + `noUnusedLocals`** | Without strict mode you get TypeScript's syntax and none of its safety |
| **Zero `waitForTimeout`** | Playwright auto-waits; fixed sleeps are slower *and* flakier |
| **Examples have separate configs** | `npm test` stays fast and focused on the framework suite |
| **Config via env vars** | Same code runs locally and in CI |

Each maps to a chapter in [`docs/interview-prep/`](docs/interview-prep/) — notes and code are meant to be read together.

---

## Test target & responsible use

UI tests run against **[rahulshettyacademy.com/AutomationPractice](https://rahulshettyacademy.com/AutomationPractice/)**, published publicly by Rahul Shetty Academy for automation practice. Thanks to them for hosting it. 🙏

- ✅ Functional tests, one CI pass per push
- ❌ **No load testing against it** — Artillery ships its own local Express target plus a guard that hard-exits on any non-localhost target
- ❌ No scraping or republishing its content
- ❌ No credentials committed anywhere (the site needs none)

It's third-party and can change without notice. `npm run verify:selectors` tells you in ~20 seconds whether a failure is your code or their markup.

> **Status:** the selectors here are the same set verified passing in the [Python project](../Python-Playwright-Automation/). The TypeScript suite has been typechecked and its 66 test cases collected, but has not yet had a full green run against the live site — run `npm run verify:selectors` and `npm test` on first clone.

---

## Where the docs live

- [`docs/TypeScript_QA_Automation_Handbook.md`](docs/TypeScript_QA_Automation_Handbook.md) — one-file condensed reference
- [`docs/interview-prep/`](docs/interview-prep/) — the full guide, every entry in the same seven-part format:

  > Direct Answer → Real-Time Example → Code → STAR Answer → Interview-Ready Answer → Interview Tip → One-Line Revision

Coming from the Python project? [Chapter 11](docs/interview-prep/11-python-vs-typescript.md) isolates exactly what differs between the two bindings.
