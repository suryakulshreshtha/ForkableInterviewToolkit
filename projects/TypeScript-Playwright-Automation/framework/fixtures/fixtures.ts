import { test as base } from '@playwright/test';

import { makePracticePage, type MyFixtures } from './definitions';
import { baseUrl } from '../utils/config';

/**
 * Custom fixtures via `base.extend()` -- the native Playwright Test API.
 *
 * Worth knowing for interviews: this is the mechanism the Python project has to
 * approximate with `@pytest.fixture` in conftest.py, because the Python binding
 * has no `base.extend()`. Same idea, different plumbing.
 *
 * Import `test` and `expect` from HERE in every spec, not from '@playwright/test'.
 */
export const test = base.extend<MyFixtures>({
  appUrl: async ({}, use) => {
    await use(baseUrl());
  },

  practicePage: async ({ page, appUrl }, use) => {
    await use(await makePracticePage(page, appUrl));
  },
});

export { expect } from '@playwright/test';
