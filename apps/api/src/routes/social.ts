import { Router } from 'express';
import prisma from '../lib/prisma';

const router: Router = Router();

// POST /api/social/follow/:username
router.post('/follow/:username', async (req, res) => {
  const { username } = req.params;
  const { currentUserId } = req.body; // In a real app, this would be from JWT

  if (!currentUserId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const targetUser = await prisma.user.findUnique({ where: { username } });
    if (!targetUser) return res.status(404).json({ error: 'User not found' });

    const currentUser = await prisma.user.findUnique({ where: { id: currentUserId } });
    if (!currentUser) return res.status(401).json({ error: 'Current user not found in database. Please re-login.' });

    await prisma.user.update({
      where: { id: currentUserId },
      data: {
        following: {
          connect: { id: targetUser.id }
        }
      }
    });

    return res.status(200).json({ success: true, message: `Followed ${username}` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to follow' });
  }
});

// POST /api/social/unfollow/:username
router.post('/unfollow/:username', async (req, res) => {
  const { username } = req.params;
  const { currentUserId } = req.body;

  if (!currentUserId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const targetUser = await prisma.user.findUnique({ where: { username } });
    if (!targetUser) return res.status(404).json({ error: 'User not found' });

    const currentUser = await prisma.user.findUnique({ where: { id: currentUserId } });
    if (!currentUser) return res.status(401).json({ error: 'Current user not found' });

    await prisma.user.update({
      where: { id: currentUserId },
      data: {
        following: {
          disconnect: { id: targetUser.id }
        }
      }
    });

    return res.status(200).json({ success: true, message: `Unfollowed ${username}` });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to unfollow' });
  }
});

// POST /api/social/star/:username
router.post('/star/:username', async (req, res) => {
  const { username } = req.params;
  const { currentUserId } = req.body;

  if (!currentUserId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const targetUser = await prisma.user.findUnique({ where: { username } });
    if (!targetUser) return res.status(404).json({ error: 'User not found' });

    // Check if already starred
    const existingStar = await prisma.star.findFirst({
      where: {
        giverId: currentUserId,
        receiverId: targetUser.id
      }
    });

    if (existingStar) {
      return res.status(400).json({ error: 'Already starred this profile' });
    }

    await prisma.star.create({
      data: {
        giverId: currentUserId,
        receiverId: targetUser.id
      }
    });

    return res.status(200).json({ success: true, message: `Starred ${username}'s profile` });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to give star' });
  }
});

// GET /api/social/discover
router.get('/discover', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      take: 10,
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        city: true,
        _count: {
          select: {
            followers: true,
            starsReceived: true,
            visits: true
          }
        }
      }
    });

    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch discovery list' });
  }
});

export default router;
