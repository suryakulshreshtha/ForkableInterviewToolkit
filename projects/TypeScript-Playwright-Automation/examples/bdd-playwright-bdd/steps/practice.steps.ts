import { createBdd } from 'playwright-bdd';

import { expect, test } from './bdd-fixtures';

/**
 * playwright-bdd step definitions.
 *
 * Steps receive the same custom fixtures as any normal spec -- `practicePage` here
 * is the very same fixture used in framework/tests. You're not adopting a second
 * framework, just a Gherkin-to-function binding layer on top of Playwright Test.
 *
 *     npm run test:bdd
 */
const { Given, When, Then } = createBdd(test);

Given('the user is on the practice page', async ({ practicePage }) => {
  await expect(practicePage.dropdown).toBeVisible();
});

When('the user selects dropdown option {string}', async ({ practicePage }, value: string) => {
  await practicePage.selectDropdownByValue(value);
});

Then('the dropdown should show {string}', async ({ practicePage }, value: string) => {
  await expect(practicePage.dropdown).toHaveValue(value);
});

When('the user clicks the hide button', async ({ practicePage }) => {
  await practicePage.hideTextbox();
});

Then('the text box should not be visible', async ({ practicePage }) => {
  await expect(practicePage.displayedText).toBeHidden();
});
