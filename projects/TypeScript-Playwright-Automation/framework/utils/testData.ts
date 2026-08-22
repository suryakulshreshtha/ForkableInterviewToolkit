import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Load JSON test data.
 *
 * Read via `fs` rather than `import ... with { type: 'json' }` so the file stays a
 * plain, editable .json (non-engineers can update test data without touching test
 * code) and the project stays compatible across Node 18/20/22 ESM behaviour.
 */
const HERE = dirname(fileURLToPath(import.meta.url));

export type PracticeData = {
  dropdownOptions: string[];
  alertNames: string[];
  expectedCourseKeywords: string[];
};

export function loadPracticeData(): PracticeData {
  const path = resolve(HERE, '../test-data/practice-data.json');
  return JSON.parse(readFileSync(path, 'utf8')) as PracticeData;
}
