# 6. API Testing (Python)

requests, Playwright's request context, and how to think about the testing pyramid. Runnable version: [`../../examples/api_testing/`](../../examples/api_testing/).

---

### 6.1 How Do You Approach API Testing in Python?

**Source:** New — added to broaden coverage into API testing.

> 🆕 **New Addition:** Not sourced from any screenshot — added because API testing is a near-certain topic for a Python + Playwright QA/SDET interview.

#### 1. Direct Answer

For pure API testing, the requests library (or httpx) covers most REST-testing needs — status codes, JSON body assertions, headers, auth tokens. When API and UI tests should share the same Playwright browser/network context (e.g., authenticating via API, then continuing in the UI), Playwright's own APIRequestContext (playwright.request) is often a better fit because it shares cookies/storage state with the page.

#### 2. Real-Time Project Example

Verifying a user-creation endpoint returns 201 with the correct payload shape, as a fast, UI-independent check that complements the slower end-to-end UI test for the same flow.

#### 3. Coding / Practical Example

```python
import requests

def test_get_user_api():
    response = requests.get("https://api.qa.myshop.com/users/1")
    assert response.status_code == 200
    body = response.json()
    assert body["id"] == 1
    assert "email" in body

# --- Playwright's own request context, sharing auth state with the page ---
def test_api_with_playwright(page, playwright):
    api = playwright.request.new_context(base_url="https://api.qa.myshop.com")
    response = api.get("/users/1")
    assert response.ok
    assert response.json()["id"] == 1
```

#### 4. STAR Method Answer

| | |
|---|---|
| **S — Situation** | Our end-to-end UI suite was the only place verifying certain backend behaviors, making the suite slow and failures hard to localize — was it a UI bug or an API bug? |
| **T — Task** | I needed faster, more precise coverage of the API contract itself, independent of the UI. |
| **A — Action** | I added a parallel layer of API tests using requests/Playwright's request context for the same critical endpoints already covered at the UI layer, asserting status codes and payload shape directly. |
| **R — Result** | We caught several backend regressions in seconds via the API layer, well before the slower UI suite would have flagged them, and failures became much easier to localize. |

#### 5. Interview-Ready Answer

> "I use requests/httpx for standalone API checks, and Playwright's own request context specifically when I need to share auth/cookies with a page in the same test."

#### 6. Important Interview Point

- Use requests/httpx for pure API testing; reach for Playwright's own request context specifically when you need to share auth/cookies with a page in the same test.

#### 7. One-Line Revision

⚡ **API testing (Python) = requests/httpx for standalone checks; playwright.request when you need shared auth/session state with the UI.**

---
### 6.2 How Do You Decide the Right Mix of API vs UI Tests (Testing Pyramid)?

**Source:** New — added to broaden coverage into test strategy.

> 🆕 **New Addition:** Not sourced from any screenshot — added as a common strategy question that follows naturally from the API-testing entry above.

#### 1. Direct Answer

Favor the classic testing pyramid: many fast, isolated unit/API tests at the base, fewer UI/E2E tests at the top covering only the critical user journeys that must be verified exactly as a user experiences them. Push validation, business-rule, and data-shape checks down to the API layer wherever possible; reserve UI tests for flows where the interaction itself matters (drag-and-drop, multi-step wizards, visual regressions).

#### 2. Real-Time Project Example

A checkout flow: verify pricing/discount calculation logic via API tests (fast, precise), but keep one true end-to-end UI test that walks through adding to cart, applying a coupon, and completing checkout, to catch integration issues the API-only tests can't see.

#### 5. Interview-Ready Answer

> "I push logic and validation checks down to the API layer wherever possible, and reserve UI tests for the handful of journeys where the interaction itself is what's under test — that keeps the pyramid healthy instead of top-heavy."

#### 6. Important Interview Point

- When a UI test starts asserting deep business logic (e.g. tax calculation math), that's usually a sign the check belongs at the API layer instead — not a reason to add more UI tests.

#### 7. One-Line Revision

⚡ **Push logic/validation checks down to API tests; keep UI tests for the handful of journeys where the interaction itself is what's under test.**

---

[← Back to interview-prep index](README.md)
