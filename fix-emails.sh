#!/bin/bash
# Fix commit emails - Run this in Git Bash from your Siksha AI folder

export FILTER_BRANCH_SQUELCH_WARNING=1

echo "Starting email rewrite..."
git filter-branch -f --env-filter '
export GIT_COMMITTER_NAME="Sugandh Mahajan"
export GIT_COMMITTER_EMAIL="mahajansugandh3@gmail.com"
export GIT_AUTHOR_NAME="Sugandh Mahajan"
export GIT_AUTHOR_EMAIL="mahajansugandh3@gmail.com"
' HEAD

echo ""
echo "✅ All commits updated!"
echo "Now run this command to push:"
echo "git push -u origin main --force-with-lease"
