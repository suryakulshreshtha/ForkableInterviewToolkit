# ForkableInterviewToolkit

> Forkable interview prep + runnable proof, one project per stack. For SDETs who'd rather read code than flashcards ^_^

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Python + Playwright](https://github.com/suryakulshreshtha/ForkableInterviewToolkit/actions/workflows/python-playwright.yml/badge.svg)](../../actions/workflows/python-playwright.yml)

Most interview-prep repos are a wall of questions with no code. Most framework demos are a wall of code with no explanation. This one is deliberately **both**, kept side by side so every claim in the notes has a runnable file backing it up.

---

## What's inside

| Project | Stack | Status |
|---|---|---|
| [`Python-Playwright-Automation`](projects/Python-Playwright-Automation/) | Python · Playwright · Pytest · pytest-bdd · Locust · GitHub Actions | ✅ Active |
| _`TypeScript-Playwright-Automation`_ | TypeScript · Playwright Test | 🕓 Planned |
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
│   └── python-playwright.yml    ← one workflow per project, path-filtered
└── projects/
    └── Python-Playwright-Automation/
        ├── README.md
        ├── docs/
        │   ├── Python_QA_Automation_Handbook.md  ← single-file quick reference
        │   └── interview-prep/                   ← 11 chapters, 27 entries, 7-part format
        ├── framework/            ← the real, runnable POM suite
        └── examples/             ← small standalone demos (BDD, API, load)
```

---

## Quickstart

```bash
git clone https://github.com/suryakulshreshtha/ForkableInterviewToolkit.git
cd ForkableInterviewToolkit/projects/Python-Playwright-Automation

python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
playwright install --with-deps

pytest framework/tests -v
```

Full details (markers, reporting, tracing, CI) live in the [project README](projects/Python-Playwright-Automation/README.md).

---

## The two halves, and why they're together

**📖 `docs/interview-prep/`** — study notes in a fixed seven-part format so every topic reads the same way:

> Direct Answer → Real-Time Example → Code → STAR Answer → Interview-Ready Answer → Interview Tip → One-Line Revision

Short on time? [`docs/Python_QA_Automation_Handbook.md`](projects/Python-Playwright-Automation/docs/Python_QA_Automation_Handbook.md) is the single-file, skim-before-you-walk-in version of the same material.

**🧪 `framework/` + `examples/`** — the same ideas, actually executing. When the notes say *"I use fixtures to centralise setup"*, [`conftest.py`](projects/Python-Playwright-Automation/conftest.py) is right there doing it. Notes and code cross-link both ways, so neither can quietly drift out of date.

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
