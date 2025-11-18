#!/usr/bin/env node

/**
 * Test DeepSeek API Key
 */

const axios = require('axios');
require('dotenv').config();

async function testDeepSeekAPI() {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  console.log('Testing DeepSeek API...');
  console.log('API Key:', apiKey ? apiKey.substring(0, 10) + '...' : 'NOT SET');
  console.log('');

  // Test 1: Simple text completion
  console.log('Test 1: Simple text completion...');
  try {
    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: 'Say "Hello, API is working!"'
          }
        ],
        max_tokens: 50
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    console.log('✅ Success!');
    console.log('Response:', response.data.choices[0].message.content);
    console.log('');
  } catch (error) {
    console.log('❌ Failed!');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
    console.log('');
  }

  // Test 2: Check if vision/multimodal is supported
  console.log('Test 2: Check vision model availability...');
  console.log('Note: DeepSeek may not support vision in all models');
  console.log('Standard model: deepseek-chat (text only)');
  console.log('');

  // Test 3: List available models (if endpoint exists)
  console.log('Test 3: Trying to list models...');
  try {
    const response = await axios.get(
      'https://api.deepseek.com/v1/models',
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );
    console.log('✅ Available models:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('⚠️ Could not fetch models list');
    if (error.response) {
      console.log('Status:', error.response.status);
    }
  }
}

testDeepSeekAPI();
