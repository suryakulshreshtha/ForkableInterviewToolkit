/**
 * Verify every locator the framework depends on, in one pass.
 *
 * The practice site is third-party and can change without notice. Run this before
 * pushing (or whenever a test starts failing oddly) to find out instantly whether
 * the problem is your code or the site's markup.
 *
 *     npm run verify:selectors
 *
 * Exit code 0 = all locators resolved. 1 = at least one is missing.
 */
import { chromium } from '@playwright/test';

import { baseUrl } from '../framework/utils/config';

type Check = { label: string; selector: string; min: number };

const CHECKS: Check[] = [
  { label: 'radio buttons',       selector: "input[name='radioButton']", min: 3 },
  { label: 'autocomplete input',  selector: '#autocomplete',             min: 1 },
  { label: 'static dropdown',     selector: '#dropdown-class-example',   min: 1 },
  { label: 'checkbox 1',          selector: '#checkBoxOption1',          min: 1 },
  { label: 'checkbox 2',          selector: '#checkBoxOption2',          min: 1 },
  { label: 'checkbox 3',          selector: '#checkBoxOption3',          min: 1 },
  { label: 'alert name input',    selector: '#name',                     min: 1 },
  { label: 'alert button',        selector: '#alertbtn',                 min: 1 },
  { label: 'confirm button',      selector: '#confirmbtn',               min: 1 },
  { label: 'open-tab link',       selector: '#opentab',                  min: 1 },
  { label: 'open-window button',  selector: '#openwindow',               min: 1 },
  { label: 'displayed text',      selector: '#displayed-text',           min: 1 },
  { label: 'hide button',         selector: '#hide-textbox',             min: 1 },
  { label: 'show button',         selector: '#show-textbox',             min: 1 },
  { label: 'mouse hover trigger', selector: '#mousehover',               min: 1 },
  { label: 'courses iframe',      selector: '#courses-iframe',           min: 1 },
];

const GREEN = '\x1b[92m';
const RED = '\x1b[91m';
const YELLOW = '\x1b[93m';
const RESET = '\x1b[0m';

async function main(): Promise<number> {
  const url = baseUrl();
  console.log(`\nVerifying locators against: ${url}\n${'-'.repeat(62)}`);

  const failures: Check[] = [];
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });

  for (const check of CHECKS) {
    const count = await page.locator(check.selector).count();
    const ok = count >= check.min;
    const mark = ok ? `${GREEN}PASS${RESET}` : `${RED}FAIL${RESET}`;
    console.log(`  [${mark}] ${check.label.padEnd(22)} ${check.selector.padEnd(28)} found=${count}`);
    if (!ok) failures.push(check);
  }

  // Header-text-filtered tables (resilient locators, no id dependency)
  for (const [label, needle] of [['courses table', 'Instructor'], ['amount table', 'Amount']]) {
    const count = await page.locator('table').filter({ hasText: needle }).count();
    const mark = count >= 1 ? `${GREEN}PASS${RESET}` : `${YELLOW}WARN${RESET}`;
    console.log(`  [${mark}] ${label.padEnd(22)} ${`table hasText=${needle}`.padEnd(28)} found=${count}`);
  }

  await browser.close();
  console.log('-'.repeat(62));

  if (failures.length > 0) {
    console.log(
      `${RED}${failures.length} locator(s) failed.${RESET} ` +
        `Update framework/pages/AutomationPracticePage.ts -- ` +
        `selectors live in that one file by design.\n`,
    );
    return 1;
  }

  console.log(`${GREEN}All locators resolved.${RESET}\n`);
  return 0;
}

main().then((code) => process.exit(code));
