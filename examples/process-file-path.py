#!/usr/bin/env python3

"""
Example: Process a file from a specific path using the API

Usage:
  python process-file-path.py /path/to/file.png
  python process-file-path.py /path/to/chat.txt deepseek
  python process-file-path.py /path/to/file.png claude group-id-123
"""

import sys
import json
import requests

API_URL = 'http://localhost:3000/api/screenshots/process-path'

def process_file(file_path, provider='deepseek', group_id=None):
    """Process a file using the API"""

    print(f"Processing file: {file_path}")
    print(f"Provider: {provider}")
    print()

    payload = {
        'file_path': file_path,
        'provider': provider,
    }

    if group_id:
        payload['group_id'] = group_id

    try:
        response = requests.post(API_URL, json=payload)
        response.raise_for_status()

        print("Success! Result:")
        print(json.dumps(response.json(), indent=2))

        return response.json()

    except requests.exceptions.RequestException as e:
        print(f"Error processing file: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Status: {e.response.status_code}")
            print(f"Error: {e.response.text}")
        sys.exit(1)

def main():
    if len(sys.argv) < 2:
        print("Usage: python process-file-path.py <file_path> [provider] [group_id]")
        print()
        print("Examples:")
        print("  python process-file-path.py /path/to/screenshot.png")
        print("  python process-file-path.py /path/to/chat.txt deepseek")
        print("  python process-file-path.py /path/to/screenshot.png claude group-id-123")
        sys.exit(1)

    file_path = sys.argv[1]
    provider = sys.argv[2] if len(sys.argv) > 2 else 'deepseek'
    group_id = sys.argv[3] if len(sys.argv) > 3 else None

    process_file(file_path, provider, group_id)

if __name__ == '__main__':
    main()
