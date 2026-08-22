# Load Testing Example (Artillery)

YAML-defined load testing that stays entirely in the Node ecosystem — the TypeScript counterpart to the Python project's Locust example.

## ⚠️ Read this first

**This example never touches the public practice site.** It ships with its own local Express target, and `scripts/run-load-test.ts` hard-exits if the target isn't `localhost`/`127.0.0.1`.

Load-testing infrastructure you don't own is, at best, a terms-of-service violation and, at worst, indistinguishable from a denial-of-service attack. Don't.

## Running it

```bash
# Terminal 1 — start the local target
npm run load:target

# Terminal 2 — run the guarded load test
npm run load:test
```

## JMeter → Artillery translation

| JMeter | Artillery | Interview one-liner |
|---|---|---|
| Thread Group → number of threads | `arrivalRate` | New virtual users per second |
| Ramp-up period | `phases` with increasing `arrivalRate` | How fast load builds |
| Loop count | `duration` | How long the phase runs |
| Request proportions | `weight` per scenario | Relative frequency of each flow |
| Assertions | `expect: statusCode` | Pass/fail criteria per request |

## Artillery vs Locust vs k6

| Tool | Language | Why you'd pick it |
|---|---|---|
| **Artillery** | YAML + JS | Stays in the Node ecosystem; installs via npm |
| **Locust** | Python | Full programmatic control; used in this repo's Python project |
| **k6** | JS syntax, Go binary | Excellent performance, but a separate binary to install |

For a TypeScript-first team, Artillery means one `npm install` and zero extra runtimes — that's the honest reason, and a good interview answer.
