/**
 * Static server for the local practice fixture.
 *
 * Why this exists
 * ---------------
 * The framework suite used to run against a third-party public practice site.
 * That made every red build ambiguous: your change, or their outage? For a repo
 * whose audience is interviewers, a red badge you cannot explain is worse than
 * no badge at all.
 *
 * Playwright's `webServer` block starts this before the suite and stops it
 * after, so CI is hermetic and offline. The live site is still reachable --
 * set BASE_URL and the same specs run against it, which is how you find out
 * that the real page changed.
 */
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PRACTICE_APP_PORT) || 4321;

const app = express();

// Mounted at /AutomationPractice/ so the path matches the live site. The smoke
// test asserts `toHaveURL(/AutomationPractice/)`, which is a real invariant
// worth keeping -- the fixture should satisfy the suite as written, not force
// the suite to be weakened for it.
app.use('/AutomationPractice', express.static(here, { extensions: ['html'] }));
app.get('/', (_req, res) => res.redirect('/AutomationPractice/'));

app.listen(port, () => {
  console.log(`practice fixture on http://127.0.0.1:${port}/AutomationPractice/`);
});
