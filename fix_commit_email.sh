#!/bin/bash
# This script rewrites all commits to use the correct GitHub email

git filter-branch --env-filter '
export GIT_COMMITTER_NAME="Sugandh147"
export GIT_COMMITTER_EMAIL="mahajansugandh3@gmail.com"
export GIT_AUTHOR_NAME="Sugandh147"
export GIT_AUTHOR_EMAIL="mahajansugandh3@gmail.com"
' HEAD

echo "✅ Commit email rewritten successfully!"
echo "Now run: git push origin main --force-with-lease"
