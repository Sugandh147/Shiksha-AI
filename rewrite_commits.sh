#!/bin/bash
# Rewrite all commits with correct email for GitHub profile attribution

export FILTER_BRANCH_SQUELCH_WARNING=1

git filter-branch -f --env-filter '
if [ "$GIT_COMMITTER_EMAIL" = "sugandh147@github.com" ]
then
    export GIT_COMMITTER_EMAIL="mahajansugandh3@gmail.com"
    export GIT_COMMITTER_NAME="Sugandh Mahajan"
fi
if [ "$GIT_AUTHOR_EMAIL" = "sugandh147@github.com" ]
then
    export GIT_AUTHOR_EMAIL="mahajansugandh3@gmail.com"
    export GIT_AUTHOR_NAME="Sugandh Mahajan"
fi
' -- --all

echo "✅ All commits rewritten!"
echo "Now run: git push -u origin main --force-with-lease"
