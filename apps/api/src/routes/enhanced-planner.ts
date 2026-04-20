import { Router } from 'express';
import { PrismaClient } from '@bharatlens/db';
import { askGemini } from '../lib/gemini';
import { getDestinationContext, getUserBehaviorProfile } from '../lib/context';

const router: Router = Router();
const prisma = new PrismaClient();

/**
 * @route POST /api/enhanced-planner/personalized-itinerary
 * @desc HACK-TO-03 specific route for behavior-aware and real-time-aware itineraries.
 */
router.post('/personalized-itinerary', async (req, res) => {
  try {
    const { userId, destination, days, budget, interests } = req.body;

    if (!userId || !destination || !days) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // 1. Fetch Real-time Context (Weather, Crowds)
    const context = await getDestinationContext(destination);
    
    // 2. Fetch User Behavioral Profile (Past Visits)
    const behavior = await getUserBehaviorProfile(userId);

    // 3. Construct the 'Hackathon Special' Prompt
    const prompt = `
      You are the ADVANCED AI ENGINE for BharatLens. Your task is to solve the following problem:
      "Tourists face information overload and lack of personalization. We need a system that analyzes behavior, real-time weather, and crowd density for balanced tourism."

      DATA CONTEXT FOR THIS REQUEST:
      - DESTINATION: ${destination}
      - CURRENT WEATHER: ${context.weather} (${context.temperature})
      - LIVE CROWD DENSITY: ${context.crowdDensity}
      - SPECIAL EVENTS: ${context.specialEvent || 'None'}
      
      USER BEHAVIORAL PROFILE:
      - PREFERRED CATEGORIES (Based on past visits): ${behavior.preferredCategories.join(', ') || 'General'}
      - EXPERTISE LEVEL: ${behavior.expertiseLevel}
      - TOTAL HERITAGE SITES VISITED: ${behavior.totalVisits}
      - LAST VISITED SITE: ${behavior.lastVisitedSite || 'None'}

      USER PREFERENCES:
      - BUDGET: ${budget}
      - INTERESTS: ${interests.join(', ')}
      
      CONSTRAINTS & RULES:
      1. BALANCED TOURISM: Because the crowd density is ${context.crowdDensity}, you MUST allocate at least 40% of the itinerary to 'Hidden Gems' or 'Off-Peak' hours to prevent overcrowding.
      2. REAL-TIME ADAPTATION: Since the weather is ${context.weather}, prioritize indoor sites or early morning outdoor tours as appropriate.
      3. BEHAVIORAL MATCH: Because the user has a preference for ${behavior.preferredCategories.join('/')}, ensure the itinerary skews towards these categories.
      4. GUIDANCE: Add a special 'smartReasoning' field to the root explaining HOW this plan was personalized for them specifically.

      Respond ONLY with valid JSON matching this exact structure:
      {
        "smartReasoning": "Specifically personalized because of...",
        "days": [
          {
            "day": 1,
            "title": "...",
            "events": [
              { "time": "09:00 AM", "location": "...", "description": "...", "isHiddenGem": true, "crowdWaitTime": "15 mins" }
            ]
          }
        ]
      }
    `;

    const plan = await askGemini(prompt);

    return res.status(200).json({
      plan,
      meta: {
        analyzedContext: context,
        userProfile: behavior
      }
    });

  } catch (error) {
    console.error('Error in personalized-itinerary:', error);
    return res.status(500).json({ error: 'Failed to generate enhanced itinerary' });
  }
});

/**
 * @route POST /api/enhanced-planner/balanced-discover
 * @desc Recommendation Engine that explicitly promotes balanced tourism distribution.
 */
router.post('/balanced-discover', async (req, res) => {
  try {
    const { userId, budget, interests } = req.body;

    const behavior = await getUserBehaviorProfile(userId);
    
    const prompt = `
      You are the BALANCED TOURISM ENGINE.
      Task: Recommend 5 Indian destinations. 
      CRITICAL: You MUST include at least 3 "Tier-2" or "Lesser Known" cities to promote balanced tourism distribution away from major hotspots.
      
      User Behavior Analysis:
      - Preferred Site Types: ${behavior.preferredCategories.join(', ')}
      - Expertise: ${behavior.expertiseLevel}
      
      Respond only with JSON:
      {
        "recommendations": [
          { "name": "...", "reasonForRecommendation": "How it promotes balanced tourism...", "isHiddenGem": true }
        ]
      }
    `;

    const recommendations = await askGemini(prompt);
    return res.status(200).json(recommendations);
  } catch (error) {
    return res.status(500).json({ error: 'Balance discovery failed' });
  }
});

export default router;
