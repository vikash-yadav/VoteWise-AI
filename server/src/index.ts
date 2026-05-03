import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import v1Routes from './api/v1';

const app = express();
const port = process.env.PORT || 3001;

// 1. Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST'],
}));
app.use(express.json({ limit: '10kb' })); // Body limit to prevent DoS

// 2. Routes
app.use('/api/v1', v1Routes);

import { errorHandler } from './middleware/errorHandler';

// 3. Global Error Handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`🚀 VoteWise AI Server running on port ${port}`);
});

export default app; // For testing
