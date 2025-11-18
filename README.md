# Screenshot OCR & Chat Analysis App

A powerful application with Claude and DeepSeek AI support for processing screenshots and WhatsApp chats with automatic summarization, grouping, and task management.

## Features

- **Screenshot OCR**: Extract text from images using Claude or DeepSeek
- **WhatsApp Chat Analysis**: Analyze exported WhatsApp chats (.txt files)
- **AI Summarization**: Automatically summarize content with key insights
- **Smart Grouping**: Organize content into custom groups/niches
- **Task Management**: Create and manage tasks from screenshots or chats
- **Dual AI Support**: Choose between Claude and DeepSeek for processing
- **File Path Processing**: Process files directly from filesystem paths

## Setup

1. Install dependencies:
```bash
npm install
cd client && npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your API keys
```

3. Run the application:
```bash
npm run dev
```

## API Endpoints

### Screenshots & Chats
- `POST /api/screenshots/upload` - Upload a file (image or .txt chat)
- `POST /api/screenshots/process-path` - Process file from filesystem path
- `GET /api/screenshots` - Get all items
- `GET /api/screenshots/:id` - Get a specific item
- `PUT /api/screenshots/:id` - Update an item
- `DELETE /api/screenshots/:id` - Delete an item

### Groups
- `POST /api/groups` - Create a group
- `GET /api/groups` - Get all groups
- `GET /api/groups/:id` - Get a specific group
- `GET /api/groups/:id/screenshots` - Get all items in a group
- `PUT /api/groups/:id` - Update a group
- `DELETE /api/groups/:id` - Delete a group

### Tasks
- `POST /api/tasks` - Create a task
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a specific task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Processing Files from Path

You can process files directly from the filesystem without uploading them:

### Using cURL:
```bash
curl -X POST http://localhost:3000/api/screenshots/process-path \
  -H "Content-Type: application/json" \
  -d '{
    "file_path": "/path/to/your/file.png",
    "provider": "deepseek",
    "group_id": "optional-group-id"
  }'
```

### Using the Example Scripts:

**Bash:**
```bash
./examples/process-file-path.sh /path/to/screenshot.png
./examples/process-file-path.sh /path/to/chat.txt deepseek
./examples/process-file-path.sh /path/to/file.png claude group-id-123
```

**Node.js:**
```bash
node examples/process-file-path.js /path/to/screenshot.png
node examples/process-file-path.js /path/to/chat.txt deepseek
```

**Python:**
```bash
python examples/process-file-path.py /path/to/screenshot.png
python examples/process-file-path.py /path/to/chat.txt deepseek
```

### Request Body:
```json
{
  "file_path": "/absolute/path/to/file.png",
  "provider": "deepseek",
  "group_id": "optional-group-id"
}
```

### Response:
```json
{
  "id": "abc123",
  "filename": "file.png",
  "filepath": "/absolute/path/to/file.png",
  "content_type": "screenshot",
  "ocr_provider": "deepseek",
  "extracted_text": "Extracted text here...",
  "summary": "AI-generated summary...",
  "created_at": "2025-11-18T12:00:00.000Z"
}
```

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Frontend**: React, TypeScript, Vite
- **Database**: SQLite
- **AI**: Anthropic Claude, DeepSeek
