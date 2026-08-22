import { expect, test } from '../fixtures/fixtures';

/**
 * Radio buttons, dropdowns, checkboxes, show/hide, hover -- the everyday widgets.
 *
 * Demonstrates: Page Object usage, web-first assertions, and data-driven tests.
 * Note the `for...of` loop wrapping `test()` -- that's the TypeScript equivalent
 * of Python's @pytest.mark.parametrize.
 */

for (const index of [0, 1, 2]) {
  test(`@ui radio button ${index} can be selected`, async ({ practicePage }) => {
    await practicePage.selectRadio(index);
    await expect(practicePage.radioButtons.nth(index)).toBeChecked();
  });
}

for (const value of ['option1', 'option2', 'option3']) {
  test(`@ui static dropdown selects ${value}`, async ({ practicePage }) => {
    await practicePage.selectDropdownByValue(value);
    await expect(practicePage.dropdown).toHaveValue(value);
  });
}

test('@ui all checkboxes can be checked', async ({ practicePage }) => {
  await practicePage.checkAllCheckboxes();
  for (const box of [practicePage.checkbox1, practicePage.checkbox2, practicePage.checkbox3]) {
    await expect(box).toBeChecked();
  }
});

test('@ui checkbox can be unchecked', async ({ practicePage }) => {
  await practicePage.checkbox1.check();
  await expect(practicePage.checkbox1).toBeChecked();

  await practicePage.checkbox1.uncheck();
  await expect(practicePage.checkbox1).not.toBeChecked();
});

test('@ui hide and show textbox', async ({ practicePage }) => {
  // Playwright auto-waits for visibility changes -- no sleeps needed.
  await expect(practicePage.displayedText).toBeVisible();

  await practicePage.hideTextbox();
  await expect(practicePage.displayedText).toBeHidden();

  await practicePage.showTextbox();
  await expect(practicePage.displayedText).toBeVisible();
});

test('@ui mouse hover reveals menu', async ({ practicePage, page }) => {
  await practicePage.hoverMenu();
  await expect(page.getByRole('link', { name: 'Top' })).toBeVisible();
});
