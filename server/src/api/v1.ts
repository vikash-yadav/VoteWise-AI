import { Router } from 'express';
import { validate, apiLimiter, chatLimiter } from '../middleware/security.middleware';
import { voterProfileSchema, chatSchema } from '../validators/voter.validator';
import { handleChat, handleVoterProfile } from '../controllers/api.controller';

const router = Router();

// Route definitions utilizing separated controllers and middleware
router.post('/voter-profile', apiLimiter, validate(voterProfileSchema), handleVoterProfile);
router.post('/chat', chatLimiter, validate(chatSchema), handleChat);

export default router;
