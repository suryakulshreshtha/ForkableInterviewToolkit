import { expect, test } from '@playwright/test';

/**
 * API testing with Playwright's built-in `request` fixture.
 *
 * No extra HTTP library needed -- APIRequestContext ships with Playwright and can
 * share cookies/auth state with a browser context when you need it to.
 *
 * Target is reqres.in: a free, public, purpose-built mock REST API.
 * No auth, no real data, no rate-limit abuse.
 *
 *     npm run test:api
 */

test('GET single user returns expected shape', async ({ request }) => {
  const res = await request.get('/users/2');
  expect(res.status()).toBe(200);

  const body = await res.json();
  expect(body).toHaveProperty('data');
  for (const field of ['id', 'email', 'first_name', 'last_name']) {
    expect(body.data).toHaveProperty(field);
  }
  expect(body.data.id).toBe(2);
});

test('missing user returns 404', async ({ request }) => {
  const res = await request.get('/users/23');
  expect(res.status()).toBe(404);
});

for (const pageNum of [1, 2]) {
  test(`user list is paginated (page ${pageNum})`, async ({ request }) => {
    const res = await request.get('/users', { params: { page: pageNum } });
    expect(res.ok()).toBeTruthy();

    const body = await res.json();
    expect(body.page).toBe(pageNum);
    expect(Array.isArray(body.data)).toBe(true);
  });
}

test('create user returns 201', async ({ request }) => {
  const payload = { name: 'forkable-tester', job: 'sdet' };
  const res = await request.post('/users', { data: payload });
  expect(res.status()).toBe(201);

  const body = await res.json();
  expect(body.name).toBe(payload.name);
  expect(body).toHaveProperty('id');
  expect(body).toHaveProperty('createdAt');
});
