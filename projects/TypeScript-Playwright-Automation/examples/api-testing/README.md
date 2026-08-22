# API Testing Example

Playwright's built-in `request` fixture against [reqres.in](https://reqres.in) — a free public mock REST API built for exactly this.

```bash
npm run test:api
```

## What it shows

- `APIRequestContext` via the `request` fixture — no axios/fetch wrapper needed
- Status-code and payload-shape assertions
- A `for...of` loop around `test()` for pagination (TypeScript's answer to `parametrize`)
- POST with a JSON body via `{ data: ... }`

## Why a mock API?

No auth, no real user data, no risk of hammering someone's production service. If you swap in a real API, put the token in a GitHub Actions **encrypted secret** — never in this file.

## The TypeScript advantage here

In Python you typically reach for `requests` for standalone API checks and switch to `playwright.request` only when you need shared auth state. In TypeScript, `request` is already right there in the same test signature — one less dependency and one less decision.
