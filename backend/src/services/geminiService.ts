import { GoogleGenerativeAI } from '@google/generative-ai';

const ELECTION_SYSTEM_PROMPT = `You are VoteWise AI, a highly intelligent, non-partisan, and helpful civic assistant specialized in Indian elections. 

CORE IDENTITY:
- You are powered by Google Gemini and grounded in verified Election Commission of India (ECI) knowledge.
- You are warm, empathetic, and encouraging. You speak like a knowledgeable friend who cares about democracy.
- You can discuss ANY topic naturally (food, sports, tech, life) to build rapport, but you should gracefully transition back to civic awareness if appropriate.

KNOWLEDGE BASE (ECI Verified):
- Eligibility: Indian citizen, 18+ years (as of Jan 1st of revision year), ordinary resident, not disqualified.
- Registration: Form 6 (New Voters), Form 8 (Correction/Shifting). Apply at voters.eci.gov.in or Voter Helpline App.
- Documents: Photo, Age Proof (Birth Cert, 10th Marks), Address Proof (Aadhaar, Utility bill, Bank passbook).
- Voting: 7 AM - 6 PM. Show EPIC or 12 alternative IDs (Aadhaar, PAN, Passport, DL, MNREGA, etc.).
- Process: Queue → Show ID → Ink finger → Serial slip → EVM voting → VVPAT confirmation → Exit.
- Rules: No phones in booth, no campaigning within 100m, dry day 48h before poll.
- Helpline: 1950. Website: eci.gov.in.

OPERATIONAL RULES:
1. NEUTRALITY: Never recommend a party, candidate, or ideology. If asked "Who should I vote for?", explain that it is a personal decision and help them find candidate profiles instead.
2. PERSONALIZATION: Always use the "User Context" (Name, Constituency, Booth) to make answers relevant. If the user asks "Where do I vote?", use the booth info from their context.
3. LANGUAGE: If the context says language is 'hi', respond in Hindi (Devanagari). If 'en', respond in English. Be fluent and natural in both.
4. AI POWER: Don't give robotic, canned responses. Be creative, informative, and engaging. If a user is frustrated, be helpful and patient.
5. MISINFORMATION: If a user shares a rumor, calmly provide the factual ECI guideline.

CONVERSATIONAL TONE:
- Use "Namaste" or "Greetings".
- Use emojis sparingly but effectively (🗳️, 📍, 🇮🇳).
- Keep responses concise but comprehensive.`;

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || '';
    if (!apiKey) {
      console.warn('[GeminiService] WARNING: GEMINI_API_KEY is not set.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async chat(userMessage: string, userContext: any, history: ChatMessage[] = []): Promise<string> {
    if (!process.env.GEMINI_API_KEY) {
      return this.fallbackResponse(userMessage);
    }

    try {
      const lang = userContext?.language || 'en';
      const langInstruction = lang === 'hi' 
        ? "\n\nCRITICAL: The user has selected HINDI. You MUST respond entirely in HINDI (Devanagari script). Use natural, polite Hindi." 
        : "\n\nRespond in natural English.";

      const contextData = userContext ? `
USER CONTEXT:
- Name: ${userContext.name || 'Citizen'}
- State: ${userContext.state || 'N/A'}
- Constituency: ${userContext.constituency || 'N/A'}
- Assembly: ${userContext.assemblyConstituency || 'N/A'}
- Booth: ${userContext.boothName || 'N/A'}
- Booth Address: ${userContext.boothAddress || 'N/A'}
` : '';

      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        systemInstruction: {
          role: 'user',
          parts: [{ text: ELECTION_SYSTEM_PROMPT + contextData + langInstruction }]
        }
      });

      // Maintain history for multi-turn chat
      const chat = model.startChat({
        history: history.length > 0 ? history : [
          { role: 'user', parts: [{ text: 'Hello' }] },
          { role: 'model', parts: [{ text: lang === 'hi' ? 'नमस्ते! मैं VoteWise AI हूँ। मैं आपकी कैसे मदद कर सकता हूँ?' : 'Namaste! I am VoteWise AI. How can I assist you today?' }] }
        ]
      });

      const result = await chat.sendMessage(userMessage);
      const response = result.response;
      return response.text();
    } catch (error: any) {
      console.error('[GeminiService] AI Error:', error.message);
      return this.fallbackResponse(userMessage);
    }
  }

  private fallbackResponse(query: string): string {
    const q = query.toLowerCase();
    if (q.includes('register') || q.includes('form 6')) {
      return "To register, visit **voters.eci.gov.in** or use the **Voter Helpline App**. You will need a photo, age proof, and address proof. Helpline: **1950**.";
    }
    if (q.includes('eligible') || q.includes('age')) {
      return "You are eligible if you are an **Indian citizen**, **18+ years old**, and a resident of your constituency. Register at voters.eci.gov.in.";
    }
    if (q.includes('booth') || q.includes('where')) {
      return "You can find your polling booth on your **Voter Slip** or by checking the electoral roll at **voters.eci.gov.in**. Don't forget to carry your ID!";
    }
    return "I am currently having trouble connecting to my AI brain. Please check your internet or try again in a moment. You can always call **1950** for official ECI help!";
  }
}
