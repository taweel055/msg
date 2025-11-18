#!/usr/bin/env node

/**
 * Example: Process a file from a specific path using the API
 *
 * Usage:
 *   node process-file-path.js /path/to/file.png
 *   node process-file-path.js /path/to/chat.txt deepseek
 *   node process-file-path.js /path/to/file.png claude group-id-123
 */

const axios = require('axios');

const API_URL = 'http://localhost:3000/api/screenshots/process-path';

async function processFile(filePath, provider = 'deepseek', groupId = null) {
  try {
    console.log(`Processing file: ${filePath}`);
    console.log(`Provider: ${provider}`);
    console.log('');

    const payload = {
      file_path: filePath,
      provider: provider,
    };

    if (groupId) {
      payload.group_id = groupId;
    }

    const response = await axios.post(API_URL, payload);

    console.log('Success! Result:');
    console.log(JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    console.error('Error processing file:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: node process-file-path.js <file_path> [provider] [group_id]');
  console.log('');
  console.log('Examples:');
  console.log('  node process-file-path.js /path/to/screenshot.png');
  console.log('  node process-file-path.js /path/to/chat.txt deepseek');
  console.log('  node process-file-path.js /path/to/screenshot.png claude group-id-123');
  process.exit(1);
}

const [filePath, provider, groupId] = args;

processFile(filePath, provider, groupId);
