import { GoogleGenerativeAI } from '@google/generative-ai';
import { aiCache } from '../utils/cache';
import { AI_CONFIG, ERROR_MESSAGES } from '../config/constants';

interface ChatContext {
  userId?: string;
  language?: string;
  [key: string]: any;
}

interface ChatHistory {
  role: string;
  content?: string;
  parts?: Array<{ text: string }> | string;
}

/**
 * Service for interacting with Google's Gemini AI.
 * Handles chat generation, caching, fallback logic, and prompt injection safety.
 */
export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const key = process.env.GEMINI_API_KEY || '';
    if (!key) {
      console.warn('[GeminiService] Warning: GEMINI_API_KEY is missing from environment variables.');
    }
    this.genAI = new GoogleGenerativeAI(key);
  }

  /**
   * Processes a user chat message through Gemini AI.
   * Includes prompt injection detection and automatic caching.
   *
   * @param {string} message - The user's input message.
   * @param {ChatContext} context - User context, including language and user ID.
   * @param {ChatHistory[]} history - Previous chat history for context.
   * @returns {Promise<string>} The AI's generated response.
   */
  async chat(message: string, context: ChatContext = {}, history: ChatHistory[] = []): Promise<string> {
    if (this.isPotentialInjection(message)) {
      return ERROR_MESSAGES.PROMPT_INJECTION;
    }

    try {
      const userId = context?.userId || 'anonymous';
      const cacheKey = `chat_${userId}_${message.substring(0, 20)}`;
      const cachedResponse = aiCache.get(cacheKey);
      
      if (cachedResponse) {
        return cachedResponse;
      }

      const model = this.genAI.getGenerativeModel({ 
        model: AI_CONFIG.DEFAULT_MODEL,
        systemInstruction: `${AI_CONFIG.SYSTEM_INSTRUCTION}\nUser Language: ${context.language || 'en'}`
      });

      const formattedHistory = this.formatHistory(history);
      const chat = model.startChat({ history: formattedHistory });
      
      const result = await chat.sendMessage(message);
      const response = result.response.text();

      aiCache.set(cacheKey, response);
      return response;

    } catch (error: any) {
      return await this.handleAIError(error, message);
    }
  }

  /**
   * Formats raw history into the strict schema expected by Gemini SDK.
   * @param {ChatHistory[]} history - Raw chat history.
   * @returns {any[]} Formatted history array.
   */
  private formatHistory(history: ChatHistory[]): any[] {
    return (history || []).map(h => ({
      role: h.role === 'assistant' || h.role === 'model' ? 'model' : 'user',
      parts: [{ text: h.content || (typeof h.parts === 'string' ? h.parts : h.parts?.[0]?.text) || '' }]
    }));
  }

  /**
   * Checks the user input against dangerous regex patterns to prevent prompt injection.
   * @param {string} input - User message to evaluate.
   * @returns {boolean} True if malicious patterns are detected.
   */
  private isPotentialInjection(input: string): boolean {
    return AI_CONFIG.DANGEROUS_PATTERNS.some(pattern => pattern.test(input));
  }

  /**
   * Centralized error handler for AI generation failures.
   * Implements fallback model routing and user-friendly error translation.
   * 
   * @param {any} error - The caught error object.
   * @param {string} message - The original user message for fallback retry.
   * @returns {Promise<string>} User-friendly error message or fallback response.
   */
  private async handleAIError(error: any, message: string): Promise<string> {
    console.error('[GeminiService] Error details:', error.message || error);
    
    if (error.message?.includes('API_KEY_INVALID')) {
      return ERROR_MESSAGES.API_KEY_INVALID;
    }
    
    if (error.status === 429) {
      return ERROR_MESSAGES.QUOTA_EXCEEDED;
    }
    
    if (error.status === 404) {
      try {
        console.log(`[GeminiService] 404 encountered for ${AI_CONFIG.DEFAULT_MODEL}, falling back to ${AI_CONFIG.FALLBACK_MODEL}...`);
        const fallbackModel = this.genAI.getGenerativeModel({ model: AI_CONFIG.FALLBACK_MODEL });
        const result = await fallbackModel.generateContent(message);
        return result.response.text();
      } catch (fallbackError) {
        return ERROR_MESSAGES.MODEL_UNAVAILABLE;
      }
    }

    return ERROR_MESSAGES.GENERAL_AI_FAILURE;
  }
}
