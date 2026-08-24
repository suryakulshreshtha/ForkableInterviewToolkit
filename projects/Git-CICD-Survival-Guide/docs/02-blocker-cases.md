# Part B — Blocker Cases

Nine failures that genuinely happened while building the Python and TypeScript projects in this repo. **Every error message is verbatim.** Paths and usernames are sanitised to `/Users/you/...`; nothing else is edited.

Reproduce them safely in [`sandbox/blocker-cases/`](../sandbox/blocker-cases/).

| # | Error | Root cause | Danger |
|---|---|---|---|
| [B-1](#b-1-push-rejected--fetch-first) | `! [rejected] main -> main (fetch first)` | Remote ahead of local | 🟢 |
| [B-2](#b-2-zsh-command-not-found-) | `zsh: command not found: #` | Shell syntax | 🟢 |
| [B-3](#b-3-cd-too-many-arguments) | `cd: too many arguments` | Shell syntax | 🟡 |
| [B-4](#b-4-parse-error-near-n) | `zsh: parse error near '\n'` | Placeholder typed literally | 🟢 |
| [B-5](#b-5-the-git-folder-went-missing) | Repo points at your home folder | Bad recursive copy | 🔴 |
| [B-6](#b-6-no-space-left-on-device) | `could not lock config file .git/config` | Disk full | 🔴 |
| [B-7](#b-7-local-master-vs-remote-main) | `On branch master` | Branch-name default drift | 🟢 |
| [B-8](#b-8-gh007--push-would-publish-a-private-email) | `GH007` | Email privacy setting | 🟢 |
| [B-9](#b-9-dangling-blobs-from-git-fsck) | `dangling blob ...` | Interrupted operations | 🟢 |

---

## B-1: Push rejected — "fetch first"

### What happened

```
To https://github.com/you/repo.git
 ! [rejected]        main -> main (fetch first)
error: failed to push some refs to 'https://github.com/you/repo.git'
hint: Updates were rejected because the remote contains work that you do not
hint: have locally. This is usually caused by another repository pushing to
hint: the same ref. If you want to integrate the remote changes, use
hint: 'git pull' before pushing again.
```

### Why

A file had been deleted through **GitHub's web interface**. That created a commit on the remote that the local clone had never seen. Git refuses to overwrite history it doesn't understand — this is a safety feature, not a bug.

This happened **twice** in one session, both times after a web-UI edit.

### Fix

```bash
git pull --rebase origin main
git push
```

### Prevention

| Habit | Command |
|---|---|
| Before starting local work | `git pull --rebase` |
| Check without changing anything | `git fetch && git status` |
| Pick one editing surface | Either web UI or local — mixing them causes this |

### 💬 Interview angle

> **"Your push was rejected. What now?"**
>
> A rejection means the remote has commits I don't. I pull with `--rebase` to replay my work on top, resolve any conflict, then push. I don't reach for `--force` — that discards someone else's commits. The only time force is acceptable is on a branch I own exclusively, and then `--force-with-lease`, which refuses if the remote moved unexpectedly.

---

## B-2: `zsh: command not found: #`

### What happened

Copy-pasting a documented command block produced:

```
zsh: command not found: #
zsh: missing end of string
zsh: unknown sort specifier
fatal: pathspec '#' did not match any files
```

### Why

The commands had inline comments:

```bash
git add -A              # stages everything
```

Bash tolerates this. **Interactive zsh does not** — `interactive_comments` is off by default, so `#` is treated as a command and the rest as arguments. `git add -A # stages everything` tried to stage files literally named `#`, `stages`, and `everything`.

macOS has defaulted to zsh since Catalina, so this hits Mac users constantly.

### Fix

Enable it permanently:

```bash
echo 'setopt interactive_comments' >> ~/.zshrc
source ~/.zshrc
```

Or put comments on their own line.

### 💬 Interview angle

> **"A CI script works locally but fails on the runner. Where do you look first?"**
>
> Shell differences. My Mac runs zsh interactively; the runner is almost certainly bash in non-interactive mode. Different comment handling, different `set -e` behaviour, different glob expansion. That's why CI scripts should be explicit — pin the shebang, avoid interactive-only syntax.

---

## B-3: `cd: too many arguments`

### What happened

```
cd: too many arguments
```

Same root cause as B-2 — a trailing comment:

```bash
cd MyRepo               # your local clone
```

zsh parsed this as `cd` with **two** arguments.

### Why it's more dangerous than B-2

**The `cd` failed, but the rest of the pasted block kept running** — in whatever directory the terminal happened to be in. Commands executed somewhere entirely unintended, silently.

A later variant of this had `pytest framework/tests` running from the repo root instead of the project folder:

```
ERROR: file or directory not found: framework/tests
```

Harmless there. Combined with a recursive file operation, it wasn't — see B-5.

### Fix

```bash
cd MyRepo
pwd
```

**Always confirm with `pwd` after a `cd` that matters.**

### 💬 Interview angle

> **"A pipeline step ran in the wrong directory. How do you prevent it?"**
>
> Never rely on implicit working directory. In GitHub Actions I set `defaults.run.working-directory` explicitly per job — both projects in this repo do that. In scripts, `cd` with `&&` chaining so a failed `cd` aborts the chain instead of letting the next command run somewhere unexpected.

---

## B-4: `parse error near '\n'`

### What happened

```
zsh: parse error near `\n'
```

From running:

```bash
cd <CLONE>
```

### Why

`<CLONE>` was documentation shorthand for *"substitute your real path here."* But `<` and `>` are **shell redirection operators**. zsh tried to parse a redirect and hit end-of-line.

### Fix

Use a variable — set the path once, reuse it safely:

```bash
CLONE=/Users/you/Desktop/repos/MyRepo
echo "$CLONE"
cd "$CLONE"
```

`$CLONE` (dollar sign) *uses* the variable. `<CLONE>` was never valid syntax.

> **Always quote paths:** `cd "$CLONE"` survives spaces in folder names; `cd $CLONE` doesn't.

### Convention guide

| You see | It means |
|---|---|
| `<PLACEHOLDER>` | Replace, including the brackets |
| `$VARIABLE` | Real syntax — uses a variable's value |
| `${VARIABLE}` | Same, with explicit boundaries |
| `$(command)` | Substitute the command's *output* |

That last one is genuinely useful:

```bash
cd "$(git rev-parse --show-toplevel)"
```

Jumps to the repo root from any subfolder.

---

## B-5: The `.git` folder went missing

> 🔴 **The most destructive case here.** Read before reproducing.

### What happened

A recursive copy reported:

```
rsync(54857): warning: child 54858 exited with status 23
total size is 0  speedup is 0.00
```

Status 23 = *partial transfer due to error*. Then everything broke:

```
$ git rev-parse --show-toplevel
/Users/you                          ← should be the project folder!

$ ls -la .git
ls: .git: No such file or directory

$ git status
On branch master
Untracked files:
        ../../../.ssh/
        ../../../.zsh_history
        ../../../Documents/
        ../../../Library/
```

### Why

The `.git` folder had been **relocated to the home directory**. With no `.git` in the project, Git searched *upward*, found one at `~`, and treated the entire home directory as a repository.

**This was one `git add -A` away from staging SSH keys and shell history into a public repo.**

The underlying trigger was almost certainly B-6 — a full disk causing the copy to fail mid-operation.

### Diagnosis

```bash
git rev-parse --show-toplevel
```

If that prints anything other than your project folder, stop immediately.

```bash
ls -la .git          # is it there?
cat ~/.git/config    # is there a stray repo at home?
```

Reading `~/.git/config` confirmed it — the remote URL matched the project.

### Fix

```bash
mv ~/.git /Users/you/Desktop/repos/MyRepo/.git
cd /Users/you/Desktop/repos/MyRepo
git rev-parse --show-toplevel     # verify
ls -la ~/.git                     # must be "No such file or directory"
```

Then verify integrity:

```bash
git fsck --no-progress
```

### Prevention

| Do | Don't |
|---|---|
| `cp` specific files/folders | Recursive sync over a repo root |
| Check disk space before bulk operations | Assume a copy succeeded |
| Read exit codes | Ignore "status 23" warnings |

Even `--exclude='.git'` didn't save it here, because the *destination* path was wrong.

### 💬 Interview angle

> **"Git is behaving strangely. Walk me through diagnosing it."**
>
> First `git rev-parse --show-toplevel` — if the root isn't where I expect, nothing else matters. Then `ls -la .git` to confirm the repo exists, and `git status` to see state. I hit exactly this: a bad copy relocated `.git` to my home directory, so Git treated my whole home folder as the repo. `--show-toplevel` caught it in one command.

---

## B-6: `No space left on device`

> 🔴 **Do not simulate.** Filling a disk risks real data corruption.

### What happened

```
error: could not lock config file .git/config: No space left on device
error: unable to write upstream branch configuration
```

Git couldn't write a **file measured in bytes**.

### The misleading diagnostic

```
$ df -h /
Filesystem      Size   Used  Avail Capacity
/dev/disk3s1s1  460Gi   12Gi  117Mi   100%
```

12 GB used on a 460 GB disk, but 100% full? Those numbers describe **different things**.

On modern macOS, `/` is the **read-only system volume**. Your actual data lives elsewhere:

```bash
df -h /System/Volumes/Data
```

That's the number that matters — a genuinely common misreading.

### The usual hidden culprit

**APFS local snapshots** (Time Machine) can silently consume hundreds of gigabytes, invisible in Finder:

```bash
tmutil listlocalsnapshots /
tmutil deletelocalsnapshots /
```

### Platform commands

| Task | macOS | Windows (PowerShell) |
|---|---|---|
| Check space | `df -h /System/Volumes/Data` | `Get-PSDrive C` |
| Largest folders | `du -sh ~/* \| sort -h \| tail` | `Get-ChildItem $HOME \| % { ... }` |
| Clear npm cache | `npm cache clean --force` | same |
| Delete node_modules | `rm -rf node_modules` | `Remove-Item -Recurse -Force node_modules` |

### The dev-specific hogs

| Directory | Typical size | Safe to delete? |
|---|---|---|
| `node_modules/` | 400–600 MB **each** | ✅ `npm ci` rebuilds |
| `.venv/` | 100–300 MB each | ✅ `pip install -r` rebuilds |
| `~/Library/Caches/ms-playwright` | ~1 GB | ✅ `playwright install` re-fetches |
| `~/.npm/_cacache` | 1–5 GB | ✅ `npm cache clean --force` |

All regenerable. Deleting them is free space at the cost of one reinstall.

### 💬 Interview angle

> **"CI fails intermittently with weird I/O errors. Where do you look?"**
>
> Disk space on the runner. Self-hosted runners accumulate Docker layers, caches, and workspaces until writes fail — and the errors look like anything but a full disk. I add a `df -h` step and a cleanup step. I hit the local version of this: Git couldn't write a few-byte config file, which is a very confusing error until you check capacity.

---

## B-7: Local `master` vs remote `main`

### What happened

```
$ git branch -a
* master
  remotes/origin/main
```

Local branch `master`; remote branch `main`. Push and pull behaved unpredictably.

### Why

Git's historical default branch is `master`. GitHub's default since 2020 is `main`. If a repo is created locally with older Git and pushed to a GitHub repo created via the web, the names diverge.

### Diagnosis

```bash
git log --oneline -3
```

```
1fad573 (HEAD -> master, origin/main) Fix regex assertion
```

Both names on the **same commit** — a pure naming mismatch, no divergence. Best case.

### Fix

```bash
git branch -m master main
git branch --set-upstream-to=origin/main main
git status
```

Expected:

```
branch 'main' set up to track 'origin/main'.
```

### Prevention

```bash
git config --global init.defaultBranch main
```

### If they *had* diverged

| Situation | Command |
|---|---|
| Local has commits remote doesn't | `git push origin master:main` |
| Remote has commits local doesn't | `git pull --rebase origin main` |
| Both diverged | Rebase, resolve, then push |

---

## B-8: GH007 — push would publish a private email

### What happened

```
remote: error: GH007: Your push would publish a private email address.
remote: You can make your email public or disable this protection by visiting:
remote: https://github.com/settings/emails
 ! [remote rejected] main -> main (push declined due to email privacy restrictions)
```

### Why

Commits are stamped with `user.email`. GitHub's "Keep my email address private" setting was on, and the commit carried a real address — so GitHub **blocked the push to protect it**. Worth keeping enabled.

### Fix

1. Get your noreply address from `https://github.com/settings/emails`:

```
1234567+username@users.noreply.github.com
```

2. Configure and amend:

```bash
git config --global user.email "1234567+username@users.noreply.github.com"
git commit --amend --reset-author --no-edit
git push
```

| Flag | Effect |
|---|---|
| `--amend` | Rewrite the last commit |
| `--reset-author` | Apply the *new* name/email |
| `--no-edit` | Keep the existing message |

### ⚠️ Already-pushed commits

Earlier commits keep the real email. Scrubbing them means rewriting history (`git filter-repo`), which changes every commit hash after that point. Weigh it: a noreply address going forward is usually enough.

### 💬 Interview angle

> **"How do you avoid leaking personal data through commits?"**
>
> Set `user.email` to GitHub's noreply address globally, and enable email privacy so pushes are blocked if I forget. Commit metadata is public forever in a public repo — name, email, and timestamps included. Same reasoning as never committing `.env`.

---

## B-9: Dangling blobs from `git fsck`

### What happened

After the earlier chaos, an integrity check produced hundreds of lines:

```
dangling blob a8ff5e3cc74ea4a4f4d898de78e4427cb472855b
dangling blob a9ff445bbf882c6dce707e856a0194a116061f4b
dangling blob aaff701ebeaddb8f57b2e98a0ed492edb0d7e32a
...
```

### Why — and why it's fine

**`dangling` means harmless.** These are objects Git created (during interrupted commits, amends, or resets) that nothing currently references. They're garbage awaiting collection, not damage.

### The words that would matter

| `git fsck` output | Meaning | Action |
|---|---|---|
| `dangling blob/commit/tree` | 🟢 Unreferenced leftovers | None — normal |
| `missing blob/tree` | 🔴 Referenced object is gone | Re-clone |
| `broken link` | 🔴 Corruption | Re-clone |
| `invalid sha1` | 🔴 Corruption | Re-clone |

Only `missing`, `broken`, `corrupt`, or `invalid` warrant concern.

### Cleanup

```bash
git gc --prune=now
```

> **Dangling objects are also a recovery tool.** Deleted a commit with `reset --hard`? It's probably still dangling. `git reflog` finds it, `git checkout <hash>` retrieves it. Git rarely destroys anything immediately — it just stops referencing it.

### 💬 Interview angle

> **"How do you know a repo isn't corrupted?"**
>
> `git fsck`. I read the output carefully, because `dangling` looks alarming but is completely normal — it's unreferenced objects from amends and resets. Only `missing`, `broken`, or `invalid` indicate real corruption, and the fix is usually a fresh clone since the remote holds the authoritative copy.

---

## The meta-lesson

Eight of nine had **nothing to do with Git being difficult**:

| Category | Cases | Real cause |
|---|---|---|
| Shell syntax | B-2, B-3, B-4 | zsh ≠ the docs you copied from |
| Environment | B-5, B-6 | Full disk corrupted a file operation |
| Configuration | B-7, B-8 | Defaults that changed after habits formed |
| Git internals | B-9 | ...and it was harmless |

**"CI is broken" almost always means "the environment differs from my laptop."** The skill being tested in an interview is whether you can tell those apart — which is exactly why Part C exists.

---

**Next:** [Part C — CI/CD Fundamentals](03-cicd-fundamentals.md)

[← Back to index](README.md)
