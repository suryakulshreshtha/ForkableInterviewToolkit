# Part E — Repo Craft

Everything in Parts A–D makes a repo *work*. This chapter makes it **get found and taken seriously**.

For a QA/SDET candidate this isn't vanity. A recruiter spends maybe forty seconds on your GitHub. A clear About line, a green CI badge, and a README that opens with what the thing *is* will outperform better code with worse presentation — every time.

---

## 1. The About panel

Top-right of the repo page, ⚙️ gear icon. Three fields, all high-leverage.

### Description

**350 character limit.** Front-load the concrete nouns — this text is indexed by GitHub search *and* crawled by Google.

| ❌ Weak | ✅ Strong |
|---|---|
| "My interview prep repo" | "Interview prep + runnable proof for QA/SDET roles. Python + Playwright + Pytest and TypeScript + Playwright Test. 56 interview entries paired with real Page Object Model frameworks, API tests, BDD, load testing, and CI." |

The weak version tells a reader nothing searchable. The strong version contains a dozen terms people actually search for.

### Website

Point at live docs if you have them (GitHub Pages), otherwise leave blank. **An empty field beats a broken link.**

### Topics — GitHub's hashtags

**Up to 20. Lowercase, hyphens, no spaces.** This is the single highest-leverage setting on the whole page.

Why: topics power `github.com/topics/playwright`-style browse pages, feed GitHub's search ranking, and get indexed externally.

A good set for this repo:

```
python  playwright  playwright-python  pytest  qa-automation
test-automation  sdet  interview-preparation  interview-questions
e2e-testing  api-testing  bdd  pytest-bdd  locust  load-testing
page-object-model  github-actions  ci-cd  automation-framework
typescript
```

**How to choose 20:**

| Category | Examples | How many |
|---|---|---|
| Language | `python`, `typescript` | 2–3 |
| Framework | `playwright`, `pytest` | 3–4 |
| Domain | `qa-automation`, `sdet` | 3–4 |
| Technique | `page-object-model`, `bdd` | 3–4 |
| Infra | `github-actions`, `ci-cd` | 2–3 |
| Intent | `interview-preparation` | 1–2 |

Prefer terms **people search for** over terms that merely describe you. `qa-automation` beats `my-learning-journey`.

---

## 2. README structure

Readers scan in a predictable order. Match it:

```markdown
# Project Name
> One-line hook — what this is, for whom

[badges: build · license · language]

## Quickstart          ← MUST be near the top
## What's inside
## Layout
## Design decisions    ← where you demonstrate judgement
## Contributing
```

### The rules that matter

| Rule | Why |
|---|---|
| **Quickstart above the fold** | If someone can't run it in 30 seconds, they leave |
| **Badges immediately after the title** | Instant credibility signal |
| **Tables over paragraphs** | Scannable |
| **Say *why*, not just *what*** | "Selectors live in one file so markup changes are a one-file fix" shows judgement; "uses POM" doesn't |
| **Link, don't inline** | Deep detail belongs in `docs/` |

### Badges

```markdown
[![Python](https://github.com/you/repo/actions/workflows/python.yml/badge.svg)](../../actions/workflows/python.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev/)
```

A **green CI badge is the strongest single signal** a repo can carry — it proves the code runs, not just that it exists. Which is also why you shouldn't advertise a repo until CI is green.

### Social preview image

Settings → General → Social preview. **1280×640, under 1 MB.**

Controls what renders when the link is shared on LinkedIn, Slack, or X. Without one you get a grey box and your avatar; with one, the link looks like a real project.

---

## 3. Releases and versioning

A tagged release turns "some code on the internet" into "a maintained project."

### Semantic versioning

```
MAJOR.MINOR.PATCH   →   2.1.3
```

| Bump | When | Example |
|---|---|---|
| **MAJOR** | Breaking change | Restructured folders — `1.0.0` → `2.0.0` |
| **MINOR** | New feature, backwards compatible | Added a project — `2.0.0` → `2.1.0` |
| **PATCH** | Bug fix | Fixed a broken selector — `2.1.0` → `2.1.1` |

For a docs/learning repo, treat "breaking" as *"a reader's existing links or workflow break."*

### Creating one

**Via UI:** Releases → *Draft a new release* → create tag → target `main` → write notes → Publish

**Via CLI:**

| macOS / Linux | Windows (PowerShell) |
|---|---|
| `git tag -a v2.0.0 -m "Multi-stack release"` | same |
| `git push origin v2.0.0` | same |
| `git tag -l` | same |
| `git tag -d v2.0.0` | same |
| `git push --delete origin v2.0.0` | same |

### Release notes template

```markdown
## What's new
- Added TypeScript-Playwright-Automation project
- 29 new interview entries

## Breaking changes
- Docs moved from `docs/` to `projects/*/docs/`

## Fixes
- Corrected `toHaveURL` assertion for the Python binding
```

**Why it's worth five minutes:** releases get their own GitHub search surface, generate an RSS feed, and signal active maintenance. An unversioned repo reads as abandoned even when it isn't.

---

## 4. Discussions

Issues are for *"something is wrong."* Discussions are for *"let's talk."* For a learning repo, Discussions is the better fit.

### Enabling

Settings → General → Features → ✅ **Discussions** → *Set up discussions*

### Categories

| Category | Format | Use for |
|---|---|---|
| 📣 Announcements | Maintainer-only | New releases |
| 💡 Ideas | Open thread | "Add a Java project?" |
| 🙏 Q&A | Answerable | "Why does this test fail?" |
| 🗣 General | Open thread | Everything else |
| 🎉 Show and tell | Open thread | "I forked this and added X" |

**Q&A is the valuable one** — answers can be marked as accepted, so the thread becomes a searchable knowledge base rather than a repeated conversation.

### Issues vs Discussions

| | Issue | Discussion |
|---|---|---|
| Has a definite end | ✅ Closed when fixed | ❌ Ongoing |
| Assignable | ✅ | ❌ |
| Best for | Bugs, tasks | Questions, ideas |
| Example here | "Selector broke after site update" | "Should we add a Java project?" |

Keep both enabled. Route accordingly.

---

## 5. Files that build trust

| File | Effort | Value |
|---|---|---|
| `README.md` | High | 🔴 Essential |
| `LICENSE` | 1 min | 🔴 Essential — **no license = nobody may legally reuse it** |
| `.gitignore` | 5 min | 🔴 Essential |
| `CONTRIBUTING.md` | 20 min | 🟠 High for public repos |
| `CODE_OF_CONDUCT.md` | 2 min | 🟡 GitHub generates one |
| Issue templates | 15 min | 🟡 Nice — reduces low-quality reports |
| `SECURITY.md` | 10 min | 🟢 Only if handling sensitive code |

**Pick a license deliberately:**

| License | Means |
|---|---|
| **MIT** | Do anything, keep the notice. Best default for portfolio work |
| Apache 2.0 | MIT + explicit patent grant |
| GPL-3.0 | Derivatives must also be open source |
| None | ⚠️ Default copyright — **nobody may legally reuse it** |

Check your repo's health at **Insights → Community Standards** — GitHub literally scores this.

---

## 6. Profile-level presentation

| Action | Effect |
|---|---|
| **Pin up to 6 repos** | Profile → Customize pins. Your storefront |
| **Profile README** | Create a repo named exactly your username |
| **Cross-link your repos** | Internal links help all of them rank |
| **Consistent naming** | A visible convention reads as intentional |

Cross-linking is underrated. A "Related repos" section in each README creates a link graph that improves discoverability for the whole set.

---

## 7. Launch checklist

Before you share a repo anywhere:

**Must:**
- [ ] CI is green
- [ ] README opens with a working quickstart
- [ ] Description filled in
- [ ] 10–20 topics added
- [ ] LICENSE present
- [ ] No secrets in history (`git log -p | grep -i "password\|token"`)

**Should:**
- [ ] Social preview uploaded
- [ ] Tagged release
- [ ] Repo pinned to profile
- [ ] CONTRIBUTING.md

**Nice:**
- [ ] Discussions enabled
- [ ] Issue templates
- [ ] Code of Conduct
- [ ] Cross-links to your other repos

---

## 💬 Interview angles

> **"How do you make a project approachable to a new team member?"**
>
> README that opens with a working quickstart — clone to running in under five minutes. Then structure that explains itself: predictable folder names, a CONTRIBUTING file with conventions, and documented *reasoning* rather than just description. I write "selectors live in one file so a markup change is a one-file fix" instead of "uses Page Object Model," because the reasoning is what transfers.

> **"What makes a good commit message?"**
>
> Imperative mood, present tense — "Add TypeScript project," not "Added." A concise subject line, and a body explaining *why* when it isn't obvious. History is documentation; six months later `git log` should let someone reconstruct not just what changed but the reasoning behind it.

---

**Next:** [Glossary](06-glossary.md)

[← Back to index](README.md)
