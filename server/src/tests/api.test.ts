import request from 'supertest';
import app from '../index';

describe('VoteWise AI API Endpoints', () => {
  describe('POST /api/v1/voter-profile', () => {
    it('should return 400 if uid is missing', async () => {
      const res = await request(app)
        .post('/api/v1/voter-profile')
        .send({ displayName: 'Test User' });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    });

    it('should return profile data for valid input', async () => {
      const res = await request(app)
        .post('/api/v1/voter-profile')
        .send({ uid: 'test-123', displayName: 'Test User' });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.profile.voterName).toBe('Test User');
    });
  });

  describe('POST /api/v1/chat', () => {
    it('should return 400 for empty message', async () => {
      const res = await request(app)
        .post('/api/v1/chat')
        .send({ message: '' });
      
      expect(res.statusCode).toEqual(400);
    });
  });
});
