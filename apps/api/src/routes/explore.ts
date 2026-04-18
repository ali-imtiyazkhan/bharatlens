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

export default router;
