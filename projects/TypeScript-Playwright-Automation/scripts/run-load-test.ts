/**
 * Guarded Artillery runner.
 *
 * Refuses to load-test anything but a local target, mirroring the Locust guard in
 * the Python project. Load-testing infrastructure you don't own is, at best, a
 * terms-of-service violation and, at worst, indistinguishable from a DoS attack.
 *
 *     npm run load:target      # terminal 1
 *     npm run load:test        # terminal 2
 *
 * Override only if you genuinely own the target:  LOAD_ALLOW_REMOTE=1 npm run load:test
 */
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const CONFIG = resolve(HERE, '../examples/load-artillery/artillery.yml');

const ALLOWED_PREFIXES = ['http://localhost', 'http://127.0.0.1'];

function targetFromConfig(path: string): string {
  const raw = readFileSync(path, 'utf8');
  // Deliberately a simple line scan rather than a YAML dependency -- the guard
  // should be trivially auditable.
  const match = raw.match(/^\s*target:\s*["']?([^"'\s]+)["']?/m);
  if (!match) {
    console.error(`[load] Could not find a 'target:' in ${path}. Refusing to run.`);
    process.exit(1);
  }
  return match[1].replace(/\/+$/, '');
}

const target = process.env.LOAD_TARGET?.replace(/\/+$/, '') ?? targetFromConfig(CONFIG);
const isLocal = ALLOWED_PREFIXES.some((p) => target.startsWith(p));

if (!isLocal && process.env.LOAD_ALLOW_REMOTE !== '1') {
  console.error(
    `\n[load] Refusing to load-test '${target}'.\n` +
      `       This repo only load-tests its own local target app.\n` +
      `       Start it with: npm run load:target\n` +
      `       If you own the target, set LOAD_ALLOW_REMOTE=1 to override.\n`,
  );
  process.exit(1);
}

if (!isLocal) {
  console.warn(`[load] WARNING: remote target allowed by env override -> ${target}`);
}

console.log(`[load] Target OK: ${target}`);

const args = ['run', CONFIG, '--target', target];
const child = spawn('npx', ['artillery', ...args], { stdio: 'inherit' });
child.on('exit', (code) => process.exit(code ?? 0));
