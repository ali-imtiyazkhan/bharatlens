import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router: Router = Router();
const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);
const FALLBACK_MODELS = [
  'gemini-flash-latest', 
  'gemini-1.5-flash', 
  'gemini-1.5-flash-8b', 
  'gemini-1.5-pro-latest', 
  'gemini-1.5-pro', 
  'gemini-pro',
  'gemini-1.0-pro'
];

const askGemini = async (prompt: string): Promise<any> => {
  let lastError: any;
  for (const modelName of FALLBACK_MODELS) {
    try {
      console.log(`[NarrateAPI] Trying model: ${modelName}`);
      const currentModel = genAI.getGenerativeModel({ model: modelName });
      const result = await currentModel.generateContent(prompt);
      const text = result.response.text();
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleaned);
    } catch (err: any) {
      lastError = err;
      if (err?.status === 429 || err?.status === 503) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
      continue;
    }
  }
  throw lastError;
};

router.post('/generate', async (req, res) => {
  try {
    const { siteName, category } = req.body;

    if (!siteName) {
      return res.status(400).json({ error: 'Missing site name' });
    }

    const prompt = `You are a professional Indian heritage historian and master storyteller.
Provide a 1-minute audio guide narration for "${siteName}" (${category || 'Heritage Site'}).

The narration should be:
1. Immersive and descriptive.
2. Focus on "Insider Secrets" or architectural marvels not found in standard travel books.
3. Engaging for a tourist standing in front of the monument.

Respond ONLY with a JSON object:
{
  "script": "The 1-minute narration text...",
  "mood": "Sentimental/Epic/Informative",
  "metadata": {
    "recommendedPace": "Slow",
    "backgroundSound": "Distant temple bells / Wind through archways"
  }
}

Respond ONLY with valid JSON. No markdown.`;

    const data = await askGemini(prompt);
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in /narration/generate:', error);
    return res.status(500).json({ error: 'Failed to generate narration' });
  }
});

export default router;
