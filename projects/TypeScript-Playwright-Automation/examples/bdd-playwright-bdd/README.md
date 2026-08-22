# BDD Example (playwright-bdd)

Gherkin `.feature` files bound to TypeScript steps, executed by **Playwright's own runner**.

```bash
npm run test:bdd
```

That runs `bddgen` (which generates real Playwright spec files from the features into `.features-gen/`) and then `playwright test` against them.

## Files

| File | Role |
|---|---|
| `features/practice.feature` | Business-readable scenarios (Given / When / Then) |
| `steps/practice.steps.ts` | Step definitions — plain functions |

## Why playwright-bdd over cucumber-js

Because it generates **actual Playwright tests**, you keep everything the runner gives you for free:

- Custom fixtures (`practicePage` works in steps exactly as in a spec)
- Parallel execution across workers
- Trace viewer, HTML reporter, retries
- `--grep`, `--project`, `--headed`, and the rest of the CLI

`@cucumber/cucumber` needs its own World, hooks, and parallel setup, and none of the Playwright tooling carries over. That's a genuinely defensible answer if an interviewer asks why you picked one.

## When BDD is worth it

When business stakeholders actually read and review the scenarios. If nobody outside the QA team ever opens a `.feature` file, the extra step-definition maintenance is pure cost — a more honest answer than "BDD is best practice."
