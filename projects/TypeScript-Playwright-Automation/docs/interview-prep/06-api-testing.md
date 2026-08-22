# 6. API Testing

Playwright's `request` fixture and how to think about the testing pyramid. Runnable version: [`../../examples/api-testing/`](../../examples/api-testing/).

---

### 6.1 How Do You Test APIs in Playwright?

**Source:** Commonly asked — near-certain for a modern QA/SDET role.

#### 1. Direct Answer

Playwright ships `APIRequestContext`, exposed as the `request` fixture. It handles JSON bodies, headers, auth, and status assertions with no extra HTTP library.

The distinguishing feature over axios or fetch is **shared state**: `request` can share cookies and storage with a browser `context`, so you can authenticate via API and continue in the UI within one test — or set up data via API and verify it in the UI.

`request.newContext()` gives an isolated context with its own baseURL and headers, useful when API tests target a different host than the UI.

#### 2. Real-Time Project Example

Verifying a user-creation endpoint returns 201 with the right payload shape — a fast, UI-independent check complementing the slower end-to-end test for the same flow.

#### 3. Coding / Practical Example

```typescript
test('GET user returns expected shape', async ({ request }) => {
  const res = await request.get('/users/2');
  expect(res.status()).toBe(200);

  const body = await res.json();
  expect(body.data).toHaveProperty('email');
});

test('create user returns 201', async ({ request }) => {
  const res = await request.post('/users', {
    data: { name: 'forkable-tester', job: 'sdet' },
  });
  expect(res.status()).toBe(201);
});

// Seed via API, then verify in the UI -- shared auth state
test('order appears in UI', async ({ page, request }) => {
  await request.post('/api/orders', { data: { productId: 1 } });
  await page.goto('/orders');
  await expect(page.getByText('Forkable Mug')).toBeVisible();
});
```

#### 4. STAR Method Answer

| | |
|---|---|
| **S — Situation** | Our end-to-end suite was the only thing verifying certain backend behaviours, making it slow and failures hard to localise — UI bug or API bug? |
| **T — Task** | I needed faster, more precise coverage of the API contract itself. |
| **A — Action** | I added an API-layer suite using the `request` fixture for the same critical endpoints, asserting status codes and payload shape directly, and used API calls to seed data for UI tests instead of clicking through setup. |
| **R — Result** | Backend regressions surfaced in seconds instead of minutes, failures became easy to localise, and the UI suite got faster by skipping UI-driven setup. |

#### 5. Interview-Ready Answer

> "I use Playwright's request fixture — no extra HTTP library, and it can share auth state with the browser context, so I can seed data via API and verify in the UI in the same test. That combination is why I'd pick it over axios for a Playwright project."

#### 6. Important Interview Point

- Mentioning API-driven setup for UI tests scores well — it shows you think about suite speed, not just coverage.

#### 7. One-Line Revision

⚡ **`request` fixture = API testing with no extra library, and shared auth state with the browser.**

---
### 6.2 How Do You Decide the Right Mix of API vs UI Tests?

**Source:** Commonly asked — test strategy round.

#### 1. Direct Answer

Follow the testing pyramid: many fast, isolated unit and API tests at the base; few UI/E2E tests at the top covering only journeys that must be verified exactly as a user experiences them.

Push validation, business rules, and data-shape checks down to the API layer. Reserve UI tests for flows where the interaction itself is under test — multi-step wizards, drag-and-drop, visual regressions.

A useful smell: if a UI test is asserting deep business logic like tax calculation, that check belongs at the API layer. The UI test should verify the number *reaches the screen*, not that the maths is right.

#### 2. Real-Time Project Example

Checkout: verify pricing and discount logic via API tests (fast, precise), and keep one true end-to-end UI test walking add-to-cart → coupon → complete, to catch integration issues API-only tests can't see.

#### 5. Interview-Ready Answer

> "I push logic and validation checks down to the API layer and reserve UI tests for the few journeys where the interaction itself is what's under test. That keeps the pyramid healthy instead of top-heavy and slow."

#### 6. Important Interview Point

- If asked to fix a slow suite, this is the strongest answer available: rebalance the pyramid and seed via API. “Add more workers” treats the symptom.

#### 7. One-Line Revision

⚡ **Logic and validation → API tests; UI tests only where the interaction itself is the thing under test.**

---

[← Back to interview-prep index](README.md)
