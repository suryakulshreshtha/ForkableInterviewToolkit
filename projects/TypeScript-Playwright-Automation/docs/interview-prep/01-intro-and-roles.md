# 1. Introduction & Roles (Behavioural)

How you open an interview and frame your own scope. Stack-agnostic where it can be, TypeScript + Playwright where it matters.

---

### 1.1 Tell Me About Yourself (Automation Test Engineer / SDET)

**Source:** Commonly asked — opening question, every QA/SDET round. Framed for a TypeScript + Playwright stack.

#### 1. Direct Answer

“Hi, I'm [Your Name]. I'm an Automation Test Engineer / SDET with 8+ years in software testing, working primarily with TypeScript, Playwright Test, API testing, SQL, and CI/CD-driven automation frameworks.

I design and maintain frameworks using the Page Object Model with Playwright's custom fixtures, and integrate suites into CI/CD via GitHub Actions.

I've covered the full testing lifecycle — requirement analysis, test design, automation, defect reporting, regression, and release validation.

Currently I'm focused on Playwright's newer capabilities: trace-based debugging, project dependencies for auth setup, and sharded parallel execution.”

#### 5. Interview-Ready Answer

> "8+ years in automation testing, focused on TypeScript + Playwright Test — full lifecycle ownership, POM plus custom fixtures, CI/CD via GitHub Actions."

#### 6. Important Interview Point

- Keep it to 60–90 seconds. Years → stack → one framework highlight → what you're learning now. That last part invites the framework-design follow-up you actually want.

#### 7. One-Line Revision

⚡ **Experience → stack → framework ownership → CI/CD → what I'm learning now.**

---
### 1.2 Explain Your Roles and Responsibilities (Senior QA / SDET)

**Source:** Commonly asked — Senior QA / SDET technical round. Stack-agnostic; applies to any automation language.

#### 1. Direct Answer

A strong Senior QA introduction is structured around experience, testing skills, automation responsibilities, project ownership, and collaboration.

I'm involved in the complete testing lifecycle — understanding requirements, identifying scenarios, designing cases, executing functional testing, automating regression, analysing failures, reporting defects, and supporting release validation.

At Senior level I'd also mention framework maintenance, code reviews, CI/CD pipeline ownership, mentoring juniors, and contributing to test strategy and estimation during sprint planning.

#### 2. Real-Time Project Example

On a recent release I owned the regression framework end-to-end: reviewing automation PRs, maintaining the CI pipeline, and presenting a go/no-go risk summary to release stakeholders based on test results.

#### 5. Interview-Ready Answer

> "I own the full testing lifecycle — requirement analysis through automation, defect management, and release validation — plus framework maintenance, code reviews, CI/CD ownership, and mentoring, since that's expected at Senior level."

#### 6. Important Interview Point

- Don't stop at “what I test.” Interviewers listen for ownership language: framework decisions, code review, mentoring, CI/CD.

#### 7. One-Line Revision

⚡ **Senior QA = testing lifecycle + automation ownership + framework/CI/CD + mentoring.**

---
### 1.3 Why TypeScript + Playwright Over Java + Selenium?

**Source:** Commonly asked — stack-justification follow-up.

> 🆕 **New Addition:** Added to fill a gap; a near-certain follow-up once you name your stack.

#### 1. Direct Answer

Playwright ships one API driving Chromium, Firefox, and WebKit over a single protocol, with built-in auto-waiting and no driver-binary management. Pairing it with TypeScript means the test code shares a language with most modern web front-ends, so tests live next to the app, reuse its types, and get compile-time safety on locators, fixtures, and test data.

TypeScript is also Playwright's first-class language — new features land in the JS/TS API first, and `base.extend()` fixtures have no direct Python equivalent.

That said, it's a fit decision, not a universal ranking. Selenium is more mature, supports more languages, and is often correct for existing grids or heavily invested teams.

#### 2. Real-Time Project Example

A team whose front-end was already TypeScript moved from Java/Selenium: tests moved into the same repo as the app, shared the app's own type definitions for API payloads, and a whole class of drift bugs disappeared because a backend type change broke the tests at compile time.

#### 5. Interview-Ready Answer

> "We chose Playwright + TypeScript for built-in auto-waiting, one-API-multi-browser, and sharing a language with our front-end — tests reuse app types and fail at compile time when contracts change. It's a fit decision for our team, not a claim it's objectively better everywhere."

#### 6. Important Interview Point

- Don't trash Selenium. Frame it as fit, and acknowledge Selenium's maturity and language breadth — interviewers notice the difference between judgement and tribalism.

#### 7. One-Line Revision

⚡ **TS + Playwright = one multi-browser API + auto-waiting + same language and types as the app under test.**

---

[← Back to interview-prep index](README.md)
