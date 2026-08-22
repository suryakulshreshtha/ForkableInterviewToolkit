# 10. Quick-Reference Glossary

One line per topic — the last thing to skim before you walk in.

---

| Term | One-Line Summary |
| --- | --- |
| Playwright Test | The runner: fixtures, parallel workers, projects, reporters, trace viewer. |
| Fixture | Lazy, auto-torn-down dependency via `base.extend()`; code after `use()` is teardown. |
| Actionability checks | Attached, visible, stable, receives events, enabled — run before every action. |
| Web-first assertion | `expect(locator)` retries until the condition holds or timeout — no manual waits. |
| Locator | Lazy element query; re-resolves on each use. Prefer getByRole/Label/Text. |
| Strict mode | A locator matching multiple elements throws instead of silently picking the first. |
| Project | A named config variant — browser, device, or a setup dependency chain. |
| Worker | A separate Node process running tests in parallel with its own browser. |
| storageState | Saved cookies/localStorage for auth reuse — usually the biggest suite speed win. |
| Trace viewer | Step-by-step replay with DOM snapshots, network, and console. Best debug tool. |
| UI mode | `--ui`: watch-mode runner with time travel; fastest way to author tests. |
| playwright-bdd | Generates specs from .feature files, run on Playwright's own runner. |
| Artillery | Node-native load testing; phases = ramp-up, scenario weight = action mix. |
| npm ci | Lockfile-exact install for CI; fails if package.json and lockfile disagree. |
| tsconfig strict | Where TypeScript's safety actually comes from — without it you get syntax only. |


---

[← Back to interview-prep index](README.md)
