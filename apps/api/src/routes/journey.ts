import { Router } from 'express';
import { askGemini } from '../lib/gemini';

const router: Router = Router();

router.post('/generate', async (req, res) => {
  try {
    const { from, to } = req.body;

    if (!from || !to) {
      return res.status(400).json({ error: 'Missing origin or destination' });
    }

    const prompt = `You are an expert Indian travel logistics advisor specializing in budget-friendly, safe, and efficient transportation.
The user wants to travel from "${from}" to "${to}".

Generate a step-by-step "Insider Journey" including:
1. Specific transport modes (Train, Bus, Auto, Tempo, Walking).
2. Estimated costs in INR (e.g., "₹150").
3. "Scam Shield" advice for transport hubs (how to avoid overcharging, which gates to use).
4. Local tips (e.g., specific lounge locations, shared transport lines).

Structure:
Return ONLY a JSON object with a "steps" array. Each step MUST have:
- type: one of ['transit_hub', 'intercity', 'local', 'destination']
- title: concise name of the location or transport
- time: approximate relative time (e.g., "08:00 AM" or "Start")
- duration: e.g., "2h 30m" (optional)
- details: 1-2 sentences of specific instructions
- cost: e.g., "₹200" or "Free"
- hasBooking: boolean (true if intercity train/bus)
- bookingUrl: placeholder (e.g., https://www.irctc.co.in/)
- crowd: ['Low', 'Moderate', 'High'] (optional)
- crowdColor: Hex color matching crowd (Low: #4ade80, Moderate: #facc15, High: #f87171)
- scamShield: Specific advice on how to avoid being scammed at this step (optional)
- warning: Short warning text (optional)
- tip: A "Local Genius" secret for this step.

Example:
{
  "steps": [
    {
      "type": "transit_hub",
      "title": "New Delhi Station",
      "time": "09:00 AM",
      "details": "Enter from Ajmeri Gate side for less crowd.",
      "cost": "₹0",
      "tip": "Use the IRCTC lounge on Platform 16 for clean restrooms."
    }
  ]
}

Respond ONLY with valid JSON. No markdown. No explanation.`;

    const data = await askGemini(prompt);
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in /journey/generate:', error);
    return res.status(500).json({ error: 'Failed to generate journey' });
  }
});

export default router;
