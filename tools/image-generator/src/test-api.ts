#!/usr/bin/env node

import axios from 'axios';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.join(__dirname, '../.env') });

const apiKey = process.env.VENICE_AI_API_KEY;

console.log('Testing Venice.ai API connection...\n');
console.log(`API Key: ${apiKey?.substring(0, 10)}...${apiKey?.substring(apiKey.length - 5)}`);

const endpoints = [
  'https://api.venice.ai/v1/image/generations',
  'https://api.venice.ai/api/v1/image/generations',
  'https://api.venice.ai/v1/images/generations',
  'https://api.venice.ai/api/v1/images/generations',
  'https://api.venice.ai/v1/chat/completions',
];

async function testEndpoint(url: string) {
  console.log(`\nTesting: ${url}`);
  try {
    const response = await axios.post(
      url,
      {
        prompt: 'test',
        width: 512,
        height: 512,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
        validateStatus: () => true, // Don't throw on any status
      }
    );
    
    console.log(`  Status: ${response.status}`);
    console.log(`  Response:`, JSON.stringify(response.data, null, 2).substring(0, 500));
    
    if (response.status < 400) {
      console.log('  ✅ SUCCESS - This endpoint works!');
      return true;
    }
  } catch (error: any) {
    console.log(`  ❌ Error: ${error.message}`);
  }
  return false;
}

async function main() {
  for (const endpoint of endpoints) {
    const works = await testEndpoint(endpoint);
    if (works) {
      console.log(`\n🎉 Found working endpoint: ${endpoint}`);
      break;
    }
  }
  
  console.log('\n\nTest complete.');
}

main();
