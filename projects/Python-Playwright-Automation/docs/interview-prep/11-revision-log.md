# 11. Revision Log & Coverage Tracker

How each entry in this guide got here. Kept public on purpose: it's more useful to see what changed and what's missing than to pretend a study guide sprang into existence complete.

---

## A. Carried over from v1 — what changed

v1 of these notes was Java/Selenium-based. This edition is Python + Playwright. Here's what happened to every original entry:

| New # | Topic | What Changed |
| --- | --- | --- |
| 1.1 | Introduce Yourself (Automation Engineer) | Kept — adapted to Python + Playwright stack. |
| 1.2 | Roles & Responsibilities Intro (Senior QA) | Kept — unchanged, stack-agnostic content. |
| 3.1 | Custom Fixtures (appUrl) | Kept — adapted from JS base.extend() to a Python @pytest.fixture. |
| 3.2 | Auto-Waiting / Web-First Assertions vs Selenium | Kept — code converted from TypeScript to Python. |
| 4.1 | Playwright Framework Structure + Folder Tree | Kept — merged with the old Selenium/Java framework answer into one unified Python framework. |
| — | Entering Text in a JS Alert (Selenium/Java) | Removed (Java/Selenium-specific) → replaced by 3.3 (Playwright Python dialog handling). |
| — | Checked vs Unchecked Exceptions (Java) | Removed (Java-specific) → replaced by 2.1 (Python exception handling). |
| — | Static vs Dynamic Binding (Java) | Removed (Java-specific) → replaced by 2.2 (Python runtime method resolution / MRO). |
| — | Implicit Wait vs Explicit Wait (Selenium/Java) | Removed (Selenium-specific dichotomy) → replaced by 3.5 (Playwright's auto-waiting model). |
| — | Explain Your Framework in Detail (Selenium/Java) | Removed as a standalone entry → merged into 4.1 (unified Python + Playwright framework). |
| 5.1 | Why Prefer Cucumber BDD | Kept — reframed for Python's pytest-bdd/behave. |
| 8.1 | Developer Not Fixing a Bug | Kept — unchanged, universal QA process content. |
| 9.1 | What Are Threads in JMeter | Kept — tool-agnostic, still commonly asked. |
| 10 | Tools Glossary Fragment | Kept and expanded with Python/Playwright/CI terms. |


---

## B1. New entries replacing removed Java-specific content

Each of these replaces a removed Java/Selenium entry with a Python + Playwright equivalent covering the same underlying concept:

| # | New Entry | Why It Was Added |
| --- | --- | --- |
| 2.1 | Python Exception Handling in Test Automation | Direct replacement for the removed Java checked/unchecked-exceptions question. |
| 2.2 | Python Runtime Method Resolution (MRO / Duck Typing) | Direct replacement for the removed Java static/dynamic-binding question. |
| 3.3 | Handling Alerts / Dialogs in Playwright (Python) | Direct replacement for the removed Selenium/Java alert-handling question. |
| 3.5 | Playwright's Auto-Waiting Model vs Selenium | Direct replacement for the removed Selenium implicit/explicit-wait question. |


---

## B2. New entries added to broaden coverage

Additive — not replacing anything, just rounding out a modern QA/SDET interview surface:

| # | New Entry | Why It Was Added |
| --- | --- | --- |
| 1.3 | Why Python + Playwright Over Java + Selenium? | Natural follow-up once the stack is mentioned. |
| 2.3 | Python Decorators in a Test Framework | Core Python fundamental underpinning pytest itself. |
| 2.4 | Comprehensions & Context Managers | Common Python idioms in automation code. |
| 2.5 | Dependency & Environment Management (venv/Poetry) | Near-universal Python setup question. |
| 3.4 | Locator Strategies in Playwright (Python) | Very common Playwright-specific interview topic. |
| 4.2 | Page Object Model (POM) in Python — Structure | Concrete code example to back up framework discussions. |
| 4.3 | Data-Driven Testing in Pytest | Natural follow-up to any framework/parametrize discussion. |
| 5.2 | Feature File + pytest-bdd Step Definitions | Concrete Python implementation of the BDD answer above. |
| 6.1 | API Testing in Python (requests / Playwright) | Near-certain topic for a modern QA/SDET interview. |
| 6.2 | API vs UI Test Strategy (Testing Pyramid) | Common strategy follow-up to API testing. |
| 7.1 | CI/CD Integration (GitHub Actions) | Common follow-up to any framework-design discussion. |
| 7.2 | Reporting & Debugging Tools (Allure, Trace Viewer) | Common follow-up to CI/CD integration. |
| 8.2 | Automate vs Manual — Prioritization | Very common Senior QA/SDET strategy question. |
| 8.3 | Handling Flaky Tests | Very common Senior QA/SDET behavioral question. |
| 9.2 | Performance Testing With Locust (Python) | Python-native counterpart to the JMeter question. |


---

## C. Known gaps — planned next additions

Topics a full Senior QA / SDET loop would normally also cover, tracked openly so the gaps are visible rather than silently missing:

| Gap | Round Type | What It Would Cover |
| --- | --- | --- |
| Playwright — advanced | Technical | Network interception & mocking (page.route), storage_state auth reuse, visual/screenshot comparison, and component testing. |
| Python — advanced | Technical | Generators & iterators, async/await with Playwright's async API, typing/mypy, and writing a custom pytest plugin. |
| Databases & SQL | Technical | Joins, aggregations, and validating data through the DB layer as part of an end-to-end check. |
| Containers & infra | Technical | Dockerising the suite, Playwright's official container image, and running against a Selenium/Playwright grid. |
| Test management | Techno-Managerial | Estimation, test-plan and test-strategy documents, risk-based prioritisation, and release sign-off criteria. |
| Agile & collaboration | Techno-Managerial | QA in scrum ceremonies, definition of done, three-amigos sessions, and shift-left practices. |
| Security & accessibility | Technical | OWASP Top 10 awareness for QA, and automated a11y checks (axe-core / Playwright accessibility snapshots). |
| Mobile & cross-browser | Technical | Playwright device emulation, responsive testing, and real-device strategy. |


---

**Contributions welcome.** Fork it, add an entry in the same seven-part format, open a PR. See [CONTRIBUTING.md](../../../../CONTRIBUTING.md).

[← Back to interview-prep index](README.md)
