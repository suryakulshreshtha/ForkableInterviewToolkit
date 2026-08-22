# 0. How to Use This Guide

These notes are the study half of [TypeScript-Playwright-Automation](../../README.md). The other half is running code in [`framework/`](../../framework/) and [`examples/`](../../examples/) — they're meant to be read together, and they cross-link both ways so neither can quietly drift out of date.

---

## Format

Every entry follows the same seven parts:

> **1.** Direct Answer → **2.** Real-Time Project Example → **3.** Code → **4.** STAR Answer → **5.** Interview-Ready Answer → **6.** Interview Tip → **7.** One-Line Revision

Not every entry has all seven. STAR sections appear on behaviour-flavoured questions; code sections appear where there's something real to show.

---

## This is the TypeScript edition

There's a parallel [Python edition](../../../Python-Playwright-Automation/docs/interview-prep/) in this repo. Most concepts are shared, but several have **genuinely different APIs** — and naming those differences precisely is what separates a candidate who knows one binding from one who understands Playwright:

| Concept | Python | TypeScript |
|---|---|---|
| Custom fixtures | `@pytest.fixture` in `conftest.py` | `base.extend<T>()` — first-class Playwright API |
| Data-driven | `@pytest.mark.parametrize` | `for…of` loop around `test()` |
| Assertions | `expect(x).to_be_visible()` | `await expect(x).toBeVisible()` |
| Awaiting | Sync API — no `await` | Everything async — missing `await` is the #1 flakiness cause |
| `toHaveURL` | String or compiled regex only | String, regex, **or** a predicate function |

[Chapter 11](11-python-vs-typescript.md) covers this in full.

---

## A note on honesty

The §5 Interview-Ready Answers are deliberately hedged where hedging is correct — "Playwright *can* be faster", not "Playwright *is* faster". Interviewers probe overclaims, and a candidate who volunteers the trade-off reads as more senior than one who doesn't.

Same goes for your own experience: use the STAR sections as **structure**, not as a script. Swap in what you actually did.

---

[← Back to interview-prep index](README.md)
