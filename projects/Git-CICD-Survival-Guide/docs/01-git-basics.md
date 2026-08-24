# Part A — Git Fundamentals

> Everything here was used to build the two automation projects in this repo. No invented examples.

**Chapters:** [1. First commit](#1-your-first-commit) · [2. Remotes, branches, conflicts](#2-remotes-branches-and-conflicts) · [3. Reading state & ignoring files](#3-reading-state--ignoring-files)

---

## 1. Your first commit

### The mental model

Git has **three places** a file can live. Almost every beginner confusion comes from not knowing which one a file is in.

```
Working directory  →  Staging area  →  Repository  →  Remote
   (your edits)        (git add)      (git commit)    (git push)
```

- **Working directory** — files as they exist on disk right now
- **Staging area** ("index") — the changes you've selected for the *next* commit
- **Repository** — permanent local history
- **Remote** — GitHub

`git status` tells you which bucket everything is in. Read it constantly.

### Setting up a repo from scratch

| macOS / Linux | Windows (PowerShell) |
|---|---|
| `mkdir my-project && cd my-project` | `New-Item -ItemType Directory my-project; Set-Location my-project` |
| `git init` | `git init` |
| `git config user.name "Your Name"` | `git config user.name "Your Name"` |
| `git config user.email "you@example.com"` | `git config user.email "you@example.com"` |

**Expected output of `git init`:**

```
Initialized empty Git repository in /Users/you/my-project/.git/
```

That hidden `.git` folder **is** the repository. Everything else is just files. Delete `.git` and you have an ordinary folder with no history — which is exactly what happened in [Blocker Case 5](02-blocker-cases.md#b-5-the-git-folder-went-missing).

> **Use `--global` when you want the setting everywhere:**
> `git config --global user.name "Your Name"`
> Without `--global`, it applies to the current repo only. Useful when work and personal identities differ.

### Staging and committing

| macOS / Linux | Windows (PowerShell) |
|---|---|
| `git status` | `git status` |
| `git add hello-git.txt` | `git add hello-git.txt` |
| `git add .` | `git add .` |
| `git add -A` | `git add -A` |
| `git commit -m "My first commit"` | `git commit -m "My first commit"` |

**Expected output:**

```
[main (root-commit) a1b2c3d] My first commit
 1 file changed, 9 insertions(+)
 create mode 100644 hello-git.txt
```

`git add .` vs `git add -A`: nearly identical in modern Git. `.` stages from the current directory down; `-A` stages the whole repo regardless of where you're standing. **Both stage more than you might expect** — run `git status` first, every time.

### 🧪 Try it

Use [`sandbox/lesson-01-first-commit/hello-git.txt`](../sandbox/lesson-01-first-commit/) and [`lesson-02-staging/`](../sandbox/lesson-02-staging/). The staging exercise — deliberately staging one file and leaving another — is the one that makes the staging area click.

### 💬 Interview angle

> **"What's the difference between `git add` and `git commit`?"**
>
> `add` moves changes into the staging area — it's how you choose *what* goes into the next commit. `commit` takes a permanent snapshot of exactly what's staged. The separation lets you make five edits and commit them as two logically-separate commits, which keeps history readable.

---

## 2. Remotes, branches, and conflicts

### Connecting to GitHub

The order matters. This is the exact sequence used for this repo:

| Step | macOS / Linux | Windows (PowerShell) |
|---|---|---|
| 1. Link remote | `git remote add origin https://github.com/you/repo.git` | same |
| 2. Name branch | `git branch -M main` | same |
| 3. First push | `git push -u origin main` | same |
| 4. Later pushes | `git push` | same |

**Expected output of the first push:**

```
Enumerating objects: 80, done.
Counting objects: 100% (80/80), done.
Writing objects: 100% (71/71), 120.71 KiB | 120.71 MiB/s, done.
To https://github.com/you/repo.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main'.
```

What the pieces mean:

- **`origin`** — a nickname for the remote URL. Convention, not magic.
- **`-M main`** — force-rename the current branch. Older Git defaults to `master`; GitHub defaults to `main`. Mismatch here caused [Blocker Case 7](02-blocker-cases.md#b-7-local-master-vs-remote-main).
- **`-u`** — "set upstream": links local `main` to `origin/main` permanently, so future pushes are just `git push`.

> **Authentication:** GitHub no longer accepts account passwords. Use a Personal Access Token (Settings → Developer settings), the `gh` CLI, or SSH keys.

### Branching

| Action | macOS / Linux | Windows (PowerShell) |
|---|---|---|
| Create + switch | `git checkout -b feature-x` | same |
| Switch | `git checkout main` | same |
| List all | `git branch -a` | same |
| Delete | `git branch -d feature-x` | same |
| Force delete | `git branch -D feature-x` | same |

`git branch -a` output, annotated:

```
* main                    ← asterisk = where you are now
  remotes/origin/main     ← the remote's copy
```

### Pull: rebase vs merge

This one has real interview value.

| | `git pull` (merge) | `git pull --rebase` |
|---|---|---|
| **History** | Creates a merge commit | Linear — replays your commits on top |
| **Reads like** | "we diverged and reunited" | "I worked after everyone else" |
| **Safe on shared branches?** | Yes | Only if your commits aren't pushed yet |
| **Use when** | Long-lived feature branches | Everyday syncing before a push |

```bash
git pull --rebase origin main
```

**Expected:**

```
From https://github.com/you/repo
 * branch            main       -> FETCH_HEAD
Successfully rebased and updated refs/heads/main.
```

**The rule that prevents most push failures:** pull before you push. Any edit made through GitHub's web UI puts the remote ahead of you, and the next push gets rejected — [Blocker Case 1](02-blocker-cases.md#b-1-push-rejected--fetch-first).

### Conflicts

A conflict happens when two commits change *the same lines* of *the same file*. Git won't guess — it hands you both versions:

```
<<<<<<< HEAD
FAVOURITE_TOOL = Selenium
=======
FAVOURITE_TOOL = Cypress
>>>>>>> branch-b
```

| Marker | Meaning |
|---|---|
| `<<<<<<< HEAD` | Start of *your* version |
| `=======` | Divider |
| `>>>>>>> branch-b` | End of *their* version |

**To resolve:** delete all three markers, leave the content you want, then:

```bash
git add path/to/file
git commit
```

**To bail out entirely:**

| Situation | Command |
|---|---|
| During a merge | `git merge --abort` |
| During a rebase | `git rebase --abort` |

### 🧪 Try it

[`sandbox/lesson-03-merge-conflict/`](../sandbox/lesson-03-merge-conflict/) has step-by-step instructions to create a conflict deliberately. Do it once in a throwaway repo — it's far less alarming the second time.

### 💬 Interview angle

> **"Merge or rebase?"**
>
> Rebase for keeping my own branch current — it avoids merge commits that add no information. Merge when integrating a completed feature, because the merge commit is genuine history worth keeping. The rule I don't break: never rebase commits that are already pushed and shared, since it rewrites hashes other people depend on.

---

## 3. Reading state & ignoring files

### The three diagnostics

Memorise these. They resolve nearly every "what is going on" moment:

| Command | Answers |
|---|---|
| `git status` | What's staged, modified, untracked? |
| `git log --oneline -5` | Which commits do I actually have? |
| `git rev-parse --show-toplevel` | Where does Git think the repo root is? |

That third one is the underrated one. It's how [Blocker Case 5](02-blocker-cases.md#b-5-the-git-folder-went-missing) was diagnosed — it returned the *home directory* instead of the project, revealing the `.git` folder had been moved.

### Inspecting changes

| Goal | macOS / Linux | Windows (PowerShell) |
|---|---|---|
| Unstaged changes | `git diff` | same |
| Staged changes | `git diff --staged` | same |
| Compact status | `git status --short` | same |
| Last 5 commits | `git log --oneline -5` | same |
| Who changed a line | `git blame file.txt` | same |

`git status --short` output decoded:

```
 M README.md                    ← modified, not staged
M  package.json                 ← modified, staged
?? projects/NewProject/         ← untracked
A  newfile.txt                  ← added (staged)
D  oldfile.txt                  ← deleted (staged)
```

Column 1 = staging area. Column 2 = working directory. That's why ` M` and `M ` mean different things.

### Undoing things

| Goal | Command | Destructive? |
|---|---|---|
| Unstage a file | `git restore --staged file.txt` | 🟢 No |
| Discard local edits | `git restore file.txt` | 🔴 **Yes** — edits gone |
| Fix last commit message | `git commit --amend -m "Better message"` | 🟡 Rewrites history |
| Add a file to last commit | `git add f.txt && git commit --amend --no-edit` | 🟡 Rewrites history |
| Undo commit, keep changes | `git reset --soft HEAD~1` | 🟢 No |
| Undo commit, discard changes | `git reset --hard HEAD~1` | 🔴 **Yes** |

> **`--amend` rewrites the previous commit rather than adding a new one.** Fine before pushing. After pushing, it forces everyone else to reconcile. This repo used it legitimately in [Blocker Case 8](02-blocker-cases.md#b-8-gh007--push-would-publish-a-private-email) — to change the author email on an unpushed commit.

### .gitignore

Patterns are matched relative to the `.gitignore` file's location.

| Pattern | Matches |
|---|---|
| `node_modules/` | That directory, anywhere below |
| `*.log` | Any `.log` file |
| `.env` | Exactly that file |
| `!.env.example` | **Un**-ignores this one (negation) |
| `build/*.js` | `.js` files directly in `build/` |
| `**/temp` | `temp` at any depth |

The real `.gitignore` from this repo's root:

```gitignore
# Python
__pycache__/
.venv/

# Node / TypeScript
node_modules/
.features-gen/

# Playwright artifacts
playwright-report/
test-results/

# Secrets -- never commit these
.env
.env.*
!.env.example
```

That last pair is the pattern worth stealing: **ignore the real secrets file, commit a template**. Anyone cloning knows *which* variables to set without ever seeing values.

### ⚠️ .gitignore only applies to untracked files

If a file is already committed, adding it to `.gitignore` does nothing. You must untrack it:

| macOS / Linux | Windows (PowerShell) |
|---|---|
| `git rm --cached .env` | `git rm --cached .env` |
| `git rm -r --cached node_modules` | `git rm -r --cached node_modules` |

`--cached` removes it from Git but **leaves it on disk**. Without that flag you delete the actual file.

> ### 🔒 If you ever commit a real secret
>
> Removing it in a later commit is **not enough** — it stays in history and remains readable forever.
>
> 1. **Revoke and rotate the credential immediately.** This is the only step that truly matters.
> 2. Then, optionally, scrub history with `git filter-repo` or BFG Repo-Cleaner.
>
> Treat anything ever pushed as permanently public. Rotation first, cleanup second.

### 🧪 Try it

[`sandbox/lesson-04-gitignore/`](../sandbox/lesson-04-gitignore/) — create a `secrets.env`, confirm `git status` ignores it, and see the `!` negation keep the template tracked.

### 💬 Interview angle

> **"How do you keep credentials out of a repo?"**
>
> Three layers. `.gitignore` for `.env` files with a committed `.env.example` template. Secrets injected at runtime from environment variables — in CI, from GitHub encrypted secrets. And if one ever does get committed, rotate the credential first; scrubbing history is secondary, because the exposure already happened.

---

**Next:** [Part B — Blocker Cases](02-blocker-cases.md) — nine real failures, verbatim, with fixes.

[← Back to index](README.md)
