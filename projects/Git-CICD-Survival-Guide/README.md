<div align="center">

# Git-CICD-Survival-Guide

**Zero to interview-ready — taught through nine failures that actually happened.**

[![Git](https://img.shields.io/badge/Git-F05032?logo=git&logoColor=white)](https://git-scm.com/)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?logo=githubactions&logoColor=white)](https://docs.github.com/actions)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![No dependencies](https://img.shields.io/badge/dependencies-none-success)](.)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../../LICENSE)

*Part of [**ForkableInterviewToolkit**](../../README.md) — no install, no runtime, just read and practise.*

</div>

---

## ⚡ Quickstart

Nothing to install. Start reading:

```bash
cd projects/Git-CICD-Survival-Guide
open docs/README.md        # macOS   (Windows: start docs\README.md)
```

Want hands-on immediately?

```bash
cat sandbox/lesson-01-first-commit/hello-git.txt
```

---

## 🎯 What makes this different

Most Git tutorials show the happy path. This one is built around **nine real failures** from creating the Python and TypeScript projects in this repo — verbatim error messages, actual diagnosis, actual fixes.

Knowing `git push` isn't the skill. Knowing what to do when it says `! [rejected] main -> main (fetch first)` is.

> **The finding that surprised me:** eight of the nine failures had nothing to do with Git. They were shell syntax, a full disk, and defaults that changed after habits formed. *"CI is broken"* almost always means *"the environment differs from my laptop"* — and telling those apart is what interviews actually test.

---

## 📚 Contents

| Part | Chapter | Covers |
|---|---|---|
| **A** | [Git Fundamentals](docs/01-git-basics.md) | init · add · commit · branch · merge · rebase · `.gitignore` |
| **B** | [Blocker Cases](docs/02-blocker-cases.md) | 9 real failures with verbatim errors and fixes |
| **C** | [CI/CD Fundamentals](docs/03-cicd-fundamentals.md) | Workflows · path filtering · caching · matrix · artifacts · secrets |
| **D** | [The Wider Ecosystem](docs/04-ecosystem.md) | Docker · Maven · Jenkins · registries · GitOps |
| **E** | [Repo Craft](docs/05-repo-craft.md) | Topics · About · releases · Discussions · presentation |
| — | [Glossary](docs/06-glossary.md) | ~90 terms, one line each |

Every CI/CD example is taken from the **live workflows in this repository** — not invented.

---

## 🗂 Layout

```
Git-CICD-Survival-Guide/
├── docs/
│   ├── README.md                    # index + learning paths
│   ├── 00-how-to-use.md
│   ├── 01-git-basics.md             # Part A
│   ├── 02-blocker-cases.md          # Part B  ← the heart of it
│   ├── 03-cicd-fundamentals.md      # Part C
│   ├── 04-ecosystem.md              # Part D
│   ├── 05-repo-craft.md             # Part E
│   └── 06-glossary.md
└── sandbox/
    ├── lesson-01-first-commit/      # add → commit → push
    ├── lesson-02-staging/           # staged vs unstaged
    ├── lesson-03-merge-conflict/    # create and resolve a conflict
    ├── lesson-04-gitignore/         # ignore patterns, secret templates
    └── blocker-cases/               # reproduce Part B failures safely
```

---

## 🧪 The sandbox

Tiny throwaway files — no Python, no TypeScript, no dependencies. Break them freely:

```bash
git checkout -- sandbox/
```

[`sandbox/blocker-cases/`](sandbox/blocker-cases/) reproduces the Part B failures deliberately.

> ⚠️ **Read [`blocker-cases/README.md`](sandbox/blocker-cases/README.md) first.** Some cases are destructive by design and must run in a throwaway repo. `broken-commands.sh` is **reference material** — it exits immediately if executed.

---

## 🖥 Every command, both platforms

| macOS / Linux | Windows (PowerShell) |
|---|---|
| `rm -rf node_modules` | `Remove-Item -Recurse -Force node_modules` |
| `source .venv/bin/activate` | `.venv\Scripts\Activate.ps1` |
| `export BASE_URL=https://x.com` | `$env:BASE_URL="https://x.com"` |
| `df -h /System/Volumes/Data` | `Get-PSDrive C` |

Expected output is shown after commands so you can confirm you got it right.

---

## 🗺 Learning paths

| Path | Route | Time |
|---|---|---|
| 🌱 **Complete beginner** | A → B → C, every 🧪 exercise | ~6h |
| 🔧 **Know Git, weak on CI** | Skim A · read B · then C, D | ~4h |
| ⏱ **Interview in 3 days** | All 💬 angles → Glossary → Part B | ~2h |

---

## 💬 Interview readiness

Every chapter ends with **💬 Interview angles** — the same content phrased as you'd say it out loud:

> **"Your push was rejected. What now?"**
>
> A rejection means the remote has commits I don't. I pull with `--rebase` to replay my work on top, resolve any conflict, then push. I don't reach for `--force` — that discards someone else's commits.

---

<div align="center">

**Break things here so you don't break them at 1am.** 🔧

[Root README](../../README.md) · [Python project](../Python-Playwright-Automation/) · [TypeScript project](../TypeScript-Playwright-Automation/)

</div>
