# BDD Example (pytest-bdd)

Gherkin `.feature` files bound to plain Python functions, executed by ordinary pytest.

```bash
pytest examples/bdd_pytest_bdd -v
```

## Files

| File | Role |
|---|---|
| `login.feature` | Business-readable scenarios (Given / When / Then) |
| `test_practice_steps.py` | Step definitions — plain functions with decorators |

## The key insight

Step functions accept the **same fixtures as any pytest test**. `practice_page` here comes straight from the project's `conftest.py`. You're not adopting a second framework — just a Gherkin-to-function binding layer.

## When BDD is worth it

When business stakeholders actually read and review the scenarios. If nobody outside the QA team ever opens a `.feature` file, the extra step-definition maintenance is pure cost — that's a real answer to give in an interview, and a more honest one than "BDD is best practice."
