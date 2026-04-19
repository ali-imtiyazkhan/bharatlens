import { Router } from 'express';
import prisma from '../lib/prisma';

const router: Router = Router();

router.get('/stats/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        badges: true,
        _count: {
          select: { visits: true }
        }
      }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const visitXP = user._count.visits * 100;
    const badgeXP = user.badges.length * 50;
    const totalXP = (user as any).xp || (visitXP + badgeXP); 
    const tokens = Math.floor(totalXP / 10);

    return res.status(200).json({
      tokens,
      spent: 1400, // Mock for now
      xp: totalXP,
      level: totalXP > 5000 ? 'Grandmaster' : totalXP > 2000 ? 'Historian' : 'Explorer',
      badges: user.badges
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch rewards' });
  }
});

router.get('/leaderboard', async (req, res) => {
  try {
    const topUsers = await prisma.user.findMany({
      take: 10,
      include: {
        _count: {
          select: { visits: true }
        }
      }
    });

    const leaderboard = topUsers.map((u, idx) => ({
      rank: idx + 1,
      name: u.name || u.username,
      points: (u as any).xp || (u._count.visits * 100),
      level: ((u as any).xp || (u._count.visits * 100)) > 2000 ? 'Historian' : 'Explorer'
    }));

    return res.status(200).json({ leaderboard });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

export default router;
