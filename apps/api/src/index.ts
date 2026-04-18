import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import plannerRoutes from './routes/planner';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/planner', plannerRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
