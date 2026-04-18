import { Router } from 'express';
import prisma from '../lib/prisma';

const router: Router = Router();

// GET /api/profile/:username
router.get('/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        badges: true,
        highlights: {
          include: {
             _count: {
               select: { visits: true }
             }
          }
        },
        _count: {
          select: {
            starsReceived: true,
            visits: true,
            followers: true,
            following: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Adapt to the expected frontend structure
    const profile = {
      ...user,
      totalStars: user._count.starsReceived,
      totalVisits: user._count.visits,
      followersCount: user._count.followers,
      followingCount: user._count.following,
      highlights: user.highlights.map(h => ({
        id: h.id,
        title: h.title,
        coverImageUrl: h.coverImageUrl,
        visitCount: h._count.visits
      })),
      isStarredByMe: false, // Would require auth check
    };

    return res.status(200).json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.put('/me', async (req, res) => {
  try {
    const { displayName, bio, city } = req.body;
    
    // In a real app, get this from auth middleware
    // For now, we'll try to find the user by a placeholder ID or just update the first one if it's a demo
    const user = await prisma.user.findFirst(); 
    if (!user) return res.status(404).json({ error: 'User not found' });

    await prisma.user.update({
      where: { id: user.id },
      data: { displayName, bio, city }
    });

    return res.status(200).json({ success: true, message: "Profile updated" });
  } catch (error) {
    console.error('Update failed:', error);
    return res.status(500).json({ error: 'Update failed' });
  }
});

// GET /api/profile/:username/stats
router.get('/:username/stats', async (req, res) => {
  const { username } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        _count: {
          select: {
            starsReceived: true,
            visits: true
          }
        }
      }
    });
    if (!user) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({
      totalStars: user._count.starsReceived,
      totalVisits: user._count.visits
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed' });
  }
});

export default router;
