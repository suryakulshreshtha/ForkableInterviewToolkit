# 3. Playwright (Python) — Core Concepts

Fixtures, auto-waiting, dialogs, locators. Every code sample is Python — see [`../../framework/`](../../framework/) for the running versions.

---

### 3.1 What Are Fixtures in Playwright, and How Do You Use Custom Fixtures? (Python)

**Source:** Commonly asked — Playwright technical round. Rewritten for Python: JS base.extend() → native @pytest.fixture.

#### 1. Direct Answer

In Python, Playwright doesn't have its own separate fixture-extension API like the JS base.extend(); the pytest-playwright plugin gives you built-in pytest fixtures (page, context, browser), and you add your own custom fixtures the normal pytest way, using @pytest.fixture. Custom fixtures are still where I put authenticated sessions, Page Objects, API clients, test data, and shared setup.

For a simple application URL, the --base-url pytest-playwright CLI option (or a pytest.ini setting) is often enough; for a reusable dependency with real setup logic, a custom fixture is more appropriate.

#### 2. Real-Time Project Example

Instead of hardcoding the application URL inside every test module, a custom app_url fixture resolves the correct environment URL (from an environment variable, with a QA default) and injects it directly into any test that needs it.

#### 3. Coding / Practical Example

```python
import os
import pytest

@pytest.fixture
def app_url():
    return os.getenv("BASE_URL", "https://qa.myshop.com")

def test_verify_login_page(page, app_url):
    page.goto(app_url)
    # Login validation
```

#### 5. Interview-Ready Answer

> "Fixtures are reusable setup/dependencies for tests. Playwright's Python integration gives us built-in pytest fixtures like page and context, and I add my own with @pytest.fixture — for authenticated sessions, Page Objects, API clients, and shared test data."

#### 6. Important Interview Point

- Don't say “base.extend()” in a Python interview — that's the JS/TS API. In Python, plain pytest fixtures (usually declared in conftest.py) are the idiomatic mechanism.

#### 7. One-Line Revision

⚡ **Fixture (Python) = a function decorated with @pytest.fixture that supplies setup/data/objects to tests — declared once in conftest.py, reused everywhere.**

---
### 3.2 Does Playwright's Auto-Waiting Make It Faster / Better Than Selenium for Synchronization?

**Source:** Commonly asked — Playwright vs Selenium comparison round. Code shown in Python.

#### 1. Direct Answer

One practical difference I have noticed is that Playwright provides auto-waiting and web-first assertions out of the box. Instead of writing separate synchronization logic for many UI actions, I can use locators and assertions directly — this reduces code and avoids unnecessary fixed waits.

Playwright can be faster in many automation setups because of efficient browser communication, lightweight browser contexts, built-in auto-waiting, and strong parallel execution support (Playwright's own workers, or pytest-xdist in Python). It also reduces synchronization code because we don't normally need Selenium-style explicit waits for every action.

However, I would not claim Playwright is universally faster — framework design, infrastructure, application behavior, and test data also affect execution time.

#### 2. Real-Time Project Example

In one project, our UI automation suite had synchronization-related failures and some unnecessary waiting. I needed to make the automation more stable and reduce unnecessary execution time.

#### 3. Coding / Practical Example

```python
from playwright.sync_api import expect

expect(page.locator("#dashboard")).to_be_visible()
# No manual wait needed — Playwright auto-retries this assertion
# until the condition is true or the timeout is reached.
```

#### 4. STAR Method Answer

| | |
|---|---|
| **S — Situation** | In one project, our UI automation suite had synchronization-related failures and some unnecessary waiting. |
| **T — Task** | I needed to make the automation more stable and reduce unnecessary execution time. |
| **A — Action** | While working with Playwright, I used reliable locators, auto-waiting, and web-first assertions, and removed unnecessary hard waits. I also used parallel execution (pytest-xdist) where the tests were independent. |
| **R — Result** | The test suite became cleaner and more reliable, and we were able to reduce unnecessary waiting during execution. (Quote your actual measured execution-time improvement if you have one.) |

#### 5. Interview-Ready Answer

> "Playwright can be faster in many automation setups because it has efficient browser communication, lightweight browser contexts, built-in auto-waiting, and strong parallel execution support. It also reduces synchronization code because we don't normally need Selenium-style explicit waits for every action. However, I would not claim that Playwright is universally faster; framework design, infrastructure, application behavior, and test data also affect execution time."

#### 6. Important Interview Point

- Do not overclaim speed — frame it as “can be faster,” not “always faster.”
- Understand browser contexts (isolated, lightweight sessions) and how they differ from launching new browser instances.
- Understand auto-waiting and how it differs from Selenium's implicit/explicit waits.
- Understand parallel execution via pytest-xdist (Python) or Playwright's own worker model.
- Avoid unnecessary time.sleep() calls in tests — prefer web-first assertions.
- Authentication-state reuse (storage_state) can meaningfully improve suite performance.
- Compare complete frameworks, not just the underlying tool.

#### 7. One-Line Revision

⚡ **Playwright can improve speed through efficient browser control, lightweight contexts, auto-waiting, and parallel workers.**

---
### 3.3 How Do You Handle a JavaScript Alert / Prompt Dialog in Playwright (Python)?

**Source:** Replaces the original Java/Selenium alert-handling question with the Python + Playwright equivalent.

> 🆕 **New Addition:** Not sourced from any screenshot — Playwright's dialog model is fundamentally different from Selenium's switchTo().alert(), so this was written fresh rather than translated line-by-line.

#### 1. Direct Answer

Playwright treats native browser dialogs (alert, confirm, prompt) as events rather than a separate “switchTo” target the way Selenium does. Register a handler on page.on("dialog", ...) before the action that triggers the dialog; inside the handler, call dialog.accept(text) to click OK (optionally supplying text for a prompt) or dialog.dismiss() to click Cancel.

If you don't register a handler, Playwright auto-dismisses dialogs by default — which can silently break a flow that expects a prompt value, so the handler needs to exist before the triggering action runs.

#### 2. Real-Time Project Example

A JavaScript prompt asks for a customer reference number: register the dialog handler first, then trigger the action that opens the prompt, and the handler supplies the text and accepts it.

#### 3. Coding / Practical Example

```python
def handle_prompt(dialog):
    print(dialog.message)
    dialog.accept("TEST-1001")

page.on("dialog", handle_prompt)
page.click("#open-prompt-button")
```

#### 5. Interview-Ready Answer

> "Playwright handles dialogs event-first: I register page.on('dialog', handler) before the triggering action, then call dialog.accept(text) or dialog.dismiss() inside the handler — no switchTo() step needed."

#### 6. Important Interview Point

- Register the dialog handler before the action that opens it — if the dialog fires before a handler exists, Playwright's default auto-dismiss behavior will silently swallow it.

#### 7. One-Line Revision

⚡ **Playwright dialogs: page.on('dialog', handler) → dialog.accept(text) or dialog.dismiss() — event-driven, not switchTo()-based.**

---
### 3.4 What Locator Strategies Does Playwright (Python) Recommend?

**Source:** New — added to broaden Playwright-Python coverage.

> 🆕 **New Addition:** Not sourced from any screenshot — added because locator strategy is one of the most common Playwright-specific interview questions.

#### 1. Direct Answer

Playwright's Python API pushes user-facing locators as the default: get_by_role(), get_by_text(), get_by_label(), get_by_placeholder(), and get_by_test_id() — these mirror how a real user or assistive technology finds elements, so they're more resilient to markup churn than raw CSS/XPath. Plain page.locator() with a CSS or XPath selector is still available as a fallback for elements without a good accessible name.

#### 2. Real-Time Project Example

Preferring get_by_role("button", name="Login") over a brittle CSS selector like div.form > button:nth-child(3), so a later markup refactor doesn't quietly break the locator.

#### 3. Coding / Practical Example

```python
page.get_by_role("button", name="Login").click()
page.get_by_label("Username").fill("test_user")
page.get_by_placeholder("Search products").fill("wireless headphones")
page.get_by_test_id("cart-icon").click()

# CSS/XPath fallback when there's no good accessible name
page.locator("#dashboard").click()
```

#### 5. Interview-Ready Answer

> "I default to Playwright's role/label/text-based locators because they mirror how a real user finds elements and survive markup changes better; CSS/XPath is a fallback for elements without a good accessible name."

#### 6. Important Interview Point

- Interviewers often probe whether you understand why role-based locators are preferred, not just that they exist — lead with resilience to markup change, not just “it's the newer API.”

#### 7. One-Line Revision

⚡ **Prefer get_by_role/label/text (accessibility-first, resilient); fall back to CSS/XPath only when there's no accessible name.**

---
### 3.5 How Does Playwright's Waiting Model Differ From Selenium's Implicit / Explicit Waits?

**Source:** Replaces the original Selenium-specific implicit-vs-explicit-wait question, since Playwright doesn't have that dichotomy at all.

> 🆕 **New Addition:** Not sourced from any screenshot — Playwright has no implicit/explicit wait choice, so this entry explains the actual Playwright model rather than translating the Selenium answer.

#### 1. Direct Answer

Selenium's model asks you to choose between a global implicit wait and a targeted explicit wait (WebDriverWait). Playwright removes that choice: every action (click, fill, check, etc.) automatically performs actionability checks first — the element must be attached, visible, stable, and able to receive events — retrying those checks until the configured timeout elapses.

Assertions (expect(...).to_be_visible(), etc.) work the same way, auto-retrying until the condition holds or the timeout is hit. You only reach for a manual wait (wait_for_selector, wait_for_load_state) for edge cases Playwright's auto-waiting doesn't cover, like a custom JS event or a network-idle state.

#### 2. Real-Time Project Example

The same dashboard-after-login scenario: instead of choosing between a fixed sleep or a Selenium-style WebDriverWait, a Playwright click() or expect(...).to_be_visible() call already retries until the Dashboard is genuinely interactable, with no extra wait code needed.

#### 3. Coding / Practical Example

```python
# No implicit/explicit wait choice needed — actionability checks are automatic
page.get_by_role("button", name="Login").click()
expect(page.locator("#dashboard")).to_be_visible()

# Manual wait reserved for edge cases Playwright doesn't auto-handle
page.wait_for_load_state("networkidle")
```

#### 4. STAR Method Answer

| | |
|---|---|
| **S — Situation** | The team, coming from a Selenium background, kept adding explicit WebDriverWait-style code out of habit even though we'd switched to Playwright. |
| **T — Task** | I needed to show that most of that manual waiting code was now redundant, and get the team comfortable trusting Playwright's built-in actionability checks. |
| **A — Action** | I removed the redundant manual waits, replaced brittle sleeps with expect() assertions, and reserved wait_for_load_state/wait_for_selector only for the few network-idle edge cases that genuinely needed it. |
| **R — Result** | The suite got noticeably shorter and easier to read, with no loss of stability — in most cases, stability actually improved. |

#### 5. Interview-Ready Answer

> "Selenium makes you choose between a global implicit wait and a targeted explicit wait. Playwright removes that choice — every action and assertion auto-retries against actionability checks until its timeout, so I only add a manual wait for the rare case Playwright's built-in checks don't cover, like network-idle."

#### 6. Important Interview Point

- Don't port Selenium wait habits into a Playwright framework — leftover WebDriverWait-style code is a code smell that signals the team hasn't fully adopted Playwright's model yet.

#### 7. One-Line Revision

⚡ **Playwright = no implicit/explicit choice; auto-waiting actionability checks replace both — manual waits are the rare exception.**

---

[← Back to interview-prep index](README.md)
