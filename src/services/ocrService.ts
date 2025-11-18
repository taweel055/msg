import Anthropic from '@anthropic-ai/sdk';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

export type OCRProvider = 'claude' | 'deepseek';

export interface OCRResult {
  extractedText: string;
  summary: string;
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function processWithClaude(imagePath: string): Promise<OCRResult> {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    const ext = path.extname(imagePath).toLowerCase();
    let mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' = 'image/png';

    if (ext === '.jpg' || ext === '.jpeg') {
      mediaType = 'image/jpeg';
    } else if (ext === '.png') {
      mediaType = 'image/png';
    } else if (ext === '.gif') {
      mediaType = 'image/gif';
    } else if (ext === '.webp') {
      mediaType = 'image/webp';
    }

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64Image,
              },
            },
            {
              type: 'text',
              text: 'Please analyze this screenshot and:\n1. Extract all visible text (OCR)\n2. Provide a concise summary of what this screenshot shows\n\nFormat your response as:\nEXTRACTED TEXT:\n[text here]\n\nSUMMARY:\n[summary here]',
            },
          ],
        },
      ],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    const extractedTextMatch = responseText.match(/EXTRACTED TEXT:\s*([\s\S]*?)\s*SUMMARY:/i);
    const summaryMatch = responseText.match(/SUMMARY:\s*([\s\S]*?)$/i);

    const extractedText = extractedTextMatch ? extractedTextMatch[1].trim() : responseText;
    const summary = summaryMatch ? summaryMatch[1].trim() : 'Summary not available';

    return {
      extractedText,
      summary,
    };
  } catch (error) {
    console.error('Claude OCR error:', error);
    throw new Error('Failed to process image with Claude');
  }
}

export async function processWithDeepSeek(imagePath: string): Promise<OCRResult> {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    const ext = path.extname(imagePath).toLowerCase();
    let mimeType = 'image/png';

    if (ext === '.jpg' || ext === '.jpeg') {
      mimeType = 'image/jpeg';
    } else if (ext === '.png') {
      mimeType = 'image/png';
    } else if (ext === '.gif') {
      mimeType = 'image/gif';
    } else if (ext === '.webp') {
      mimeType = 'image/webp';
    }

    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`,
                },
              },
              {
                type: 'text',
                text: 'Please analyze this screenshot and:\n1. Extract all visible text (OCR)\n2. Provide a concise summary of what this screenshot shows\n\nFormat your response as:\nEXTRACTED TEXT:\n[text here]\n\nSUMMARY:\n[summary here]',
              },
            ],
          },
        ],
        max_tokens: 4096,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        },
      }
    );

    const responseText = response.data.choices[0].message.content;

    const extractedTextMatch = responseText.match(/EXTRACTED TEXT:\s*([\s\S]*?)\s*SUMMARY:/i);
    const summaryMatch = responseText.match(/SUMMARY:\s*([\s\S]*?)$/i);

    const extractedText = extractedTextMatch ? extractedTextMatch[1].trim() : responseText;
    const summary = summaryMatch ? summaryMatch[1].trim() : 'Summary not available';

    return {
      extractedText,
      summary,
    };
  } catch (error) {
    console.error('DeepSeek OCR error:', error);
    throw new Error('Failed to process image with DeepSeek');
  }
}

export async function processChatWithDeepSeek(chatPath: string): Promise<OCRResult> {
  try {
    const chatText = fs.readFileSync(chatPath, 'utf-8');

    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: `Please analyze this WhatsApp chat extract and:
1. Identify key participants and topics discussed
2. Extract important information, dates, decisions, or action items
3. Provide a comprehensive summary

Format your response as:
EXTRACTED TEXT:
[key information, participants, important points]

SUMMARY:
[detailed summary of the conversation]

Here is the chat:
${chatText}`,
          },
        ],
        max_tokens: 4096,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        },
      }
    );

    const responseText = response.data.choices[0].message.content;

    const extractedTextMatch = responseText.match(/EXTRACTED TEXT:\s*([\s\S]*?)\s*SUMMARY:/i);
    const summaryMatch = responseText.match(/SUMMARY:\s*([\s\S]*?)$/i);

    const extractedText = extractedTextMatch ? extractedTextMatch[1].trim() : responseText;
    const summary = summaryMatch ? summaryMatch[1].trim() : 'Summary not available';

    return {
      extractedText,
      summary,
    };
  } catch (error) {
    console.error('DeepSeek chat processing error:', error);
    throw new Error('Failed to process chat with DeepSeek');
  }
}

export async function processChatWithClaude(chatPath: string): Promise<OCRResult> {
  try {
    const chatText = fs.readFileSync(chatPath, 'utf-8');

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: `Please analyze this WhatsApp chat extract and:
1. Identify key participants and topics discussed
2. Extract important information, dates, decisions, or action items
3. Provide a comprehensive summary

Format your response as:
EXTRACTED TEXT:
[key information, participants, important points]

SUMMARY:
[detailed summary of the conversation]

Here is the chat:
${chatText}`,
        },
      ],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    const extractedTextMatch = responseText.match(/EXTRACTED TEXT:\s*([\s\S]*?)\s*SUMMARY:/i);
    const summaryMatch = responseText.match(/SUMMARY:\s*([\s\S]*?)$/i);

    const extractedText = extractedTextMatch ? extractedTextMatch[1].trim() : responseText;
    const summary = summaryMatch ? summaryMatch[1].trim() : 'Summary not available';

    return {
      extractedText,
      summary,
    };
  } catch (error) {
    console.error('Claude chat processing error:', error);
    throw new Error('Failed to process chat with Claude');
  }
}

export async function processScreenshot(
  imagePath: string,
  provider: OCRProvider
): Promise<OCRResult> {
  if (provider === 'claude') {
    return processWithClaude(imagePath);
  } else if (provider === 'deepseek') {
    return processWithDeepSeek(imagePath);
  } else {
    throw new Error('Invalid OCR provider');
  }
}

export async function processChat(
  chatPath: string,
  provider: OCRProvider
): Promise<OCRResult> {
  if (provider === 'claude') {
    return processChatWithClaude(chatPath);
  } else if (provider === 'deepseek') {
    return processChatWithDeepSeek(chatPath);
  } else {
    throw new Error('Invalid OCR provider');
  }
}
