# 8. QA Process & Soft Skills

The non-code half of a Senior QA / SDET loop — and often the half that decides the offer.

---

### 8.1 A Developer Is Not Fixing a Bug — How Would You Approach the Situation?

**Source:** Commonly asked — behavioural / techno-managerial round. Universal QA process content, not language-specific.

#### 1. Direct Answer

I would first avoid making the discussion personal. I would verify that the defect is reproducible and that the severity/priority is justified.

Then I would provide clear evidence: steps to reproduce, expected versus actual behavior, screenshots/logs, affected functionality, and business impact.

I would discuss the issue with the developer to understand whether there is a technical reason, a requirement ambiguity, or planned behavior. If the disagreement continues, I would involve the product owner, QA lead, or the defect-triage process so that risk and priority are decided by the appropriate stakeholders.

The goal is to reach a documented decision based on evidence and business risk — not to win an argument.

#### 2. Real-Time Project Example

Suppose a critical payment defect is being deferred. I would reproduce it, demonstrate the impact, explain which users and transactions are affected, and discuss it with the developer and product owner. If the team still chooses to defer it, I would make sure the decision and the associated risk are documented.

#### 4. STAR Method Answer

| | |
|---|---|
| **S — Situation** | A defect affecting an important business flow was not being fixed immediately. |
| **T — Task** | I needed to make sure the product risk was clearly understood before release. |
| **A — Action** | I reproduced the defect, collected evidence, explained severity and business impact, discussed it with development and product stakeholders, and followed the formal triage process. |
| **R — Result** | The team made a documented decision based on risk and business priority, rather than personal disagreement. |

#### 5. Interview-Ready Answer

> "I focus on evidence, severity, and business impact rather than blaming the developer. I first discuss the issue directly, and if necessary I use the team's formal defect-triage or escalation process."

#### 6. Important Interview Point

- A Senior QA should be assertive about risk but collaborative in communication.

#### 7. One-Line Revision

⚡ **Evidence → impact → discussion → triage → documented decision.**

---
### 8.2 How Do You Decide What to Automate vs Keep Manual?

**Source:** New — added to broaden QA process/strategy coverage.

> 🆕 **New Addition:** Not sourced from any screenshot — added because automation-prioritization is a very common Senior QA/SDET interview question.

#### 1. Direct Answer

Prioritize automation candidates by repeatability (run often, e.g. every regression cycle), stability (the flow itself isn't still churning), and business risk (core revenue/critical paths first). Exploratory testing, one-off validations, and highly volatile in-development UI are usually poor automation investments until they stabilize.

#### 2. Real-Time Project Example

Automate the checkout and login flows first — run every release, high business risk, stable UI — before automating a brand-new, still-changing settings page.

#### 4. STAR Method Answer

| | |
|---|---|
| **S — Situation** | The backlog of “things to automate” was growing faster than the team's automation capacity. |
| **T — Task** | I needed a way to prioritize which tests to automate first, given limited time. |
| **A — Action** | I scored candidate flows on repeatability, stability, and business risk, and automated the highest-scoring ones first, deliberately leaving volatile in-development screens as manual/exploratory for now. |
| **R — Result** | We got automation coverage on the flows that mattered most, without wasting time re-writing tests for a UI that was still changing weekly. |

#### 5. Interview-Ready Answer

> "I score candidate flows on repeatability, stability, and business risk, and automate the highest-scoring ones first — volatile, still-changing screens stay manual/exploratory until they stabilize."

#### 6. Important Interview Point

- “We should automate everything eventually” is a fine long-term goal, but interviewers want to hear your prioritization criteria, not just intent.

#### 7. One-Line Revision

⚡ **Automate by repeatability × stability × business risk — not just “because we can.”**

---
### 8.3 How Do You Handle Flaky Tests?

**Source:** New — added to broaden QA process/strategy coverage.

> 🆕 **New Addition:** Not sourced from any screenshot — added because flaky-test triage is one of the most common Senior QA/SDET behavioral questions.

#### 1. Direct Answer

First confirm it's actually flaky (re-run in isolation, check CI logs/traces) rather than assuming — a real intermittent bug is a different problem than a flaky test. Common root causes: weak locators, missing waits for a genuinely async condition, shared test state/data, and environment/network instability.

Fix the root cause (better locator, proper wait/assertion) rather than papering over it with retries; use retries sparingly and only for known-unreliable external dependencies, and quarantine a test (mark it, don't delete it) if it can't be fixed immediately, so it doesn't erode trust in the whole suite.

#### 2. Real-Time Project Example

A test occasionally failed because it asserted on a toast notification that could disappear before the assertion ran — fixed by waiting for the toast to appear before asserting, instead of adding a blanket retry.

#### 4. STAR Method Answer

| | |
|---|---|
| **S — Situation** | A subset of our regression suite failed intermittently, and the team had started ignoring red CI runs because “it's probably just flaky.” |
| **T — Task** | I needed to restore trust in the suite's results before flaky failures started masking real regressions. |
| **A — Action** | I triaged each flaky test individually — fixing weak locators and race-condition-prone assertions at the root, quarantining the couple that needed a deeper fix, and reserving retries only for one genuinely unreliable third-party widget. |
| **R — Result** | CI failures became trustworthy signals again, and the team stopped reflexively re-running red pipelines. |

#### 5. Interview-Ready Answer

> "I confirm it's really flaky first, then fix the root cause — usually a weak locator or a missing wait for a genuinely async condition — rather than masking it with retries. Anything I can't fix immediately gets quarantined and tracked, not silently retried forever."

#### 6. Important Interview Point

- A rising retry count across the suite is a warning sign, not a solution — it usually means root causes are being masked, not fixed.

#### 7. One-Line Revision

⚡ **Flaky test triage: confirm it's really flaky → fix the root cause (locator/wait) → quarantine if unresolved → retries only for known-unreliable externals.**

---

[← Back to interview-prep index](README.md)
