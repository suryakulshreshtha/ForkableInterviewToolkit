import { expect, test } from '../fixtures/fixtures';
import { loadPracticeData } from '../utils/testData';

/**
 * Web-table extraction and validation.
 *
 * Demonstrates reading structured data out of the DOM and asserting on it in
 * TypeScript, rather than trying to express the whole assertion in a selector.
 */

test('@table course prices are positive integers', async ({ practicePage }) => {
  const prices = await practicePage.coursePrices();

  expect(prices.length).toBeGreaterThan(0);
  for (const price of prices) {
    expect(Number.isInteger(price)).toBe(true);
    expect(price).toBeGreaterThanOrEqual(0);
  }
});

test('@table total course price is computed', async ({ practicePage }) => {
  const prices = await practicePage.coursePrices();
  const total = prices.reduce((sum, p) => sum + p, 0);

  expect(total).toBeGreaterThan(0);
});

// Data-driven from test-data/practice-data.json
const practiceData = loadPracticeData();

for (const keyword of practiceData.expectedCourseKeywords) {
  test(`@table course list contains "${keyword}"`, async ({ practicePage }) => {
    const names = (await practicePage.courseNames()).join(' | ');
    expect(names.toLowerCase()).toContain(keyword.toLowerCase());
  });
}
