# Blocker Cases

Nine failures that actually happened while building the two automation projects in this repo. Every error message here is **verbatim** — no invented examples. Paths and usernames are sanitised to `/Users/you/...`.

Part B of the docs explains each one. This folder lets you **reproduce them on purpose**, in a throwaway repo, so the first time you see the error isn't at 1am during a real push.

---

## ⚠️ Read before reproducing

Some of these deliberately break a repository. **Never run them in a repo you care about.** Every case below starts by creating a disposable one:

```bash
mkdir -p /tmp/git-lab && cd /tmp/git-lab
rm -rf demo && mkdir demo && cd demo
git init
echo "hello" > file.txt
git add . && git commit -m "initial"
```

Delete the whole lab when you're done:

```bash
rm -rf /tmp/git-lab
```

---

## The nine cases

| # | Error you'll see | Chapter | Danger |
|---|---|---|---|
| 1 | `! [rejected] main -> main (fetch first)` | B-1 | 🟢 Safe |
| 2 | `zsh: command not found: #` | B-2 | 🟢 Safe |
| 3 | `cd: too many arguments` | B-3 | 🟡 Runs commands in the wrong place |
| 4 | `zsh: parse error near '\n'` | B-4 | 🟢 Safe |
| 5 | `fatal: not a git repository` / repo points at your home folder | B-5 | 🔴 **Destructive** |
| 6 | `error: could not lock config file .git/config: No space left on device` | B-6 | 🔴 **Don't simulate — read only** |
| 7 | `On branch master` vs `remotes/origin/main` | B-7 | 🟢 Safe |
| 8 | `GH007: Your push would publish a private email address` | B-8 | 🟢 Safe |
| 9 | `dangling blob ...` from `git fsck` | B-9 | 🟢 Safe |

---

## Files here

| File | What it's for |
|---|---|
| `broken-commands.sh` | Every failing command, commented out. **Reference, not a script to run.** |
| `recovery-cheatsheet.md` | The fix for each case, one line each |
| `conflict-side-a.md` / `conflict-side-b.md` | Pre-made conflicting content for case 1 |

---

## The meta-lesson

Eight of the nine had nothing to do with Git being hard. They were:

- **Shell syntax** (cases 2, 3, 4) — zsh behaving differently from the docs you copied from
- **Environment** (cases 5, 6) — a full disk corrupting a file move
- **Configuration** (cases 7, 8) — defaults that changed after your habits formed

Only case 9 was Git internals, and it turned out to be harmless.

That ratio is worth remembering in interviews. "CI is broken" is usually *"the environment differs from my laptop"* — not a mysterious tooling failure. The debugging skill being tested is whether you can tell those apart.
