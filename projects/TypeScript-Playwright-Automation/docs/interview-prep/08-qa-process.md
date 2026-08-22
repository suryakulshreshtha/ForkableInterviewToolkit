# 8. QA Process & Soft Skills

The non-code half of a Senior QA / SDET loop — and often the half that decides the offer.

---

### 8.1 A Developer Is Not Fixing a Bug — How Would You Approach It?

**Source:** Commonly asked — behavioural / techno-managerial round. Language-agnostic.

#### 1. Direct Answer

First, avoid making it personal. Verify the defect is reproducible and that the severity and priority are justified.

Then provide clear evidence: steps to reproduce, expected versus actual, screenshots and logs, affected functionality, and business impact.

Discuss it with the developer to understand whether there's a technical reason, requirement ambiguity, or intended behaviour. If disagreement continues, involve the product owner, QA lead, or formal triage so risk and priority are decided by the right people.

The goal is a documented decision based on evidence and business risk — not winning an argument.

#### 2. Real-Time Project Example

A critical payment defect is being deferred: I'd reproduce it, demonstrate the impact, explain which users and transactions are affected, and discuss it with the developer and product owner. If the team still defers, I'd ensure the decision and risk are documented.

#### 4. STAR Method Answer

| | |
|---|---|
| **S — Situation** | A defect affecting an important business flow wasn't being fixed. |
| **T — Task** | I needed the product risk clearly understood before release. |
| **A — Action** | I reproduced it, collected evidence, explained severity and business impact, discussed it with development and product stakeholders, and followed the formal triage process. |
| **R — Result** | The team made a documented decision based on risk and business priority rather than personal disagreement. |

#### 5. Interview-Ready Answer

> "I focus on evidence, severity, and business impact rather than blaming the developer. I discuss it directly first, and escalate through formal triage only if needed — the aim is a documented decision, not a win."

#### 6. Important Interview Point

- Assertive about risk, collaborative in communication. Candidates who sound combative here raise flags regardless of technical skill.

#### 7. One-Line Revision

⚡ **Evidence → impact → discussion → triage → documented decision.**

---
### 8.2 How Do You Decide What to Automate?

**Source:** Commonly asked — strategy round.

#### 1. Direct Answer

Prioritise on three axes: **repeatability** (run often), **stability** (the flow isn't still churning), and **business risk** (core revenue and critical paths first).

Poor candidates: exploratory testing, one-off validations, and volatile in-development UI — automating those means rewriting them next sprint.

Also weigh maintenance cost. A test that breaks every sprint and gets “fixed” by loosening its assertions is worse than no test, because it produces false confidence.

#### 2. Real-Time Project Example

Automate checkout and login first — run every release, high business risk, stable UI — before a brand-new settings page that's still changing weekly.

#### 4. STAR Method Answer

| | |
|---|---|
| **S — Situation** | The backlog of things to automate was growing faster than the team's capacity. |
| **T — Task** | I needed a defensible way to prioritise with limited time. |
| **A — Action** | I scored candidate flows on repeatability, stability, and business risk, automated the highest first, and deliberately left volatile screens to exploratory testing. |
| **R — Result** | We got coverage on what mattered most without burning time rewriting tests for a UI that was still changing weekly. |

#### 5. Interview-Ready Answer

> "I score flows on repeatability, stability, and business risk, and automate the highest-scoring first. Volatile, still-changing screens stay manual until they settle — automating them early just means rewriting them."

#### 6. Important Interview Point

- “Automate everything eventually” is a fine aspiration but a weak answer. Interviewers want criteria and trade-offs.

#### 7. One-Line Revision

⚡ **Automate by repeatability × stability × business risk — and weigh maintenance cost honestly.**

---
### 8.3 How Do You Handle Flaky Tests?

**Source:** Commonly asked — one of the most frequent Senior QA/SDET questions.

#### 1. Direct Answer

First confirm it's actually flaky rather than an intermittent real bug — re-run in isolation and check the trace. Those are different problems with different fixes.

In a TypeScript suite the usual causes are: a **missing `await`**, a locator that isn't specific enough, shared state between tests that breaks under parallelism, and asserting on something transient like a toast that disappears.

Fix the root cause rather than masking it. Retries are for genuinely unreliable external dependencies, not for hiding races. A climbing retry count across the suite is a warning sign.

If a test can't be fixed immediately, quarantine it (`test.fixme`) and track it — don't leave it failing, because a suite people ignore protects nothing.

#### 2. Real-Time Project Example

A test failed intermittently because it asserted on a toast that could vanish before the assertion ran. Fixed by asserting on the resulting state change instead of the transient notification — not by adding a retry.

#### 4. STAR Method Answer

| | |
|---|---|
| **S — Situation** | Part of our regression suite failed intermittently and the team had started ignoring red CI runs. |
| **T — Task** | I needed to restore trust before flaky failures masked a real regression. |
| **A — Action** | I triaged each one from its trace — fixing missing awaits, tightening locators, and removing shared state — quarantined the two that needed deeper work, and reserved retries for one genuinely unreliable third-party widget. |
| **R — Result** | CI failures became trustworthy signals again and the team stopped reflexively re-running red pipelines. |

#### 5. Interview-Ready Answer

> "I confirm it's really flaky, then read the trace to find the root cause — usually a missing await, a loose locator, or shared state under parallelism. I fix that rather than adding retries, and quarantine anything I can't fix immediately so the suite stays trustworthy."

#### 6. Important Interview Point

- Naming the trace viewer as your diagnostic tool is the strongest possible answer here — it's concrete and shows you've actually debugged flakiness rather than just re-run it.

#### 7. One-Line Revision

⚡ **Confirm → read the trace → fix root cause (await/locator/state) → quarantine if unresolved → retries only for real externals.**

---

[← Back to interview-prep index](README.md)
