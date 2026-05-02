import { Router } from 'express';
import { validate, apiLimiter, chatLimiter } from '../middleware/security.middleware';
import { voterProfileSchema, chatSchema } from '../validators/voter.validator';
import { VoterProfileService } from '../services/voterProfileService';
import { GeminiService } from '../services/geminiService';

const router = Router();
const profileService = new VoterProfileService();
const geminiService = new GeminiService();

router.post('/voter-profile', apiLimiter, validate(voterProfileSchema), async (req, res) => {
  try {
    const { uid, displayName, email } = req.body;
    const profile = await profileService.getProfile(uid, displayName || 'Citizen', email || '');
    res.json({ success: true, profile });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/chat', chatLimiter, validate(chatSchema), async (req, res) => {
  const { message, history, userContext } = req.body;
  try {
    const response = await geminiService.chat(message, userContext, history);
    res.json({ success: true, response });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
