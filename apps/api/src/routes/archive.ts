import { Router } from 'express';
import prisma from '../lib/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router: Router = Router();
const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

router.get('/list', async (req, res) => {
  try {
    const stories = await prisma.archiveStory.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } }
    });
    return res.json(stories);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch archive' });
  }
});

router.post('/process', async (req, res) => {
  const { transcript, language, location } = req.body;
  
  if (!transcript) return res.status(400).json({ error: 'Missing transcript' });

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    
    const prompt = `
      You are an AI heritage researcher. I have a raw oral history transcript in ${language || 'a local Indian language'} recorded at ${location || 'a heritage site'}.
      
      RAW TRANSCRIPT: "${transcript}"
      
      Perform the following:
      1. Translate it to clear, evocative English.
      2. Identify the likely historic ERA being discussed (e.g., 1950s, Colonial, Post-Independence).
      3. Identify the CATEGORY (e.g., Eyewitness account, Folklore, Craft Knowledge).
      4. Create a compelling TITLE (max 6 words).
      
      Respond ONLY with valid JSON:
      {
        "translation": "English text here...",
        "era": "Era name",
        "category": "Category name",
        "title": "Story Title",
        "language": "${language || 'Unknown'}"
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const data = JSON.parse(cleaned);

    return res.json(data);
  } catch (error) {
    console.error('AI Processing Error:', error);
    // Fallback if AI fails
    return res.json({
      translation: transcript,
      era: "Modern Era",
      category: "Oral History",
      title: "Untold Story of " + (location || "Heritage"),
      language: language || "Unknown"
    });
  }
});

// POST /api/archive/submit
router.post('/submit', async (req, res) => {
  const { aideId, authorName, authorAge, siteName, resultData } = req.body;

  if (!aideId || !authorName || !resultData) {
    return res.status(400).json({ error: 'Missing submission data' });
  }

  try {
    // 1. Create the Archive Story
    const story = await prisma.archiveStory.create({
      data: {
        title: resultData.title,
        transcript: resultData.translation,
        authorName,
        authorAge: parseInt(authorAge),
        siteName: siteName || resultData.location || "Unknown Site",
        era: resultData.era,
        category: resultData.category,
        language: resultData.language,
        userId: aideId,
        pointsEarned: 70
      }
    });

    await prisma.user.update({
      where: { id: aideId },
      data: { tokens: { increment: 70 } }
    });

    return res.status(201).json({ success: true, story });
  } catch (error) {
    console.error('Submission Error:', error);
    return res.status(500).json({ error: 'Failed to archive story' });
  }
});

export default router;
