# 4. Test Automation Framework Design

The deepest-dive question in most automation interviews. The framework described here is the one actually implemented in [`../../framework/`](../../framework/).

---

### 4.1 Explain Your Python + Playwright Automation Framework in Detail

**Source:** Commonly asked — the single most likely deep-dive question in any automation interview. Unified into one Python + Playwright framework.

#### 1. Direct Answer

A good framework explanation covers both folder structure and execution flow. A typical Python + Playwright framework contains:

- tests/ — test modules (business scenarios and assertions), organized by feature.
- pages/ — Page Object classes and reusable UI methods (Page Object Model).
- conftest.py / fixtures/ — reusable pytest fixtures: browser/page setup, authenticated sessions, test data.
- utilities/ — common helpers: custom waits, screenshot capture, file/data handling.
- test_data/ — external or generated input data (JSON/CSV/YAML for parametrize).
- pytest.ini / pyproject.toml — environment URLs, browser/project settings, timeouts, retries.
- reports/ — HTML/Allure reports, screenshots, videos, and Playwright trace files.
- requirements.txt / pyproject.toml — dependency and version management.
- .github/workflows/ (or a Jenkinsfile) — CI/CD pipeline definition.

The most important design principle is still separation of concerns: test modules describe business behavior, Page Objects encapsulate UI interaction, and conftest.py centralizes setup so it isn't duplicated across test files.

#### 2. Real-Time Project Example

Project/domain: e-commerce application. Suppose the project has 500 regression tests — if the Login locator changes, I should update only LoginPage rather than every test file. GitHub Actions (or Jenkins) executes the suite on each PR, an Allure/pytest-html report gets published, and Playwright's trace viewer helps root-cause any failure.

#### 3. Coding / Practical Example

```python
playwright-python-framework/
├── tests/
│   ├── test_login.py
│   ├── test_checkout.py
│   └── test_cart.py
├── pages/
│   ├── base_page.py
│   ├── login_page.py
│   ├── product_page.py
│   ├── cart_page.py
│   └── checkout_page.py
├── conftest.py
├── utilities/
│   ├── waits.py
│   └── screenshot.py
├── test_data/
│   └── users.json
├── pytest.ini
├── requirements.txt
├── .github/
│   └── workflows/
│       └── playwright.yml
└── reports/
```

#### 4. STAR Method Answer

| | |
|---|---|
| **S — Situation** | The automation suite was growing and UI changes were causing maintenance overhead. |
| **T — Task** | We needed a structure that allowed reuse and made failures easy to diagnose. |
| **A — Action** | I separated test modules from Page Objects, centralized fixtures in conftest.py, added a utilities layer, and wired the suite into GitHub Actions with Allure reporting. |
| **R — Result** | The framework became easier to maintain, and root-causing a failure via the Playwright trace viewer took minutes instead of guesswork. |

#### 5. Interview-Ready Answer

> "My framework separates test modules from Page Objects and centralizes setup in conftest.py fixtures. Utilities handle common operations; test data lives in test_data/; pytest.ini/pyproject.toml controls configuration; and CI (GitHub Actions or Jenkins) runs the suite and publishes an Allure or HTML report. This keeps maintenance centralized and failures fast to diagnose via Playwright's trace viewer."

#### 6. Important Interview Point

- Replace generic names with your actual repo's folder names when you explain it live — and be ready to trace one full test end-to-end: which fixture builds the page, which Page Object method runs, and where the report/trace ends up.
- Practice target: the runnable framework in this repo points at rahulshettyacademy.com/AutomationPractice, a public page published specifically for automation practice. Always demo against a purpose-built practice site — never a real company's production app.

#### 7. One-Line Revision

⚡ **Framework = tests/ + pages/ (POM) + conftest.py fixtures + utilities/ + test_data/ + pytest.ini + CI/CD + Allure/trace reporting.**

---
### 4.2 How Do You Structure a Page Object Model (POM) in Python?

**Source:** New — added to broaden framework-design coverage.

> 🆕 **New Addition:** Not sourced from any screenshot — added because a concrete POM code example is one of the most commonly requested follow-ups to a framework-structure question.

#### 1. Direct Answer

A BasePage class holds shared behavior (navigation helpers, common waits, a reference to the Playwright page object); each concrete page (LoginPage, CheckoutPage) subclasses it and exposes locators plus higher-level actions (login(), add_to_cart()) that combine several low-level Playwright calls into one meaningful step. Test modules call only these high-level methods — never raw locators directly — so a UI change means editing one Page Object, not every test.

#### 2. Real-Time Project Example

A LoginPage.login(username, password) method wraps three Playwright calls (fill username, fill password, click submit) so every test that needs to log in calls one method instead of three raw locator interactions.

#### 3. Coding / Practical Example

```python
class BasePage:
    def __init__(self, page):
        self.page = page

    def goto(self, path: str):
        self.page.goto(path)

class LoginPage(BasePage):
    def __init__(self, page):
        super().__init__(page)
        self.username_input = page.get_by_label("Username")
        self.password_input = page.get_by_label("Password")
        self.login_button = page.get_by_role("button", name="Login")

    def login(self, username: str, password: str):
        self.username_input.fill(username)
        self.password_input.fill(password)
        self.login_button.click()

# --- In a test ---
def test_successful_login(page):
    login_page = LoginPage(page)
    login_page.goto("/login")
    login_page.login("valid_user", "valid_pass")
```

#### 5. Interview-Ready Answer

> "My Page Objects extend a BasePage with a shared page reference and navigation helper. Each page exposes locators in its constructor and high-level action methods, like login(), so tests read like business steps rather than raw UI interactions."

#### 6. Important Interview Point

- Keep assertions out of Page Object methods — Page Objects should perform actions and expose state; the test module decides what to assert.

#### 7. One-Line Revision

⚡ **POM (Python) = BasePage + one subclass per page, exposing high-level actions; tests call methods, never raw locators.**

---
### 4.3 How Do You Implement Data-Driven Testing in Pytest?

**Source:** New — added to broaden framework-design coverage.

> 🆕 **New Addition:** Not sourced from any screenshot — added since data-driven testing is a near-certain follow-up to any Pytest framework discussion.

#### 1. Direct Answer

@pytest.mark.parametrize runs the same test body against multiple input combinations, which is the core mechanism for data-driven testing in pytest — pair it with data pulled from a fixture, JSON/CSV file, or a database for larger data sets, rather than hardcoding every case inline.

#### 2. Real-Time Project Example

Running the same login test against a valid-credentials case and an invalid-credentials case without duplicating the test body.

#### 3. Coding / Practical Example

```python
import pytest

@pytest.mark.parametrize("username,password,expected_url_fragment", [
    ("valid_user", "valid_pass", "/dashboard"),
    ("invalid_user", "wrong_pass", "/login?error=1"),
])
def test_login(page, username, password, expected_url_fragment):
    page.goto("/login")
    page.get_by_label("Username").fill(username)
    page.get_by_label("Password").fill(password)
    page.get_by_role("button", name="Login").click()
    assert expected_url_fragment in page.url
```

#### 5. Interview-Ready Answer

> "I use @pytest.mark.parametrize to run one test body against many data combinations — for larger data sets, the parametrize list is loaded from an external JSON/CSV file instead of being hardcoded."

#### 6. Important Interview Point

- For large data sets, load parametrize's argument list from an external JSON/CSV file rather than hardcoding it, so non-engineers can update test data without touching test code.

#### 7. One-Line Revision

⚡ **@pytest.mark.parametrize = one test body, many data combinations — the core of data-driven testing in pytest.**

---

[← Back to interview-prep index](README.md)
