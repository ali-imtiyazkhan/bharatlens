import { Router } from 'express';
import { PrismaClient } from '@bharatlens/db';
import { ItineraryRequest, ItineraryPlan, RecommendationRequest, RecommendationResponse, DestinationInsightsRequest, DestinationInsightsResponse } from '@bharatlens/types';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router: Router = Router();
const prisma = new PrismaClient();

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);
const FALLBACK_MODELS = ['gemini-flash-latest', 'gemini-2.0-flash-lite', 'gemini-2.5-flash'];

/**
 * Helper: Ask Gemini for structured JSON with model fallback and retry.
 */
const askGemini = async (prompt: string): Promise<any> => {
  let lastError: any;

  for (const modelName of FALLBACK_MODELS) {
    try {
      console.log(`Trying model: ${modelName}`);
      const currentModel = genAI.getGenerativeModel({ model: modelName });
      const result = await currentModel.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Strip markdown code fences if present
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleaned);
    } catch (err: any) {
      lastError = err;
      console.log(`Model ${modelName} failed (${err.status || err.message}), trying next...`);

      // If rate limited, wait briefly before trying the next model
      if (err?.status === 429 || err?.status === 503) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        continue;
      }
      // For other errors, still try next model
      continue;
    }
  }

  throw lastError;
};

// ─── GENERATE ITINERARY ─────────────────────────────────────

router.post('/generate', async (req, res) => {
  try {
    const data: ItineraryRequest = req.body;

    if (!data.destination || !data.days || !data.budget || !data.userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const prompt = `You are an expert travel planner that specializes in uncovering incredible hidden gems.
Generate a ${data.days}-day itinerary for ${data.destination}.
Budget: ${data.budget}.
Interests: ${data.interests.join(', ')}.

Ensure that each day contains an array of events with a 'time', 'location', and 'description'.
At least one event per day should be a notable hidden gem where 'isHiddenGem' is true.

Respond ONLY with valid JSON matching this exact structure (no markdown, no explanation):
{
  "days": [
    {
      "day": 1,
      "title": "Day 1 in ...",
      "events": [
        { "time": "09:00 AM", "location": "Place Name", "description": "...", "isHiddenGem": false },
        { "time": "01:00 PM", "location": "Hidden Spot", "description": "...", "isHiddenGem": true }
      ]
    }
  ],
  "summary": "A brief summary of the whole trip."
}`;

    const plan: ItineraryPlan = await askGemini(prompt);

    // Try to save to database, but don't fail the whole request if user doesn't exist
    let savedItinerary = null;
    try {
      savedItinerary = await prisma.itinerary.create({
        data: {
          userId: data.userId,
          title: `${data.days} Days in ${data.destination}`,
          destination: data.destination,
          days: data.days,
          budget: data.budget,
          plan: plan as any,
        }
      });
    } catch (dbError) {
      console.log('Could not save itinerary to DB (user may not exist):', (dbError as any).code);
    }

    return res.status(201).json(savedItinerary || {
      id: 'unsaved',
      title: `${data.days} Days in ${data.destination}`,
      destination: data.destination,
      days: data.days,
      budget: data.budget,
      plan,
      createdAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error in /generate:', error);
    return res.status(500).json({ error: 'Failed to generate itinerary' });
  }
});

// ─── GET ITINERARY BY ID ────────────────────────────────────

router.get('/itinerary/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const itinerary = await prisma.itinerary.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });

    if (!itinerary) {
      return res.status(404).json({ error: 'Itinerary not found' });
    }

    return res.status(200).json(itinerary);

  } catch (error) {
    console.error('Error fetching itinerary:', error);
    return res.status(500).json({ error: 'Failed to fetch itinerary' });
  }
});

// ─── GET ALL ITINERARIES FOR A USER ─────────────────────────

router.get('/itineraries/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const itineraries = await prisma.itinerary.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json(itineraries);

  } catch (error) {
    console.error('Error fetching itineraries:', error);
    return res.status(500).json({ error: 'Failed to fetch itineraries' });
  }
});

// ─── DISCOVER DESTINATIONS ──────────────────────────────────

router.post('/discover', async (req, res) => {
  try {
    const data: RecommendationRequest = req.body;

    if (!data.budget || !data.days || !data.interests) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const categoryText = data.categoryFilter
      ? `Specifically focus ONLY on destinations fitting the category: ${data.categoryFilter}.`
      : '';

    const prompt = `You are a world-class travel advisor. A user wants to travel somewhere in the whole world.
Budget: ${data.budget}
Available Days: ${data.days}
Interests: ${data.interests.join(', ')}
${categoryText}

Provide up to 5 highly recommended destinations.
For each destination, provide a deeply detailed 'history' section explaining the historical context and background of the place, why it's a good fit ('whyItsGood'), an 'estimatedCost', and its 'category'.

Respond ONLY with valid JSON matching this exact structure (no markdown, no explanation):
{
  "recommendations": [
    {
      "name": "Place Name",
      "country": "Country",
      "category": "historical",
      "history": "Detailed historical background...",
      "whyItsGood": "Why this is perfect for the user...",
      "estimatedCost": "$1500"
    }
  ]
}`;

    const responseData: RecommendationResponse = await askGemini(prompt);
    return res.status(200).json(responseData);

  } catch (error) {
    console.error('Error in /discover:', error);
    return res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// ─── DESTINATION INSIGHTS (SAFETY + NEWS) ───────────────────

router.post('/insights', async (req, res) => {
  try {
    const data: DestinationInsightsRequest = req.body;

    if (!data.destination) {
      return res.status(400).json({ error: 'Missing destination field' });
    }

    const prompt = `You are a localized safety and news advisor. The user is planning to travel to "${data.destination}".

Provide a JSON object with:
1. 'dangerLevel': strictly one of 'Low', 'Moderate', or 'High'.
2. 'safetyAdvice': detailed local advice about known scams, areas to avoid, or general health/safety precautions for this specific location.
3. 'news': an array of 2-3 recent or highly notable news headlines regarding this destination (e.g., ticket prices, renovations, political events), along with a plausible 'source'.

Respond ONLY with valid JSON matching this exact structure (no markdown, no explanation):
{
  "dangerLevel": "Low",
  "safetyAdvice": "Detailed safety advice...",
  "news": [
    { "headline": "News headline...", "source": "Source name" }
  ]
}`;

    const responseData: DestinationInsightsResponse = await askGemini(prompt);
    return res.status(200).json(responseData);

  } catch (error) {
    console.error('Error in /insights:', error);
    return res.status(500).json({ error: 'Failed to generate destination insights' });
  }
});

// ─── TEST: List available models ────────────────────────────

router.get('/test/models', async (_req, res) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    const data = await response.json();
    const models = (data.models || []).map((m: any) => ({
      name: m.name,
      displayName: m.displayName,
      supportedMethods: m.supportedGenerationMethods,
    }));
    return res.json({ total: models.length, models });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ─── TEST: Simple AI ping ───────────────────────────────────

router.get('/test/ping', async (_req, res) => {
  try {
    const result = await askGemini('Say "hello" in JSON format: {"message": "hello"}');
    return res.json({ raw: result, apiKey: apiKey ? 'SET' : 'MISSING' });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
      status: error.status,
      apiKey: apiKey ? 'SET' : 'MISSING',
    });
  }
});

export default router;
