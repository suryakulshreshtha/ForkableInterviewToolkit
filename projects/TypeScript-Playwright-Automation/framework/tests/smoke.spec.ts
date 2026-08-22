import { expect, test } from '../fixtures/fixtures';

/** Smoke: the critical path. If these fail, don't bother reading the rest. */

test('@smoke page loads', async ({ practicePage, page }) => {
  // toHaveURL accepts a string, regex, or predicate in the JS API.
  // (The Python binding accepts only a string or compiled regex -- a real
  // cross-language gotcha worth knowing.)
  await expect(page).toHaveURL(/AutomationPractice/);
  await expect(practicePage.dropdown).toBeVisible();
});

test('@smoke @table courses table has rows', async ({ practicePage }) => {
  const rows = practicePage.coursesTable.locator('tbody tr');
  await expect(rows.first()).toBeVisible();
  expect(await rows.count()).toBeGreaterThan(1);
});
