import { Router } from 'express';
import prisma from '../lib/prisma';

const router: Router = Router();

// POST /api/stars/:username
router.post('/:username', async (req, res) => {
  const { username } = req.params;
  const { giverId } = req.body; // In production this comes from JWT
  try {
    const receiver = await prisma.user.findUnique({ where: { username } });
    if (!receiver) return res.status(404).json({ error: 'Receiver not found' });

    await prisma.star.upsert({
      where: {
        giverId_receiverId: {
          giverId,
          receiverId: receiver.id
        }
      },
      create: {
        giverId,
        receiverId: receiver.id
      },
      update: {} // No change on update
    });

    return res.status(200).json({ success: true, message: 'Star added' });
  } catch (error) {
    console.error('Error adding star:', error);
    return res.status(500).json({ error: 'Failed to add star' });
  }
});

// GET /api/stars/:username/givers
router.get('/:username/givers', async (req, res) => {
  const { username } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        starsReceived: {
          include: {
            giver: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true
              }
            }
          }
        }
      }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const givers = user.starsReceived.map(s => s.giver);
    return res.status(200).json(givers);
  } catch (err) {
    return res.status(500).json({ error: 'Failed' });
  }
});

export default router;
