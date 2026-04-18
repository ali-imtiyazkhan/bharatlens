import { Router } from 'express';
import prisma from '../lib/prisma';

const router: Router = Router();

// GET /api/chat/inbox/:userId
router.get('/inbox/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    // Find unique conversations by looking at messages where user is sender or receiver
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }]
      },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { id: true, name: true, username: true, avatarUrl: true } },
        receiver: { select: { id: true, name: true, username: true, avatarUrl: true } }
      }
    });

    // Grouping by "other user" to created an inbox list
    const conversationsMap = new Map();
    messages.forEach(msg => {
      const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
      if (!conversationsMap.has(otherUser.id)) {
        conversationsMap.set(otherUser.id, {
          user: otherUser,
          lastMessage: msg.text,
          timestamp: msg.createdAt
        });
      }
    });

    return res.json(Array.from(conversationsMap.values()));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch inbox' });
  }
});

// GET /api/chat/history?me=id1&other=id2
router.get('/history', async (req, res) => {
  const { me, other } = req.query;
  if (!me || !other) return res.status(400).json({ error: 'Missing user IDs' });

  try {
    const history = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: me as string, receiverId: other as string },
          { senderId: other as string, receiverId: me as string }
        ]
      },
      orderBy: { createdAt: 'asc' }
    });
    return res.json(history);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// POST /api/chat/send
router.post('/send', async (req, res) => {
  const { senderId, receiverId, text } = req.body;
  if (!senderId || !receiverId || !text) return res.status(400).json({ error: 'Missing data' });

  try {
    const message = await prisma.message.create({
      data: { senderId, receiverId, text }
    });
    return res.status(201).json(message);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
