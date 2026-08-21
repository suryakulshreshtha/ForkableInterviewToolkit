# 0. How to Use This Guide

These notes are the study half of [Python-Playwright-Automation](../../README.md). The other half is running code in [`framework/`](../../framework/) and [`examples/`](../../examples/) — they're meant to be read together, and they cross-link both ways so neither can quietly drift out of date.

---

## Format

Every entry follows the same seven parts:

> **1.** Direct Answer → **2.** Real-Time Project Example → **3.** Code → **4.** STAR Answer → **5.** Interview-Ready Answer → **6.** Interview Tip → **7.** One-Line Revision

Not every entry has all seven. STAR sections appear on behaviour-flavoured questions; code sections appear where there's something real to show.

## Callouts

| Callout | Meaning |
|---|---|
| ✎ **Editor's Note** | Content that was reconstructed or completed rather than written from scratch |
| 🆕 **New Addition** | Written fresh for this edition — either replacing a removed Java/Selenium topic, or filling an acknowledged gap |

These exist so you can always tell how confident to be in a given entry. [Chapter 11](11-revision-log.md) is the full audit trail.

---

## This is a Python guide

Earlier versions of these notes were Java/Selenium. Every trace of that is gone, and some questions genuinely **don't translate**:

| Java question | Why it's not here | What replaced it |
|---|---|---|
| Checked vs unchecked exceptions | Python has no checked exceptions at all | [2.1](02-python-core-concepts.md) — how Python exception handling actually works |
| Static vs dynamic binding | Python has no compile-time binding phase | [2.2](02-python-core-concepts.md) — runtime resolution via MRO / duck typing |
| `switchTo().alert()` | Playwright's dialog model is event-driven | [3.3](03-playwright-core-concepts.md) — `page.on("dialog", …)` |
| Implicit vs explicit wait | Playwright removes the choice entirely | [3.5](03-playwright-core-concepts.md) — the auto-waiting model |

Answering a Java-framed question with *"that concept doesn't exist in Python, and here's what does instead"* is a **stronger** answer than forcing a translation. Several entries are written to set exactly that up.

---

## A note on honesty

The §5 Interview-Ready Answers are deliberately hedged where hedging is correct — "Playwright *can* be faster", not "Playwright *is* faster". Interviewers probe overclaims, and a candidate who volunteers the trade-off reads as more senior than one who doesn't.

Same goes for your own experience: use the STAR sections as **structure**, not as a script. Swap in what you actually did.

---

[← Back to interview-prep index](README.md)
