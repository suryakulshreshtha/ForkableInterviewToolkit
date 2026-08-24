# Git & CI/CD — Documentation Index

Zero to interview-ready. Built around real failures, not the happy path.

---

## Chapters

| # | Chapter | Covers | Time |
|---|---|---|---|
| 0 | [How to use this guide](00-how-to-use.md) | Conventions, learning paths | 5 min |
| A | [**Git Fundamentals**](01-git-basics.md) | init · add · commit · branch · merge · rebase · ignore | 2h |
| B | [**Blocker Cases**](02-blocker-cases.md) | 9 real failures, verbatim errors, fixes | 1.5h |
| C | [**CI/CD Fundamentals**](03-cicd-fundamentals.md) | Workflows · path filtering · caching · matrix · artifacts · secrets | 2h |
| D | [**The Wider Ecosystem**](04-ecosystem.md) | Docker · Maven · Jenkins · registries · GitOps | 1.5h |
| E | [**Repo Craft**](05-repo-craft.md) | Topics · About · releases · Discussions · presentation | 1h |
| — | [Glossary](06-glossary.md) | ~90 terms, one line each | Reference |

---

## The nine blocker cases

Part B is the heart of this guide. Every error below actually happened:

| # | Error | Cause |
|---|---|---|
| B-1 | `! [rejected] main -> main (fetch first)` | Remote ahead after a web-UI edit |
| B-2 | `zsh: command not found: #` | Inline comments in interactive zsh |
| B-3 | `cd: too many arguments` | Same cause — but commands then ran in the wrong directory |
| B-4 | `zsh: parse error near '\n'` | `<PLACEHOLDER>` typed literally |
| B-5 | Repo points at your home folder | A bad recursive copy relocated `.git` |
| B-6 | `could not lock config file .git/config` | Disk full |
| B-7 | `On branch master` vs `origin/main` | Default branch-name drift |
| B-8 | `GH007: would publish a private email` | Email privacy protection |
| B-9 | `dangling blob ...` | Harmless leftovers — how to tell |

**Eight of nine had nothing to do with Git being hard.** They were shell syntax, environment, and configuration. That distinction is the real lesson.

---

## Learning paths

<table>
<tr><td width="33%" valign="top">

### 🌱 Complete beginner
A → B → C in order.
Do every 🧪 exercise.
Skim D and E.

**~6 hours**

</td><td width="33%" valign="top">

### 🔧 Know Git, weak on CI
Skim A. Read B properly —
these still bite veterans.
Then C and D.

**~4 hours**

</td><td width="33%" valign="top">

### ⏱ Interview in 3 days
Every 💬 Interview angle.
Then the Glossary.
Then Part B for war stories.

**~2 hours**

</td></tr>
</table>

---

## Hands-on

[`../sandbox/`](../sandbox/) — throwaway files, safe to break:

```bash
git checkout -- sandbox/     # reset anything
```

[`../sandbox/blocker-cases/`](../sandbox/blocker-cases/) — reproduce the Part B failures on purpose. **Read its README first**; some are destructive by design.

---

[← Back to project README](../README.md)
