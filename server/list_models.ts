import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

async function listModels() {
  const key = process.env.GEMINI_API_KEY || '';
  console.log('Testing with key:', key.substring(0, 10) + '...');
  
  try {
    const genAI = new GoogleGenerativeAI(key);
    
    // Instead of raw fetch, just list a few standard test cases or do a fetch manually
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const data: any = await response.json();
    
    console.log('\n--- Available Models for this API Key ---');
    if (data.models) {
      data.models.forEach((model: any) => {
        console.log(`- ${model.name}`);
      });
    }
    console.log('-----------------------------------------\n');
  } catch (error) {
    console.error('Error fetching models:', error);
  }
}

listModels();
