import type { FrameLocator, Locator, Page } from '@playwright/test';

import { BasePage } from './BasePage';

/**
 * Page Object for the public AutomationPractice page.
 *
 * Locator policy
 * --------------
 * Every selector this framework depends on lives in THIS file, so a markup change
 * is a one-file fix that never touches a test. Tables are located by header text
 * rather than by class/id, which survives a restyle.
 *
 * These selectors are the same set verified passing in the Python project.
 * Re-check any time with: npm run verify:selectors
 */
export class AutomationPracticePage extends BasePage {
  // --- Radio buttons ---
  readonly radioButtons: Locator;

  // --- Suggestion / autocomplete ---
  readonly autocompleteInput: Locator;

  // --- Static dropdown ---
  readonly dropdown: Locator;

  // --- Checkboxes ---
  readonly checkbox1: Locator;
  readonly checkbox2: Locator;
  readonly checkbox3: Locator;

  // --- Alerts ---
  readonly alertNameInput: Locator;
  readonly alertButton: Locator;
  readonly confirmButton: Locator;

  // --- New tab / new window ---
  readonly openTabLink: Locator;
  readonly openWindowButton: Locator;

  // --- Show / hide ---
  readonly displayedText: Locator;
  readonly hideButton: Locator;
  readonly showButton: Locator;

  // --- Mouse hover ---
  readonly mouseHoverButton: Locator;

  // --- iFrame ---
  readonly iframeSelector = '#courses-iframe';

  constructor(page: Page) {
    super(page);

    this.radioButtons = page.locator("input[name='radioButton']");
    this.autocompleteInput = page.locator('#autocomplete');
    this.dropdown = page.locator('#dropdown-class-example');

    this.checkbox1 = page.locator('#checkBoxOption1');
    this.checkbox2 = page.locator('#checkBoxOption2');
    this.checkbox3 = page.locator('#checkBoxOption3');

    this.alertNameInput = page.locator('#name');
    this.alertButton = page.locator('#alertbtn');
    this.confirmButton = page.locator('#confirmbtn');

    this.openTabLink = page.locator('#opentab');
    this.openWindowButton = page.locator('#openwindow');

    this.displayedText = page.locator('#displayed-text');
    this.hideButton = page.locator('#hide-textbox');
    this.showButton = page.locator('#show-textbox');

    this.mouseHoverButton = page.locator('#mousehover');
  }

  // ------------------------------------------------------------------ //
  // Resilient table locators: find the table by its HEADER TEXT rather  //
  // than a brittle class/id, so a restyle doesn't break them.           //
  // ------------------------------------------------------------------ //
  get coursesTable(): Locator {
    return this.page.locator('table').filter({ hasText: 'Instructor' }).first();
  }

  get amountTable(): Locator {
    return this.page.locator('table').filter({ hasText: 'Amount' }).first();
  }

  // ---------------------------- actions ----------------------------- //
  async selectRadio(index: number): Promise<void> {
    await this.radioButtons.nth(index).check();
  }

  async selectDropdownByValue(value: string): Promise<void> {
    await this.dropdown.selectOption(value);
  }

  async checkAllCheckboxes(): Promise<void> {
    for (const box of [this.checkbox1, this.checkbox2, this.checkbox3]) {
      await box.check();
    }
  }

  async triggerAlert(name: string): Promise<void> {
    await this.alertNameInput.fill(name);
    await this.alertButton.click();
  }

  async triggerConfirm(name: string): Promise<void> {
    await this.alertNameInput.fill(name);
    await this.confirmButton.click();
  }

  async hideTextbox(): Promise<void> {
    await this.hideButton.click();
  }

  async showTextbox(): Promise<void> {
    await this.showButton.click();
  }

  async hoverMenu(): Promise<void> {
    await this.mouseHoverButton.hover();
  }

  coursesFrame(): FrameLocator {
    return this.page.frameLocator(this.iframeSelector);
  }

  // ------------------------------ state ----------------------------- //
  /** Every value in the Price column, as numbers. */
  async coursePrices(): Promise<number[]> {
    const rows = this.coursesTable.locator('tbody tr');
    const prices: number[] = [];

    for (let i = 0; i < (await rows.count()); i++) {
      const cells = rows.nth(i).locator('td');
      if ((await cells.count()) >= 3) {
        const raw = (await cells.nth(2).innerText()).trim();
        if (/^\d+$/.test(raw)) prices.push(Number(raw));
      }
    }
    return prices;
  }

  async courseNames(): Promise<string[]> {
    const rows = this.coursesTable.locator('tbody tr');
    const names: string[] = [];

    for (let i = 0; i < (await rows.count()); i++) {
      const cells = rows.nth(i).locator('td');
      if ((await cells.count()) >= 2) {
        names.push((await cells.nth(1).innerText()).trim());
      }
    }
    return names;
  }
}
