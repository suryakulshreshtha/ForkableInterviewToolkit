# Conflict Playground

This file exists to be fought over. See Chapter 2 for the full walkthrough.

## The line that causes trouble

FAVOURITE_TOOL = Playwright

## How to create a conflict on purpose

```
git checkout -b branch-a
# change the line above to: FAVOURITE_TOOL = Selenium
git commit -am "Branch A prefers Selenium"

git checkout main
git checkout -b branch-b
# change the SAME line to: FAVOURITE_TOOL = Cypress
git commit -am "Branch B prefers Cypress"

git checkout main
git merge branch-a      # succeeds
git merge branch-b      # CONFLICT
```

Git will rewrite the section above with conflict markers:

```
<<<<<<< HEAD
FAVOURITE_TOOL = Selenium
=======
FAVOURITE_TOOL = Cypress
>>>>>>> branch-b
```

Delete the markers, keep the line you want, then:

```
git add sandbox/lesson-03-merge-conflict/conflict-playground.md
git commit
```

## Cleanup

```
git checkout main
git branch -D branch-a branch-b
```
