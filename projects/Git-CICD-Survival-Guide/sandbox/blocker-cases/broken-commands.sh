#!/usr/bin/env bash
#
# REFERENCE ONLY -- DO NOT RUN THIS FILE.
#
# Every command below is deliberately broken. They are the exact commands that
# failed while building the two automation projects in this repo, kept commented
# so you can read the failure mode without triggering it.
#
# To practise a case, copy ONE line into a throwaway repo (see README.md).

set -euo pipefail
echo "This file is reference material. Read it, don't execute it." && exit 0

# ---------------------------------------------------------------------------
# CASE 2 -- interactive zsh does not support inline comments by default
# ---------------------------------------------------------------------------
# git add -A              # stages everything
#   zsh: command not found: #
#   fatal: pathspec '#' did not match any files
#
# FIX: put comments on their own line, or enable:
#   echo 'setopt interactive_comments' >> ~/.zshrc && source ~/.zshrc

# ---------------------------------------------------------------------------
# CASE 3 -- the trailing comment became a second argument to cd
# ---------------------------------------------------------------------------
# cd MyRepo               # go to the repo
#   cd: too many arguments
#
# WHY IT MATTERS: cd failed, so every following command ran in the WRONG
# directory -- silently. Always confirm with `pwd` after a cd you care about.

# ---------------------------------------------------------------------------
# CASE 4 -- angle brackets are shell redirect operators, not placeholders
# ---------------------------------------------------------------------------
# cd <CLONE>
#   zsh: parse error near '\n'
#
# FIX: use a variable instead.
#   CLONE=/Users/you/path/to/repo
#   cd "$CLONE"

# ---------------------------------------------------------------------------
# CASE 5 -- a mistyped rsync destination relocated the .git folder
# ---------------------------------------------------------------------------
# rsync -av --exclude='.git' ~/Downloads/MyRepo/ <CLONE>/
#   rsync: child exited with status 23   (partial transfer)
#   ...and .git ended up at ~/.git
#
# SYMPTOM: git rev-parse --show-toplevel returns /Users/you
#          git status lists your ENTIRE home folder as untracked
#
# FIX:  mv ~/.git /Users/you/path/to/repo/.git
#
# PREVENTION: prefer explicit `cp` of specific paths over recursive sync
#             near a repo root.

# ---------------------------------------------------------------------------
# CASE 6 -- disk full; git could not write its own config
# ---------------------------------------------------------------------------
# git branch --set-upstream-to=origin/main main
#   error: could not lock config file .git/config: No space left on device
#
# DO NOT SIMULATE. Filling a disk risks real corruption.
#
# DIAGNOSE:  df -h /System/Volumes/Data     (macOS -- NOT `df -h /`)
#            tmutil listlocalsnapshots /    (APFS snapshots hide huge space)

# ---------------------------------------------------------------------------
# CASE 8 -- GitHub blocked the push to protect a private email
# ---------------------------------------------------------------------------
# git push
#   remote: error: GH007: Your push would publish a private email address.
#
# FIX:
#   git config --global user.email "ID+username@users.noreply.github.com"
#   git commit --amend --reset-author --no-edit
#   git push
