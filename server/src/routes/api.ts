import { Router, Request, Response } from 'express';
import { EligibilityEngine } from '../services/eligibilityEngine';
import { GeminiService } from '../services/geminiService';
import { VoterProfileService } from '../services/voterProfileService';

const router = Router();
const eligibilityEngine = new EligibilityEngine();
const geminiService = new GeminiService();
const voterProfileService = new VoterProfileService();

// AI Chat endpoint - powered by Gemini
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, userId, userContext, history } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ success: false, error: 'Message is required' });
      return;
    }

    const botResponse = await geminiService.chat(message, userContext, history || []);

    res.json({
      success: true,
      response: botResponse,
      source: 'VoteWise AI (Gemini + ECI Knowledge Base)'
    });
  } catch (error) {
    console.error('[Chat] Error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Eligibility check endpoint
router.post('/eligibility', (req: Request, res: Response) => {
  const { age, isCitizen, isResident, hasDisqualification } = req.body;
  const result = eligibilityEngine.evaluateEligibility(age, isCitizen, isResident);
  res.json({ success: true, data: result });
});

// Timeline endpoint - election schedule data
router.get('/timeline', (req: Request, res: Response) => {
  const timeline = [
    {
      id: 1,
      title: 'Preparation Phase',
      date: 'TBD',
      description: 'ECI starts updating rolls and checking polling infrastructures.',
      status: 'completed',
      icon: 'check'
    },
    {
      id: 2,
      title: 'Electoral Roll Revision',
      date: 'TBD',
      description: 'Final chance to add/update your name in the voter list via Form 6.',
      status: 'active',
      icon: 'clock'
    },
    {
      id: 3,
      title: 'Registration Deadline',
      date: '16 MAY 2026',
      description: 'Last date to submit registration for the final phase.',
      status: 'upcoming',
      icon: 'calendar'
    },
    {
      id: 4,
      title: 'Election Day',
      date: '1 JUNE 2026',
      description: 'Polling stations will be open from 7:00 AM to 6:00 PM.',
      status: 'upcoming',
      icon: 'calendar'
    }
  ];

  res.json({ success: true, data: timeline });
});

// Checklist endpoint - document verification status
router.get('/checklist/:userId', (req: Request, res: Response) => {
  // In production, this would be fetched from a database
  const checklist = {
    documents: [
      { id: 'epic', name: 'EPIC Card (Voter ID)', type: 'MANDATORY', status: 'verified' },
      { id: 'aadhaar', name: 'Aadhaar Card', type: 'SUPPORTING DOC', status: 'pending' },
      { id: 'pan', name: 'PAN Card', type: 'SUPPORTING DOC', status: 'pending' },
      { id: 'passport', name: 'Passport', type: 'SUPPORTING DOC', status: 'pending' }
    ],
    boothReadiness: {
      boothName: 'Kendriya Vidyalaya No. 2, RK Puram',
      locationReady: false,
      voterSlipDownloaded: false
    },
    overallReady: false
  };

  res.json({ success: true, data: checklist });
});

// Dashboard summary endpoint
router.get('/dashboard/:userId', (req: Request, res: Response) => {
  const dashboard = {
    journey: {
      steps: [
        { name: 'Check Eligibility', status: 'pending', progress: 60 },
        { name: 'Voter Registration', status: 'verified', progress: 100 },
        { name: 'Document Verification', status: 'pending', progress: 0 },
        { name: 'Vote', status: 'pending', progress: 0 }
      ]
    },
    constituency: {
      name: 'South Delhi (LS-07)',
      votingDate: '1 June 2026',
      boothInfo: 'KV No.2, RK Puram',
      liveTimeline: [
        { event: 'Registration Open', detail: 'Apply by May 15', status: 'active' },
        { event: 'Verification Phase', detail: 'Active in your constituency', status: 'warning' }
      ]
    },
    countdown: {
      daysRemaining: Math.max(0, Math.ceil((new Date('2026-06-01').getTime() - Date.now()) / (1000 * 60 * 60 * 24))),
      electionDate: '1 June 2026'
    },
    docsChecklist: [
      { name: 'Aadhaar Card', status: 'linked' },
      { name: 'Photograph', status: 'uploaded' },
      { name: 'Proof of Address', status: 'needed' }
    ]
  };

  res.json({ success: true, data: dashboard });
});

// Voter profile endpoint - returns voter status, booth info, and map URLs
router.post('/voter-profile', (req: Request, res: Response) => {
  try {
    const { uid, displayName, email } = req.body;

    if (!uid) {
      res.status(400).json({ success: false, error: 'User UID is required' });
      return;
    }

    const profile = voterProfileService.getProfile(uid, displayName || 'Citizen', email || '');
    const booth = profile.pollingBooth;

    // Generate map URLs
    const navigationUrl = voterProfileService.getBoothNavigationUrl(booth.lat, booth.lng, booth.name);
    const embedUrl = voterProfileService.getBoothMapEmbedUrl(booth.lat, booth.lng, booth.name);

    // Verify voter
    const verification = voterProfileService.verifyStatus(profile.epicNumber);

    res.json({
      success: true,
      data: {
        ...profile,
        verification,
        maps: {
          navigationUrl,
          embedUrl,
          lat: booth.lat,
          lng: booth.lng
        }
      }
    });
  } catch (error) {
    console.error('[VoterProfile] Error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch voter profile' });
  }
});

export default router;
