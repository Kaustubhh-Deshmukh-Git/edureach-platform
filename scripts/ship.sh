#!/usr/bin/env bash
# Usage: ./scripts/ship.sh "<conventional PR title>" ["<PR body>"]
set -euo pipefail
TITLE="${1:?PR title required (Conventional Commit format)}"
BODY="${2:-Automated chunk PR. See commits for details.}"
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
[[ "$BRANCH" == "main" ]] && { echo "✖ Refusing to ship from main"; exit 1; }
[[ -n "$(git status --porcelain)" ]] && { echo "✖ Working tree dirty — commit first"; exit 1; }
npm run verify
git fetch origin main --quiet
git rebase origin/main
git push -u origin "$BRANCH" --force-with-lease
gh pr create --base main --head "$BRANCH" --title "$TITLE" --body "$BODY" 2>/dev/null \
  || gh pr edit "$BRANCH" --title "$TITLE" --body "$BODY"
sleep 8
gh pr checks "$BRANCH" --watch --fail-fast
gh pr merge "$BRANCH" --squash --delete-branch --subject "$TITLE"
git switch main
git pull --ff-only origin main
git branch -D "$BRANCH" 2>/dev/null || true
echo "✔ Shipped: $TITLE"
