import { expect, test } from '../fixtures/fixtures';

/**
 * Alerts, confirms, iframes, and new tabs.
 *
 * Playwright's dialog model is event-driven -- you register a handler BEFORE the
 * triggering action. There is no switchTo() step as there is in Selenium.
 */

test('@dialogs alert shows entered name', async ({ practicePage, page }) => {
  let message = '';
  let type = '';

  page.on('dialog', async (dialog) => {
    message = dialog.message();
    type = dialog.type();
    await dialog.accept();
  });

  await practicePage.triggerAlert('ForkableTester');

  expect(message).toContain('ForkableTester');
  expect(type).toBe('alert');
});

test('@dialogs confirm dialog can be dismissed', async ({ practicePage, page }) => {
  let type = '';

  page.on('dialog', async (dialog) => {
    type = dialog.type();
    await dialog.dismiss(); // click Cancel
  });

  await practicePage.triggerConfirm('SdetSurya');

  expect(type).toBe('confirm');
});

test('@dialogs iframe content is reachable', async ({ practicePage }) => {
  // frameLocator() scopes queries into the iframe's document.
  const frame = practicePage.coursesFrame();
  await expect(frame.locator('body')).toBeVisible();
});

test('@dialogs open new tab', async ({ practicePage, context, page }) => {
  // waitForEvent('page') captures a popup opened by a click.
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    practicePage.openTabLink.click(),
  ]);

  await newPage.waitForLoadState('domcontentloaded');
  expect(newPage.url()).not.toBe(page.url());
  await newPage.close();
});
