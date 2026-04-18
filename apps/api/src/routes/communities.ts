import { Router } from 'express';
import prisma from '../lib/prisma';

const router: Router = Router();

// GET /api/communities/discover
router.get('/discover', async (req, res) => {
  try {
    const communities = await prisma.community.findMany({
      include: {
        _count: { select: { members: true } },
        members: { select: { userId: true } }
      }
    });
    return res.json(communities);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch communities' });
  }
});

router.post('/create', async (req, res) => {
  const { name, description, interest, creatorId } = req.body;
  try {
    const community = await prisma.community.create({
      data: {
        name,
        description,
        interest,
        creatorId,
        members: {
          create: { userId: creatorId, role: 'CREATOR' }
        }
      }
    });
    return res.status(201).json(community);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create community' });
  }
});

// POST /api/communities/request-join
router.post('/request-join', async (req, res) => {
  const { userId, communityId, message } = req.body;
  try {
    const request = await prisma.joinRequest.create({
      data: { userId, communityId, message }
    });
    return res.status(201).json(request);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to send join request' });
  }
});

// GET /api/communities/requests/:communityId
router.get('/requests/:communityId', async (req, res) => {
  const { communityId } = req.params;
  try {
    const requests = await prisma.joinRequest.findMany({
      where: { communityId, status: 'PENDING' },
      include: { user: { select: { id: true, name: true, avatarUrl: true } } }
    });
    return res.json(requests);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// POST /api/communities/manage-request
router.post('/manage-request', async (req, res) => {
  const { requestId, status } = req.body; // status: APPROVED or REJECTED
  try {
    const request = await prisma.joinRequest.update({
      where: { id: requestId },
      data: { status },
      include: { community: true }
    });

    if (status === 'APPROVED') {
      await prisma.communityMember.create({
        data: {
          userId: request.userId,
          communityId: request.communityId,
          role: 'MEMBER'
        }
      });
    }

    return res.json({ success: true, message: `Request ${status.toLowerCase()}` });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to manage request' });
  }
});

// GET /api/communities/:id - Get single community details
router.get('/:id', async (req, res) => {
  try {
    const community = await prisma.community.findUnique({
      where: { id: req.params.id },
      include: {
        _count: { select: { members: true } },
        members: { include: { user: { select: { id: true, name: true, username: true, avatarUrl: true } } } }
      }
    });
    if (!community) return res.status(404).json({ error: 'Community not found' });
    return res.json(community);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch community' });
  }
});

// GET /api/communities/:id/messages - Get community chat history
router.get('/:id/messages', async (req, res) => {
  try {
    const messages = await prisma.communityMessage.findMany({
      where: { communityId: req.params.id },
      include: { user: { select: { id: true, name: true, username: true, avatarUrl: true } } },
      orderBy: { createdAt: 'asc' },
      take: 100
    });
    return res.json(messages);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// POST /api/communities/:id/messages - Send a message in a community
router.post('/:id/messages', async (req, res) => {
  const { userId, text } = req.body;
  if (!userId || !text) return res.status(400).json({ error: 'Missing userId or text' });

  try {
    const message = await prisma.communityMessage.create({
      data: { text, userId, communityId: req.params.id },
      include: { user: { select: { id: true, name: true, username: true, avatarUrl: true } } }
    });
    return res.status(201).json(message);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
