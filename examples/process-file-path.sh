#!/bin/bash

# Example: Process a file from a specific path using the API

# Configuration
API_URL="http://localhost:3000/api/screenshots/process-path"
FILE_PATH="$1"
PROVIDER="${2:-deepseek}"
GROUP_ID="${3:-}"

# Check if file path is provided
if [ -z "$FILE_PATH" ]; then
    echo "Usage: $0 <file_path> [provider] [group_id]"
    echo ""
    echo "Examples:"
    echo "  $0 /path/to/screenshot.png"
    echo "  $0 /path/to/chat.txt deepseek"
    echo "  $0 /path/to/screenshot.png claude group-id-123"
    exit 1
fi

# Build JSON payload
if [ -n "$GROUP_ID" ]; then
    JSON_PAYLOAD=$(cat <<EOF
{
  "file_path": "$FILE_PATH",
  "provider": "$PROVIDER",
  "group_id": "$GROUP_ID"
}
EOF
)
else
    JSON_PAYLOAD=$(cat <<EOF
{
  "file_path": "$FILE_PATH",
  "provider": "$PROVIDER"
}
EOF
)
fi

# Make API request
echo "Processing file: $FILE_PATH"
echo "Provider: $PROVIDER"
echo ""

curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "$JSON_PAYLOAD" \
  | jq '.'

echo ""
echo "Done!"
