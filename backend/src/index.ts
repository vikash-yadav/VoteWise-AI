import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

import apiRoutes from './routes/api';

// Basic health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'VoteWise-AI Backend' });
});

app.use('/api/v1', apiRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
