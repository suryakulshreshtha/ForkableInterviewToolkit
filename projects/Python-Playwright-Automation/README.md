# Python-Playwright-Automation

> Interview notes with runnable proof attached. Python · Playwright · Pytest · pytest-bdd · Locust ^_^

Part of [**ForkableInterviewToolkit**](../../README.md). Fully self-contained — you can run everything here without touching the rest of the repo.

---

## Quickstart

```bash
cd projects/Python-Playwright-Automation

python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate

pip install -r requirements.txt
playwright install --with-deps

# sanity-check the practice site's markup hasn't shifted under us (~20s)
python scripts/verify_selectors.py

pytest framework/tests -v
```

---

## Layout

```
Python-Playwright-Automation/
├── conftest.py                 # every reusable fixture lives here
├── pytest.ini                  # markers, testpaths, base_url
├── requirements.txt
├── scripts/
│   └── verify_selectors.py     # one-command locator health check
├── docs/
│   ├── Python_QA_Automation_Handbook.md   # single-file quick-reference / skim version
│   └── interview-prep/         # 11 chapters, 27 entries, full seven-part format
├── framework/
│   ├── pages/                  # Page Objects — actions only, never assertions
│   ├── utilities/              # config helpers
│   ├── test_data/              # synthetic JSON data
│   └── tests/                  # the suite
└── examples/
    ├── api_testing/            # requests + pytest vs a public mock API
    ├── bdd_pytest_bdd/         # Gherkin bound to Python steps
    └── locust_perf/            # load testing — local target only
```

---

## Running things

```bash
pytest framework/tests -v                       # everything
pytest framework/tests -m smoke                 # critical path only
pytest framework/tests -m "ui or table"         # by marker
pytest framework/tests --headed --slowmo 500    # watch it drive
pytest framework/tests --browser firefox        # chromium | firefox | webkit
pytest framework/tests -n auto                  # parallel (pytest-xdist)

pytest framework/tests --tracing=retain-on-failure   # trace failures
playwright show-trace test-results/**/trace.zip      # then replay one

pytest framework/tests --html=reports/report.html --self-contained-html
```

Markers: `smoke`, `ui`, `table`, `dialogs`.

---

## Design decisions worth defending in an interview

| Decision | Reasoning |
|---|---|
| **Selectors live only in Page Objects** | Site markup changes = one-file fix, tests untouched |
| **Page Objects never assert** | They expose actions and state; the test owns correctness |
| **Tables located by header text** | `filter(has_text="Instructor")` survives a restyle; `.table-display` doesn't |
| **Zero `time.sleep()`** | Playwright auto-waits; sleeps are slower *and* flakier |
| **All setup in `conftest.py`** | No duplicated setup across test modules |
| **`@pytest.mark.parametrize` for data** | One test body, many cases — data-driven without a second framework |
| **Config via env vars** | Same code runs local and in CI; no hardcoded environments |

Each maps to a chapter in [`docs/interview-prep/`](docs/interview-prep/) — the notes and the code are meant to be read together.

---

## Test target & responsible use

UI tests run against **[rahulshettyacademy.com/AutomationPractice](https://rahulshettyacademy.com/AutomationPractice/)**, published publicly by Rahul Shetty Academy for automation practice. Thanks to them for hosting it. 🙏

- ✅ Functional tests, one CI pass per push
- ❌ **No load testing against it** — Locust ships with its own local Flask target and a runtime guard that refuses remote hosts
- ❌ No scraping or republishing its content
- ❌ No credentials committed anywhere (the site needs none)

It's third-party and can change without notice. `scripts/verify_selectors.py` tells you in ~20 seconds whether a failure is your code or their markup.

> **Status:** all locators verified passing against the live site. If a test starts failing later, run `verify_selectors.py` first — selectors live in one file (`framework/pages/automation_practice_page.py`) by design, so it's a one-file fix.

---

## Where the docs live

- [`docs/Python_QA_Automation_Handbook.md`](docs/Python_QA_Automation_Handbook.md) — one-file condensed reference, skim before an interview
- [`docs/interview-prep/`](docs/interview-prep/) — the full guide, every entry in the same seven-part format:

  > Direct Answer → Real-Time Example → Code → STAR Answer → Interview-Ready Answer → Interview Tip → One-Line Revision
