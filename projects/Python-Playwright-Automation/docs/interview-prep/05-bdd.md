# 5. BDD With Python (pytest-bdd / behave)

Gherkin bound to Python steps. Runnable version: [`../../examples/bdd_pytest_bdd/`](../../examples/bdd_pytest_bdd/).

---

### 5.1 Why Do You Prefer Using BDD (Cucumber-Style) in Your Project?

**Source:** Commonly asked — BDD/process round. Reframed from Java/Cucumber to Python's pytest-bdd/behave; the Gherkin philosophy is unchanged.

#### 1. Direct Answer

I use BDD when the project benefits from a common, business-readable specification shared by QA, developers, and business stakeholders.

Gherkin scenarios express behavior using Given, When, and Then. Step definitions connect those statements to automation code.

The benefit is not simply that the syntax is English-like — the real value is shared understanding, acceptance-criteria visibility, and traceability between business behavior and automated tests.

However, I would not introduce BDD just because it is popular. If the team does not need business-readable scenarios, the additional feature files and step-definition maintenance may not provide enough value.

#### 2. Real-Time Project Example

For a banking transfer feature, the business rule can be represented as a scenario describing the customer, the transfer action, and the expected result. Business stakeholders can review the behavior before or alongside the automation implementation.

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

> "I prefer BDD when it improves collaboration and makes acceptance criteria executable and readable. I evaluate the project's needs before choosing it, rather than using BDD purely for tool preference."

#### 6. Important Interview Point

- Be ready to explain feature files, scenarios, step definitions, hooks, and tags, and how execution maps from Gherkin down to Python step functions in pytest-bdd or behave — not Java step definitions.

#### 7. One-Line Revision

⚡ **BDD = shared behavior specification + collaboration + executable acceptance criteria.**

---
### 5.2 Show a Feature File Wired to Python Step Definitions (pytest-bdd)

**Source:** New — added to demonstrate the Python BDD tooling referenced above.

> 🆕 **New Addition:** Not sourced from any screenshot — added so the BDD entry above has a concrete Python implementation to point to.

#### 1. Direct Answer

pytest-bdd binds Gherkin .feature files to plain Python functions decorated with @given / @when / @then, run through pytest like any other test — no separate Cucumber-JVM runner required.

#### 2. Real-Time Project Example

Reusing the Login feature file above, wired to Playwright-driven Python step functions.

#### 3. Coding / Practical Example

```python
# test_login_steps.py
from pytest_bdd import scenarios, given, when, then
from playwright.sync_api import expect

scenarios("login.feature")

@given("the user is on the login page")
def go_to_login(page):
    page.goto("/login")

@when("the user enters valid credentials")
def enter_credentials(page):
    page.get_by_label("Username").fill("valid_user")
    page.get_by_label("Password").fill("valid_pass")

@when("clicks Login")
def click_login(page):
    page.get_by_role("button", name="Login").click()

@then("the dashboard should be displayed")
def dashboard_displayed(page):
    expect(page.locator("#dashboard")).to_be_visible()
```

#### 5. Interview-Ready Answer

> "pytest-bdd step functions accept the same fixtures as any pytest test, like page — you're not learning a second framework, just a Gherkin-to-function binding layer on top of pytest."

#### 6. Important Interview Point

- pytest-bdd step functions accept the same fixtures as any pytest test (like page) — you're not learning a second framework, just a Gherkin-to-function binding layer on top of pytest.

#### 7. One-Line Revision

⚡ **pytest-bdd = Gherkin .feature file + @given/@when/@then Python functions, executed by plain pytest.**

---

[← Back to interview-prep index](README.md)
