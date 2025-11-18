# Screenshot OCR App

A powerful screenshot OCR application with Claude and DeepSeek AI support for automatic summarization, grouping, and task management.

## Features

- **OCR Processing**: Extract text from screenshots using Claude or DeepSeek
- **AI Summarization**: Automatically summarize screenshot content
- **Smart Grouping**: Organize screenshots into custom groups/niches
- **Task Management**: Create and manage tasks from screenshots
- **Dual AI Support**: Choose between Claude and DeepSeek for processing

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

- `POST /api/screenshots/upload` - Upload a screenshot
- `GET /api/screenshots` - Get all screenshots
- `GET /api/screenshots/:id` - Get a specific screenshot
- `POST /api/groups` - Create a group
- `GET /api/groups` - Get all groups
- `POST /api/tasks` - Create a task
- `GET /api/tasks` - Get all tasks

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Frontend**: React, TypeScript, Vite
- **Database**: SQLite
- **AI**: Anthropic Claude, DeepSeek
