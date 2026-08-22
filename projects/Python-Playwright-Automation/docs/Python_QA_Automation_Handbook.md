# Python + Playwright QA Automation Handbook

A single-file, condensed quick-reference. For the full seven-part interview-prep entries (Direct Answer → STAR → Interview-Ready Answer → Code, etc.), see [`interview-prep/`](interview-prep/) — this handbook is the skim-before-you-walk-in version.

---

## 📑 Quick Navigation Index

- [Roles & Responsibilities](#-roles--responsibilities)
- [Python Core Concepts](#-python-core-concepts)
  - [Exception Handling](#exception-handling)
  - [Method Resolution Order](#method-resolution-order-mro)
  - [Decorators](#decorators)
  - [Idioms](#idioms)
  - [Dependency Management](#dependency-management)
- [Playwright Concepts](#-playwright-concepts)
  - [Fixtures](#fixtures)
  - [Auto-Waiting vs Selenium](#auto-waiting-vs-selenium)
  - [Dialog Handling](#dialog-handling)
  - [Locator Strategies](#locator-strategies)
  - [Parallel Execution](#parallel-execution)
- [CI/CD Integration](#-cicd-integration)
- [QA Process & Strategy](#-qa-process--strategy)
- [Key Takeaways](#-key-takeaways)

---

## 🧑‍💻 Roles & Responsibilities

Automation Engineers own the testing lifecycle end-to-end: requirement analysis, test design, automation, defect management, and release validation. Senior QAs extend this with framework maintenance, CI/CD pipeline ownership, code reviews, mentoring juniors, and test strategy contributions.

👉 **Interview emphasis:** ownership language (framework, CI/CD, mentoring) rather than just execution.

---

## 🐍 Python Core Concepts

### Exception Handling

- Python has no "checked exceptions."
- Best practice: catch specific exceptions (`FileNotFoundError`, `TimeoutError`) and fail tests with actionable messages.

### Method Resolution Order (MRO)

- Python resolves method calls at runtime via MRO.
- Supports duck typing and natural overriding.
- Abstract Base Classes enforce required methods.

### Decorators

- Pytest relies heavily on decorators (`@pytest.fixture`, `@pytest.mark.parametrize`).
- Custom decorators (e.g., retry wrappers) add resilience to flaky actions.

### Idioms

- Comprehensions: concise data transforms.
- Context managers (`with`): guaranteed cleanup of browsers, files, DB connections.

### Dependency Management

- Use `venv` or Poetry.
- Pin dependencies in `requirements.txt` or `poetry.lock`.
- Always run `playwright install` to fetch browser binaries.

---

## 🎭 Playwright Concepts

### Fixtures

- Built-in pytest fixtures: `page`, `context`, `browser`.
- Custom fixtures for app URLs, authenticated sessions, Page Objects, API clients.

### Auto-Waiting vs Selenium

- Playwright auto-waits with web-first assertions.
- Reduces boilerplate compared to Selenium's explicit waits.

### Dialog Handling

- Event-driven: `page.on("dialog", handler)` → `dialog.accept()` or `dialog.dismiss()`.

### Locator Strategies

- Prefer accessibility-first locators (`get_by_role`, `get_by_label`, `get_by_text`).
- Use CSS/XPath only as fallback.

### Parallel Execution

- Use `pytest-xdist` or Playwright workers.
- Authentication state reuse (`storage_state`) improves speed.

---

## ⚙️ CI/CD Integration

- Integrate automation suites into GitHub Actions or Jenkins.
- Path-filtered workflows per project.
- Pin dependencies and upload artifacts (logs, reports, docs).
- Run functional tests only — no load/stress against practice sites.

---

## 📊 QA Process & Strategy

- Lifecycle coverage: Requirement analysis → Test design → Automation → Defect reporting → Regression → Release validation.
- Framework design principles: Page Object Model (POM), data-driven testing with Pytest.
- Collaboration: Code reviews, mentoring, and risk summaries for stakeholders.

---

## ✅ Key Takeaways

- Python + Playwright = modern, concise, resilient automation stack.
- Emphasize framework ownership and CI/CD integration in interviews.
- Use topic-based mastery: exceptions, decorators, fixtures, locators, CI/CD.
- Always align automation practices with responsible use policies.
