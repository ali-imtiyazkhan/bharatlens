import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import plannerRoutes from './routes/planner';
import authRoutes from './routes/auth';
import exploreRoutes from './routes/explore';
import heritageRoutes from './routes/heritage';
import archiveRoutes from './routes/archive';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api/explore', exploreRoutes);
app.use('/api/heritage', heritageRoutes);
app.use('/api/archive', archiveRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
