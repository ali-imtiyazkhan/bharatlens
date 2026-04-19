import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export const FALLBACK_MODELS = [
  'gemini-flash-latest'
];

export const askGemini = async (prompt: string, context = 'General'): Promise<any> => {
  let lastError: any;

  for (const modelName of FALLBACK_MODELS) {
    try {
      console.log(`[GeminiUtil:${context}] Trying model: ${modelName}`);
      
      const currentModel = genAI.getGenerativeModel(
        { model: modelName },
        { timeout: 30000 }
      );
      
      const result = await currentModel.generateContent(prompt);
      const text = result.response.text();
      
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      try {
        return JSON.parse(cleaned);
      } catch (parseError) {
        console.error(`[GeminiUtil:${context}] JSON Parse Error:`, cleaned.substring(0, 100));
        throw new Error('Invalid JSON response from AI');
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`[GeminiUtil:${context}] Model ${modelName} failed:`, err?.message || 'Unknown error');
      
      if (err?.status === 429 || err?.status === 503) {
        console.log(`[GeminiUtil:${context}] Service busy/limited. Waiting 1s...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
      
      if (err?.status === 404) {
        continue;
      }

      continue;
    }
  }
  
  throw lastError;
};

export const askGeminiVision = async (base64Data: string, mimeType: string, prompt: string): Promise<any> => {
  try {
    // 1.5-flash is now the recommended multimodal model
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    const imageParts = [
      {
        inlineData: {
          data: base64Data,
          mimeType
        }
      }
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const text = result.response.text();
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('[GeminiUtil:Vision] Error:', error);
    throw error;
  }
};
