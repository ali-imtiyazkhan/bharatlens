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
const askGeminiVision = async (base64Data: string, mimeType: string, prompt: string): Promise<any> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
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
    throw error;
  }
};
router.post('/sites', async (req, res) => {
  try {
    const { search, category, state, era } = req.body;

    let constraints = [];
    if (search && search.trim() !== '') constraints.push(`match the search query: "${search}"`);
    if (category && category !== 'All') constraints.push(`belong to the category: "${category}" (if UNESCO, they must be actual UNESCO sites)`);
    if (state && state !== 'All States') constraints.push(`be located in the state of ${state}`);
    if (era && era !== 'All Eras') constraints.push(`be from the historical era: ${era}`);

    const constrainText = constraints.length > 0 
      ? `Ensure the sites meet the following criteria:\n- ${constraints.join('\n- ')}` 
      : 'Provide a diverse mix of famous and hidden gem sites across India.';

    const prompt = `You are a travel database expert specializing in Indian Heritage. 
Generate a list of exactly 12 Indian heritage sites.
${constrainText}

Respond ONLY with valid JSON matching this exact structure (no markdown, no explanation). Make sure to return an array of objects under the key "sites".

{
  "sites": [
    {
      "id": 1, 
      "name": "Site Name",
      "state": "State Name",
      "category": "Monuments", 
      "era": "Medieval (600-1500)", 
      "rating": 4.8, 
      "crowd": "Low", 
      "hasAR": true, 
      "has3D": false, 
      "offline": true, 
      "unesco": true, 
      "lat": 12.34, 
      "lng": 56.78, 
      "desc": "Short description of the site (2-3 sentences)",
      "weather": "☀️", 
      "temp": "35°C" 
    }
  ]
}`;

    const data = await askGemini(prompt);
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in /explore/sites:', error);
    return res.status(500).json({ error: 'Failed to fetch sites from AI' });
  }
});

router.post('/vision', async (req, res) => {
  try {
    const { image, mode } = req.body;
    if (!image || !mode) {
      return res.status(400).json({ error: 'Missing image or mode' });
    }

    // Extract base64 and mime type
    const matches = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid image format' });
    }
    const mimeType = matches[1];
    const base64Data = matches[2];

    let prompt = '';
    if (mode === 'Sign Translation') {
      prompt = `You are a native translator and historian. The user has pointed their camera at a sign in an Indian heritage site.
Identify the language on the sign. Translate any text into English. If it has historical context, briefly explain it.
Respond ONLY with a JSON object: {"translation": "The direct translation", "context": "Brief context or explanation"}`;
    } else if (mode === 'Monument Story') {
      prompt = `You are an expert Indian historian. The user pointed their camera at a monument or artifact.
Identify what this is with high confidence based on the image. Tell a fascinating 2-3 sentence story or historical fact about it.
Respond ONLY with a JSON object: {"identification": "Name of monument/artifact", "story": "Interesting story here"}`;
    } else {
      prompt = `You are a cultural expert. The user pointed their camera at an object or menu.
Identify it and explain its cultural significance in 1-2 sentences.
Respond ONLY with a JSON object: {"identification": "Object name", "explanation": "Cultural explanation"}`;
    }

    const data = await askGeminiVision(base64Data, mimeType, prompt);
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in /vision:', error);
    return res.status(500).json({ error: 'Failed to process image' });
  }
});

router.post('/translate', async (req, res) => {
  try {
    const { text, from, to } = req.body;
    if (!text || !to) {
      return res.status(400).json({ error: 'Missing text or target language' });
    }

    const prompt = `Translate the following text from ${from || 'auto-detect'} to ${to}. The context is a conversation between a tourist and a local in India.
Provide exactly the translation in a JSON object.
Text: "${text}"
Respond ONLY with a JSON object: {"translation": "The translated text"}`;

    const data = await askGemini(prompt);
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in /translate:', error);
    return res.status(500).json({ error: 'Failed to translate' });
  }
});

export default router;
