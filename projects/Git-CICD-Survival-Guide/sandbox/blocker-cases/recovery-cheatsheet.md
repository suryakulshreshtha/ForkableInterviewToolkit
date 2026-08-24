# Recovery Cheatsheet

One fix per failure. Full explanation in Part B of the docs.

| Symptom | Fix |
|---|---|
| `! [rejected] ... (fetch first)` | `git pull --rebase origin main` then push |
| `zsh: command not found: #` | Comments on their own line, or `setopt interactive_comments` |
| `cd: too many arguments` | Strip the trailing comment; verify with `pwd` |
| `zsh: parse error near '\n'` | Replace `<PLACEHOLDER>` with a real path or `$VARIABLE` |
| `git status` lists your home folder | `.git` is misplaced — check `git rev-parse --show-toplevel`, move it back |
| `No space left on device` | `df -h /System/Volumes/Data`; `tmutil deletelocalsnapshots /` |
| Local `master`, remote `main` | `git branch -m master main` then `git branch --set-upstream-to=origin/main main` |
| `GH007: would publish a private email` | Set noreply email, `git commit --amend --reset-author --no-edit` |
| `dangling blob` from `git fsck` | Harmless. `git gc --prune=now` to tidy |

## The three diagnostics worth memorising

```
git rev-parse --show-toplevel     # WHERE does git think the repo root is?
git status                        # WHAT is staged, modified, untracked?
git log --oneline -5              # WHICH commits do I actually have?
```

Nearly every confusing Git situation resolves once you can answer those three.
