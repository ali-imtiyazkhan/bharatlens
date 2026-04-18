import { Router } from 'express';
import { PrismaClient } from '@bharatlens/db';
import { ItineraryRequest, ItineraryPlan, RecommendationRequest, RecommendationResponse, DestinationInsightsRequest, DestinationInsightsResponse } from '@bharatlens/types';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';

const router: Router = Router();
const prisma = new PrismaClient();
const openai = new OpenAI();

const EventSchema = z.object({
  time: z.string(),
  location: z.string(),
  description: z.string(),
  isHiddenGem: z.boolean(),
});

const DaySchema = z.object({
  day: z.number(),
  title: z.string(),
  events: z.array(EventSchema),
});

const PlanSchema = z.object({
  days: z.array(DaySchema),
  summary: z.string(),
});

const generatePlanWithAI = async (reqData: ItineraryRequest): Promise<ItineraryPlan> => {
  const prompt = `You are an expert travel planner that specializes in uncovering incredible hidden gems.
Generate a ${reqData.days}-day itinerary for ${reqData.destination}.
Budget: ${reqData.budget}.
Interests: ${reqData.interests.join(', ')}.

Ensure that each day contains an array of events with a 'time', 'location', and 'description'.
At least one event per day should be a notable hidden gem where 'isHiddenGem' is true.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are an AI travel agent that outputs strictly structured JSON itineraries." },
      { role: "user", content: prompt },
    ],
    response_format: zodResponseFormat(PlanSchema as any, "itinerary_plan"),
  });

  const content = completion.choices[0].message.content;
  if (!content) {
    throw new Error('Failed to parse the AI generated plan');
  }

  return JSON.parse(content) as ItineraryPlan;
};

router.post('/generate', async (req, res) => {
  try {
    const data: ItineraryRequest = req.body;
    
    if (!data.destination || !data.days || !data.budget || !data.userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const plan = await generatePlanWithAI(data);

    // Save requested itinerary to database
    const newItinerary = await prisma.itinerary.create({
      data: {
        userId: data.userId,
        title: `${data.days} Days in ${data.destination}`,
        destination: data.destination,
        days: data.days,
        budget: data.budget,
        plan: plan as any,
      }
    });

    return res.status(201).json(newItinerary);

  } catch (error) {
    console.error('Error in /generate:', error);
    return res.status(500).json({ error: 'Failed to generate itinerary' });
  }
});

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

const RecommendedDestinationSchema = z.object({
  name: z.string(),
  country: z.string(),
  category: z.string(),
  history: z.string(),
  whyItsGood: z.string(),
  estimatedCost: z.string(),
});

const RecommendationResponseSchema = z.object({
  recommendations: z.array(RecommendedDestinationSchema),
});

router.post('/discover', async (req, res) => {
  try {
    const data: RecommendationRequest = req.body;

    if (!data.budget || !data.days || !data.interests) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const categoryText = data.categoryFilter ? `Specifically focus ONLY on destinations fitting the category: ${data.categoryFilter}.` : '';

    const prompt = `You are a world-class travel advisor. A user wants to travel somewhere in the whole world.
Budget: ${data.budget}
Available Days: ${data.days}
Interests: ${data.interests.join(', ')}
${categoryText}

Provide up to 5 highly recommended destinations.
For each destination, provide a deeply detailed 'history' section explaining the historical context and background of the place, why it's a good fit ('whyItsGood'), an 'estimatedCost', and its 'category'.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an AI travel recommendation engine that outputs strictly structured JSON." },
        { role: "user", content: prompt },
      ],
      response_format: zodResponseFormat(RecommendationResponseSchema as any, "recommendations_plan"),
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('Failed to parse AI recommendation');
    }

    const responseData = JSON.parse(content) as RecommendationResponse;
    return res.status(200).json(responseData);

  } catch (error) {
    console.error('Error in /discover:', error);
    return res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

const NewsItemSchema = z.object({
  headline: z.string(),
  source: z.string(),
});

const DestinationInsightsSchema = z.object({
  dangerLevel: z.enum(['Low', 'Moderate', 'High']),
  safetyAdvice: z.string(),
  news: z.array(NewsItemSchema),
});

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
3. 'news': an array of 2-3 recent or highly notable news headlines regarding this destination (e.g., ticket prices, renovations, political events), along with a plausible 'source'.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an AI travel safety engine that outputs strictly structured JSON." },
        { role: "user", content: prompt },
      ],
      response_format: zodResponseFormat(DestinationInsightsSchema as any, "insights_plan"),
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('Failed to parse AI insights');
    }

    const responseData = JSON.parse(content) as DestinationInsightsResponse;
    return res.status(200).json(responseData);

  } catch (error) {
    console.error('Error in /insights:', error);
    return res.status(500).json({ error: 'Failed to generate destination insights' });
  }
});

export default router;
