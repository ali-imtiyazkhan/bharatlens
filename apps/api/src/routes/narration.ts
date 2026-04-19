import { Router } from 'express';
import { askGemini } from '../lib/gemini';

const router: Router = Router();

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
