# ForkableInterviewToolkit

> Forkable interview prep + runnable proof, one project per stack. For SDETs who'd rather read code than flashcards ^_^

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Python + Playwright](https://github.com/suryakulshreshtha/ForkableInterviewToolkit/actions/workflows/python-playwright.yml/badge.svg)](../../actions/workflows/python-playwright.yml)
[![TypeScript + Playwright](https://github.com/suryakulshreshtha/ForkableInterviewToolkit/actions/workflows/typescript-playwright.yml/badge.svg)](../../actions/workflows/typescript-playwright.yml)

Most interview-prep repos are a wall of questions with no code. Most framework demos are a wall of code with no explanation. This one is deliberately **both**, kept side by side so every claim in the notes has a runnable file backing it up.

---

## What's inside

| Project | Stack | Status |
|---|---|---|
| [`Python-Playwright-Automation`](projects/Python-Playwright-Automation/) | Python · Playwright · Pytest · pytest-bdd · Locust · GitHub Actions | ✅ Active |
| [`TypeScript-Playwright-Automation`](projects/TypeScript-Playwright-Automation/) | TypeScript · Playwright Test · playwright-bdd · Artillery · GitHub Actions | ✅ Active |
| _`API-Testing-Toolkit`_ | Python · requests · Schemathesis | 🕓 Planned |

Each project is **fully self-contained** — its own README, its own dependencies, its own test suite, its own CI workflow. Fork the repo and delete the projects you don't care about; nothing will break.

---

## Repo layout

```
ForkableInterviewToolkit/
├── README.md                    ← you are here
├── LICENSE                      ← MIT
├── CONTRIBUTING.md
├── docs/
│   └── ADDING-A-NEW-PROJECT.md  ← the contract every project follows
├── .github/workflows/
│   ├── python-playwright.yml       ← one workflow per project, path-filtered
│   └── typescript-playwright.yml
└── projects/
    ├── Python-Playwright-Automation/
    │   ├── README.md
    │   ├── docs/
    │   │   ├── Python_QA_Automation_Handbook.md   ← single-file quick reference
    │   │   └── interview-prep/                    ← 11 chapters, 27 entries
    │   ├── framework/          ← the real, runnable POM suite
    │   └── examples/           ← standalone demos (BDD, API, load)
    └── TypeScript-Playwright-Automation/
        ├── README.md
        ├── docs/
        │   ├── TypeScript_QA_Automation_Handbook.md
        │   └── interview-prep/                    ← 12 chapters, 29 entries
        ├── framework/          ← POM suite with base.extend() fixtures
        └── examples/           ← standalone demos (BDD, API, load)
```

---

## Quickstart

```bash
git clone https://github.com/suryakulshreshtha/ForkableInterviewToolkit.git
cd ForkableInterviewToolkit
```

**Python edition:**

```bash
cd projects/Python-Playwright-Automation
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
playwright install --with-deps
pytest framework/tests -v
```

**TypeScript edition:**

```bash
cd projects/TypeScript-Playwright-Automation
npm ci
npx playwright install --with-deps
npm test
```

Full details (tags, reporting, tracing, CI) live in each project's README:
[Python](projects/Python-Playwright-Automation/README.md) · [TypeScript](projects/TypeScript-Playwright-Automation/README.md)

---

## The two halves, and why they're together

**📖 `docs/interview-prep/`** — study notes in a fixed seven-part format so every topic reads the same way:

> Direct Answer → Real-Time Example → Code → STAR Answer → Interview-Ready Answer → Interview Tip → One-Line Revision

Short on time? Each project ships a single-file condensed handbook:
[Python](projects/Python-Playwright-Automation/docs/Python_QA_Automation_Handbook.md) · [TypeScript](projects/TypeScript-Playwright-Automation/docs/TypeScript_QA_Automation_Handbook.md)

**🧪 `framework/` + `examples/`** — the same ideas, actually executing. When the notes say *"I use fixtures to centralise setup"*, [`conftest.py`](projects/Python-Playwright-Automation/conftest.py) and [`fixtures.ts`](projects/TypeScript-Playwright-Automation/framework/fixtures/fixtures.ts) are right there doing it. Notes and code cross-link both ways, so neither can quietly drift out of date.

---

## Two languages, one engine

Both projects automate the **same practice site** with the **same architecture** — Page Object Model, isolated selectors, fixtures for setup, path-filtered CI. That's deliberate: it turns the pair into a side-by-side reference for what genuinely differs between Playwright's two most popular bindings.

| Concern | Python | TypeScript |
|---|---|---|
| Runner | pytest | `@playwright/test` |
| Custom fixtures | `@pytest.fixture` in `conftest.py` | `base.extend<T>()` |
| Data-driven | `@pytest.mark.parametrize` | `for…of` loop around `test()` |
| Assertions | `expect(x).to_be_visible()` | `await expect(x).toBeVisible()` |
| Async | sync API — no `await` | everything async |
| Parallelism | `pytest-xdist` | built-in workers |
| BDD | pytest-bdd | playwright-bdd |
| Load testing | Locust + Flask | Artillery + Express |

Being able to name these differences precisely — rather than treating "Playwright" as one thing — is exactly the kind of detail interviewers use to tell real experience from reading. The full breakdown is in [Python ↔ TypeScript](projects/TypeScript-Playwright-Automation/docs/interview-prep/11-python-vs-typescript.md).

---

## Test target & responsible-use policy

Everything UI-related runs against **[rahulshettyacademy.com/AutomationPractice](https://rahulshettyacademy.com/AutomationPractice/)** — a page published publicly by Rahul Shetty Academy specifically so people can practise automation against it. Thank you to them for keeping it up. 🙏

House rules, and they're not optional:

- ✅ Functional tests only, at human-ish pace. CI runs the suite once per push.
- ❌ **No load or stress testing against the practice site, ever.** The Locust example ships with a local Flask target and refuses to point anywhere else by default.
- ❌ No scraping, mirroring, or republishing the site's content or course data.
- ❌ No credentials, real or fake, committed to this repo. The site needs none.
- 🔁 It's a third-party site that can change without notice. If a selector breaks, that's on us to fix — [open an issue](../../issues).

If you fork this, keep the same policy. It's the difference between a practice site staying up and it getting locked down for everyone.

---

## Contributing

PRs genuinely welcome — this is meant to be forked, that's the whole point of the name. See [CONTRIBUTING.md](CONTRIBUTING.md), and [docs/ADDING-A-NEW-PROJECT.md](docs/ADDING-A-NEW-PROJECT.md) if you want to add a whole new stack.

## License

[MIT](LICENSE) — © Surya Kulshreshtha. Fork it, ship it, put it in your portfolio. Attribution appreciated, not demanded ^_^
