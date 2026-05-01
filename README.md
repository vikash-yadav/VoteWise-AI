# VoteWise AI

VoteWise AI is a production-grade, intelligent, multilingual civic assistant that helps users in India understand and complete their entire voting journey from eligibility to election day.

## Features
- **Conversational AI Assistant:** Guides voters step-by-step.
- **Journey Tracker:** Persists user progress across Eligibility, Registration, Verification, and Election Day readiness.
- **RAG-based Grounding:** Responses are grounded in official guidelines using Google Vertex AI Search.
- **Event-Driven Reminders:** Intelligent nudge system for upcoming deadlines.

## Project Structure
```
VoteWise-AI/
├── frontend/             # Next.js 15 App Router Frontend
│   ├── src/
│   │   ├── app/          # Pages, layout, globals.css (Premium UI)
│   │   └── components/   # Reusable UI elements
│   ├── package.json
│   └── tsconfig.json
└── backend/              # Node.js + Express Backend
    ├── src/
    │   ├── routes/       # API Route definitions
    │   ├── services/     # Core Business Logic (RAG, Eligibility, Reminders)
    │   └── index.ts      # Server entry point
    ├── package.json
    └── tsconfig.json
```

## Database Schema (Firestore / Cloud SQL Example)
### Users Table/Collection
- `id`: string (UUID)
- `phoneNumber`: string
- `preferredLanguage`: string ('en', 'hi', etc.)
- `constituency`: string
- `currentStep`: integer (0-3)

### Progress Table/Collection
- `userId`: string (FK)
- `stepName`: string
- `status`: string ('pending', 'completed', 'in_progress')
- `lastUpdated`: timestamp

### Reminders Table/Collection
- `id`: string
- `userId`: string (FK)
- `deadline`: timestamp
- `type`: string ('registration', 'election_day')
- `status`: string ('scheduled', 'sent')

## API Definitions
### `POST /api/v1/chat`
Handles AI conversation interactions using RAG.
**Request:**
```json
{
  "message": "How do I register?",
  "userId": "user_123",
  "userContext": { "state": "Maharashtra", "step": 1 }
}
```
**Response:**
```json
{
  "success": true,
  "response": "To register, you need to fill out Form 6...",
  "source": "Election Commission Guidelines API"
}
```

### `POST /api/v1/eligibility`
Evaluates user eligibility.
**Request:**
```json
{
  "age": 19,
  "isCitizen": true,
  "isResident": true
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "isEligible": true,
    "missingRequirements": [],
    "nextStep": "registration"
  }
}
```

## Deployment Steps (Google Cloud)
1. **Frontend**: Deploy the Next.js application to Google Cloud Run by dockerizing the application or using Cloud Build.
2. **Backend**: Containerize the Express server and deploy it to Google Cloud Run.
3. **Database**: Provision a Firestore instance in Native Mode.
4. **Vertex AI**: Enable Vertex AI APIs, ingest the Election Commission FAQ PDFs into Vertex AI Search for RAG.
5. **Event Triggers**: Deploy a Cloud Scheduler job to periodically trigger the `/api/v1/reminders/process` endpoint to send push notifications via Firebase Cloud Messaging.

## Demo Walkthrough
1. **Eligibility**: User provides age and citizenship. System updates progress.
2. **Registration**: User asks how to apply. RAG pipeline returns Form 6 instructions.
3. **Reminder**: System logs a scheduled reminder 14 days before the registration deadline.
4. **Election Day**: Progress tracker advances, and navigation to the polling booth is enabled via Google Maps integration.
