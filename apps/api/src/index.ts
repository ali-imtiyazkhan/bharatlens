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

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*', // In production, restrict to your frontend URL
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

  socket.on('send_message', (data) => {
    // data: { receiverId, text, senderId }
    io.to(data.receiverId).emit('receive_message', data);
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

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} (HTTP + WebSockets)`);
});
