/** Central config. Everything overridable by environment variable, nothing hardcoded in tests. */

// Public practice site, published for automation practice. See the responsible-use
// policy in the repo README before pointing anything else at it.
export const DEFAULT_BASE_URL = 'https://rahulshettyacademy.com/AutomationPractice/';

export function baseUrl(): string {
  return process.env.BASE_URL ?? DEFAULT_BASE_URL;
}

export function loadTarget(): string {
  return process.env.LOAD_TARGET ?? 'http://localhost:3000';
}

export const DEFAULT_TIMEOUT_MS = Number(process.env.DEFAULT_TIMEOUT_MS ?? 15_000);
