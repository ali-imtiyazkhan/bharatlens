import { Router } from 'express';
import prisma from '../lib/prisma';

const router: Router = Router();

// POST /api/visits
router.post('/', async (req, res) => {
  try {
    const { userId, heritageId, photos, caption, isPublic } = req.body;
    const newVisit = await prisma.visit.create({
      data: {
        userId,
        heritageId,
        photos: photos || [],
        caption,
        isPublic: isPublic ?? true,
      }
    });
    return res.status(201).json({ id: newVisit.id, message: 'Visit logged successfully', earnedPoints: 50 });
  } catch (error) {
    console.error('Error logging visit:', error);
    return res.status(500).json({ error: 'Failed to log visit' });
  }
});

// GET /api/visits/:username
router.get('/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const visits = await prisma.visit.findMany({
      where: {
        userId: user.id,
        isPublic: true
      },
      include: {
        heritage: {
          select: {
            name: true,
            city: true
          }
        }
      },
      orderBy: { visitedAt: 'desc' }
    });

    // Adapt to frontend map
    const feed = visits.map(v => ({
      id: v.id,
      monumentName: v.heritage.name,
      monumentCity: v.heritage.city,
      visitedAt: v.visitedAt,
      photos: v.photos,
      audioStoryUrl: v.audioStoryUrl,
      caption: v.caption,
      stars: 0 // Mocked for now
    }));

    return res.status(200).json(feed);
  } catch (error) {
    console.error('Error fetching visits:', error);
    return res.status(500).json({ error: 'Failed to fetch visits' });
  }
});

export default router;
