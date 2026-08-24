# How to Use This Guide

## Who it's for

Anyone who can open a terminal but freezes when Git says something unexpected. By the end you should be able to run a repo end-to-end, recover from the common disasters, and discuss CI/CD credibly in an interview.

**Zero assumptions.** If you've never run `git init`, start at Part A.

## What makes it different

Most Git tutorials show the happy path. This one is built around **nine failures that actually happened** while creating the two automation projects in this repository — verbatim error messages, real diagnosis, real fixes.

That's deliberate. Knowing `git push` isn't the skill. Knowing what to do when it says `! [rejected] main -> main (fetch first)` is.

## Structure

| Part | Content | Time |
|---|---|---|
| [A — Git Fundamentals](01-git-basics.md) | init, add, commit, branch, merge, ignore | 2h |
| [B — Blocker Cases](02-blocker-cases.md) | 9 real failures + fixes | 1.5h |
| [C — CI/CD Fundamentals](03-cicd-fundamentals.md) | Workflows, caching, matrix, secrets | 2h |
| [D — Ecosystem](04-ecosystem.md) | Docker, Maven, Jenkins, registries | 1.5h |
| [E — Repo Craft](05-repo-craft.md) | Topics, releases, discussions, presentation | 1h |
| [Glossary](06-glossary.md) | Every term, one line each | Reference |

## Conventions

### Two-column command tables

Every command is given for both platforms:

| macOS / Linux | Windows (PowerShell) |
|---|---|
| `rm -rf node_modules` | `Remove-Item -Recurse -Force node_modules` |

### Expected output

Shown after commands so you can confirm you got it right:

```
Initialized empty Git repository in /Users/you/my-project/.git/
```

### Danger markers

| | Meaning |
|---|---|
| 🟢 | Safe |
| 🟡 | Can cause confusion |
| 🔴 | Destructive — read fully first |

### Callouts

- 🧪 **Try it** — hands-on exercise in `sandbox/`
- 💬 **Interview angle** — how to say it out loud

## The sandbox

[`sandbox/`](../sandbox/) holds tiny throwaway files. Break them freely:

```
git checkout -- sandbox/
```

[`sandbox/blocker-cases/`](../sandbox/blocker-cases/) reproduces the Part B failures deliberately. **Read its README first** — some are destructive by design and must be run in a throwaway repo.

## Suggested paths

**Complete beginner:** A → B → C, doing every 🧪 exercise. Skim D and E.

**Know Git, weak on CI:** Skim A, read B (the failures still bite experienced users), then C and D properly.

**Interview in 3 days:** Every 💬 Interview angle, then the [Glossary](06-glossary.md), then Part B — war stories are what interviewers remember.

## Honesty note

The failures here are real, including ones caused by bad advice given at the time. That's the point: **most Git pain isn't Git.** It's shell syntax, disk space, and defaults that changed after your habits formed. Recognising which is which is the actual skill.

[← Back to index](README.md)
