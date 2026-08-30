/** Central config. Everything overridable by environment variable, nothing hardcoded in tests. */

/**
 * Default target: the local fixture in `fixtures/practice-app`.
 *
 * The suite used to point at a third-party public practice site by default,
 * which made every red build ambiguous -- your change, or their outage? Tests
 * that depend on someone else's uptime are not a gate, they are a rumour.
 *
 * The fixture implements the same controls under the same ids, so the page
 * objects and specs are unchanged. Set BASE_URL to run the identical suite
 * against the live site; `npm run test:live` does exactly that, and CI runs it
 * on a schedule as a non-blocking job so a real upstream change is still
 * noticed.
 */
export const LOCAL_PRACTICE_URL =
  `http://127.0.0.1:${process.env.PRACTICE_APP_PORT ?? 4321}/AutomationPractice/`;

/** The public practice site. See the responsible-use policy in the repo README. */
export const LIVE_PRACTICE_URL = 'https://rahulshettyacademy.com/AutomationPractice/';

export const DEFAULT_BASE_URL = LOCAL_PRACTICE_URL;

export function baseUrl(): string {
  return process.env.BASE_URL ?? DEFAULT_BASE_URL;
}

/** True when the suite is pointed at something other than the local fixture. */
export function isLiveTarget(): boolean {
  return !baseUrl().startsWith('http://127.0.0.1');
}

export function loadTarget(): string {
  return process.env.LOAD_TARGET ?? 'http://localhost:3000';
}

export const DEFAULT_TIMEOUT_MS = Number(process.env.DEFAULT_TIMEOUT_MS ?? 15_000);
