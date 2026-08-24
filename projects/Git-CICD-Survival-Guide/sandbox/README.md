# Sandbox

Throwaway files for practising Git. Nothing here is imported by any code,
so you can edit, break, and revert anything freely.

| Folder | Used by | Purpose |
|---|---|---|
| `lesson-01-first-commit/` | Ch. 1 | add → commit → push |
| `lesson-02-staging/` | Ch. 1 | staged vs unstaged |
| `lesson-03-merge-conflict/` | Ch. 2 | create and resolve a conflict |
| `lesson-04-gitignore/` | Ch. 3 | ignore patterns, secret templates |
| `blocker-cases/` | **Part B** | reproduce real failures safely |

## Reset anything you break

```
git checkout -- sandbox/
```

Or for one file:

```
git checkout -- sandbox/lesson-01-first-commit/hello-git.txt
```

## Rule

Never practise on a repo you care about. That is what this folder is for.
