import request from 'supertest';
import express from 'express';
import v1Routes from '../../api/v1';
import { errorHandler } from '../../middleware/errorHandler';

// Mock dependencies
jest.mock('../../services/geminiService', () => {
  return {
    GeminiService: jest.fn().mockImplementation(() => ({
      chat: jest.fn().mockResolvedValue('Mocked AI response')
    }))
  };
});

const app = express();
app.use(express.json());
app.use('/api/v1', v1Routes);
app.use(errorHandler);

describe('Integration Tests: /api/v1/chat', () => {
  it('should successfully process a chat message and return 200', async () => {
    const response = await request(app)
      .post('/api/v1/chat')
      .send({
        message: 'How do I register to vote?',
        history: [],
        userContext: { language: 'en' }
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.response).toBe('Mocked AI response');
  });

  it('should fail with 400 if message is missing', async () => {
    const response = await request(app)
      .post('/api/v1/chat')
      .send({
        history: []
      });

    expect(response.status).toBe(400); // Triggered by validator
    expect(response.body.success).toBe(false);
  });
});
