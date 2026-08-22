# Contributing

Fork-friendly by design — that's literally the name. Here's how to keep things tidy.

## Ground rules

1. **Never commit secrets.** No tokens, no passwords, no `.env`. Git history is forever, even after a delete commit. Use GitHub Actions encrypted secrets instead.
2. **Never commit real personal data.** Test data is synthetic (`Faker`) or fictional. No real names, emails, or phone numbers — not even your own.
3. **Respect the practice site.** See the responsible-use policy in the [root README](README.md#test-target--responsible-use-policy). No load testing third-party sites, no scraping.
4. **No employer-identifying content.** Interview notes here are generic technical knowledge. Don't add anything tied to a named company's interview loop, internal tooling, or proprietary material — that's a legal and professional risk for you, not just for this repo.

## Adding an interview-prep entry

Entries follow a fixed seven-part format so the docs read consistently. Copy the skeleton from any existing chapter:

```markdown
### N.N Question title as an interviewer would ask it

**Source:** Commonly asked — <which round / why it comes up>

#### 1. Direct Answer
#### 2. Real-Time Project Example
#### 3. Coding / Practical Example
#### 4. STAR Method Answer     <!-- optional; behavioural-flavoured questions only -->
#### 5. Interview-Ready Answer  <!-- the ~30s spoken version, in quotes -->
#### 6. Important Interview Point
#### 7. One-Line Revision
```

If the entry has runnable code, put the real version under `framework/` or `examples/` and link to it — don't let a snippet in the docs be the only copy.

## Adding code

These apply to **every** project, whatever the language:

- Page Objects expose **actions** and state, never assertions. Tests assert.
- All selectors for a page live in that page's Page Object — one file, so a markup change is a one-file fix.
- Prefer accessibility-first locators (`get_by_role` / `getByRole`, `get_by_label` / `getByLabel`) over CSS or XPath.
- **No hard sleeps** (`time.sleep()`, `waitForTimeout()`). Use Playwright's auto-waiting or a web-first `expect()`.
- Test data is synthetic and lives in `test-data/` — never inline credentials.

Stack-specific conventions:

| | Python | TypeScript |
|---|---|---|
| Format / lint | `black`, `ruff` | `prettier`, `tsc --noEmit` |
| Test file location | `framework/tests/test_*.py` | `framework/tests/*.spec.ts` |
| Selection | markers — register new ones in `pytest.ini` | tags in the title, e.g. `@smoke` |

## Adding a whole new stack

See [docs/ADDING-A-NEW-PROJECT.md](docs/ADDING-A-NEW-PROJECT.md).

## PR checklist

- [ ] Test suite passes locally for the project you touched:
      `pytest framework/tests -v` (Python) · `npm test` (TypeScript)
- [ ] `npm run typecheck` passes, if you touched TypeScript
- [ ] `verify_selectors` / `verify:selectors` passes, if you touched Page Objects
- [ ] No secrets, no real personal data, no employer-identifying content
- [ ] Docs and code still agree with each other (including any counts quoted in a README)
- [ ] CI is green
