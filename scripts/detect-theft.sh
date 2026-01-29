#!/bin/bash
UNAUTHORIZED_EMAILS=$(git log --all --pretty=format:"%ae" | grep -v "ervinremus210@gmail.com\|53744672-ervinrado210@users.noreply.replit.com\|ervin210@icloud.com\|ERVIIN210@ICLOUD.COM")
if [ -n "$UNAUTHORIZED_EMAILS" ]; then
  echo "Unauthorized emails detected: $UNAUTHORIZED_EMAILS"
  curl -X POST -H "Content-Type: application/json" -d "{\"text\":\"Theft detected in ProjectAgiUpgrade. Unauthorized emails: $UNAUTHORIZED_EMAILS\"}" "$SLACK_WEBHOOK_URL"
  curl -X POST -H "Authorization: token $GITHUB_TOKEN" -H "Accept: application/vnd.github.v3+json" "https://api.github.com/repos/ervinremus2019-wq/romaniaai/branches/main/protection" -d '{"required_status_checks":null,"enforce_admins":true,"required_pull_request_reviews":null,"restrictions":null}'
  curl -X POST -H "Authorization: token $GITHUB_TOKEN" -H "Accept: application/vnd.github.v3+json" "https://api.github.com/repos/ervinremus2019-wq/romaniaai/issues" -d '{"title":"Security Alert: Unauthorized Access Detected","body":"Unauthorized emails detected: '"$UNAUTHORIZED_EMAILS"'. Immediate action required.","labels":["security","theft"]}'
fi
