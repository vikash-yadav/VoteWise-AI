import { Request, Response, NextFunction } from 'express';
import { GeminiService } from '../services/geminiService';
import { VoterProfileService } from '../services/voterProfileService';
import { AppError } from '../middleware/errorHandler';

const geminiService = new GeminiService();
const profileService = new VoterProfileService();

/**
 * Handles chat requests and routes them to the AI service.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next function.
 */
export const handleChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { message, history, userContext } = req.body;
    
    if (!message) {
      throw new AppError('Message is required', 400);
    }

    const response = await geminiService.chat(message, userContext, history);
    res.status(200).json({ success: true, response });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves or initializes a voter profile.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next function.
 */
export const handleVoterProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { uid, displayName, email } = req.body;
    
    if (!uid) {
      throw new AppError('User ID (uid) is required', 400);
    }

    const profile = await profileService.getProfile(uid, displayName || 'Citizen', email || '');
    res.status(200).json({ success: true, profile });
  } catch (error) {
    next(error);
  }
};
