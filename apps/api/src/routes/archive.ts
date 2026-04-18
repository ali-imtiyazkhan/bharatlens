import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router: Router = Router();
const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);
const FALLBACK_MODELS = ['gemini-flash-latest', 'gemini-2.0-flash-lite', 'gemini-2.5-flash'];

const askGemini = async (prompt: string): Promise<any> => {
  let lastError: any;
  for (const modelName of FALLBACK_MODELS) {
    try {
      console.log(`Trying model: ${modelName}`);
      const currentModel = genAI.getGenerativeModel({ model: modelName });
      const result = await currentModel.generateContent(prompt);
      const text = result.response.text();
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleaned);
    } catch (err: any) {
      lastError = err;
      if (err?.status === 429 || err?.status === 503) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        continue;
      }
      continue;
    }
  }
  throw lastError;
};

router.post('/process', async (req, res) => {
  try {
    const { transcript, language, location } = req.body;

    if (!transcript) {
      return res.status(400).json({ error: 'Missing transcript' });
    }

    const prompt = `
You are an expert oral historian and linguist. You have been given a raw transcript spoken by an elder, likely in a local Indian dialect.
Language provided bounds: ${language || 'Unknown (detect)'}.
GPS/Location Context: ${location || 'Unknown'}.

Please process this transcript:
1. Translate it clearly into English.
2. Identify the core "era" they are speaking about (e.g., "1940s", "Pre-Independence", "Contemporary").
3. Determine the type of story ("Folklore", "Eyewitness", "Craft Knowledge", "Religious").
4. Flag if it makes verifiable historical claims that need human-review (boolean).

Raw Transcript: "${transcript}"

Return ONLY a JSON object strictly matching this schema:
{
  "translation": "English translation here",
  "era": "The identified era",
  "category": "The primary category",
  "keywords": ["tag1", "tag2"],
  "needsVerification": true/false
}
`;

    const data = await askGemini(prompt);
    
    // Simulate latency for the complete Whisper + Pipeline experience
    await new Promise(r => setTimeout(r, 1500));
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in /archive/process:', error);
    return res.status(500).json({ error: 'Failed to process audio transcript with AI' });
  }
});

export default router;
