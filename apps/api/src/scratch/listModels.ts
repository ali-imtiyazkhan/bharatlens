import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY || '';
  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    console.log('Available Models:');
    data.models.forEach((m: any) => {
      console.log(`- ${m.name} (Supports: ${m.supportedGenerationMethods.join(', ')})`);
    });
  } catch (error) {
    console.error('Error listing models:', error);
  }
}

listModels();
