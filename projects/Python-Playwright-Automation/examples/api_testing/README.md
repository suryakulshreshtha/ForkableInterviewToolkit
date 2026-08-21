# API Testing Example

Plain `requests` + pytest against [reqres.in](https://reqres.in) — a free public mock REST API built for exactly this.

```bash
pytest examples/api_testing -v
```

## What it shows

- Session fixture with shared headers (module-scoped — one session, many tests)
- Status-code and payload-shape assertions
- `@pytest.mark.parametrize` for pagination
- POST with a JSON body

## Why a mock API?

No auth, no real user data, no risk of hammering someone's production service. If you swap in a real API, put the token in a GitHub Actions **encrypted secret** — never in this file.

## When to use Playwright's request context instead

`requests` is right for standalone API checks. Use `playwright.request` when the API call must share cookies/auth state with a browser `page` in the same test — for example, logging in via API and continuing in the UI.
