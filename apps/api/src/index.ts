import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server } from 'socket.io';
import plannerRoutes from './routes/planner';
import authRoutes from './routes/auth';
import exploreRoutes from './routes/explore';
import heritageRoutes from './routes/heritage';
import archiveRoutes from './routes/archive';
import profileRoutes from './routes/profile';
import visitsRoutes from './routes/visits';
import starsRoutes from './routes/stars';
import socialRoutes from './routes/social';
import journeyRoutes from './routes/journey';
import narrationRoutes from './routes/narration';
import rewardsRoutes from './routes/rewards';
import chatRoutes from './routes/chat';
import communityRoutes from './routes/communities';
import enhancedPlannerRoutes from './routes/enhanced-planner';

const app = express();

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://bharatlens-web.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean) as string[];

app.use(cors({
  origin: ALLOWED_ORIGINS.length > 0 ? ALLOWED_ORIGINS : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(helmet());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ALLOWED_ORIGINS.length > 0 ? ALLOWED_ORIGINS : '*',
    methods: ['GET', 'POST']
  }
});

// Socket.io context
io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    socket.join(userId.toString());
    console.log(`User ${userId} connected for real-time chat`);
  }

  // Private DM
  socket.on('send_message', (data) => {
    io.to(data.receiverId).emit('receive_message', data);
  });

  // Community group chat
  socket.on('join_community', (communityId: string) => {
    socket.join(`community:${communityId}`);
    console.log(`User ${userId} joined community room ${communityId}`);
  });

  socket.on('leave_community', (communityId: string) => {
    socket.leave(`community:${communityId}`);
  });

  socket.on('community_message', (data) => {
    // Broadcast to everyone in the community room (including sender)
    io.to(`community:${data.communityId}`).emit('new_community_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected from chat');
  });
});

const PORT = process.env.PORT || 3001;

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api/explore', exploreRoutes);
app.use('/api/heritage', heritageRoutes);
app.use('/api/archive', archiveRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/visits', visitsRoutes);
app.use('/api/stars', starsRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/journey', journeyRoutes);
app.use('/api/narration', narrationRoutes);
app.use('/api/rewards', rewardsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/enhanced-planner', enhancedPlannerRoutes);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} (HTTP + WebSockets)`);
});
