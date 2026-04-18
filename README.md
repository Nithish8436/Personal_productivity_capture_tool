# Curator

Curator is a lightweight personal productivity capture tool built to remove friction from task capture.

The core idea is simple: capture thoughts in natural language (typed or spoken), and let the system structure everything for you. Instead of manually filling many fields, you can say:

"Need to finish the report by tomorrow evening, high priority"

Curator converts that into a structured task with title, description, deadline, category, and priority, then stores it and keeps tracking it with reminders.

## Why Curator Exists

Most productivity tools slow users down during capture.

- You have to decide fields before saving the thought.
- You lose focus while formatting instead of capturing.
- Important tasks get dropped because the capture flow is too heavy.

Curator solves this with zero-chore capture:

- Input naturally.
- Parse instantly with AI.
- Save cleanly.
- Automate follow-ups in the background.

## What Curator Does

- Natural language task parsing via Groq + Llama 3.
- Voice input capture via Web Speech API.
- Secure JWT-based authentication.
- Task CRUD with user-level data isolation.
- AI-generated subtasks for larger goals.
- AI task suggestions from current open work.
- Semantic related-task discovery.
- Productivity summary with AI insight.
- Background reminder watchdog with optional SMS notifications.

## Tech Stack and Why

### Frontend
- React 19: Component-driven UI for fast feature development.
- Vite 8: Very fast local dev server and build pipeline.
- Tailwind CSS 4: Utility-first styling for a clean, premium UI.
- React Router DOM 7: SPA navigation.
- Axios: API communication.
- Recharts: Analytics and visualization.
- Lucide React: Consistent icon set.

### Backend
- Node.js + Express 5: Lightweight REST API server.
- Mongoose: MongoDB modeling and validation.
- JWT + BcryptJS: Authentication and secure password hashing.
- node-cron: Reminder watchdog that runs on a schedule.
- Twilio: SMS reminder delivery.

### AI Layer
- Groq SDK with Llama models:
  - Structured JSON extraction from free text.
  - Task decomposition into subtasks.
  - Suggestion generation.
  - Related-context linking.
  - Insight generation for productivity summaries.

### Database
- MongoDB: Flexible document model for mixed productivity records (Task, Note, Reminder, To-do) in one schema.

## End-to-End Flow

1. User signs up or logs in.
2. JWT is stored client-side and attached to subsequent requests.
3. User types or speaks content in the capture box.
4. Frontend sends text to parsing endpoint.
5. Backend AI service prompts Llama to return normalized JSON.
6. Parsed task is saved with the authenticated user ID.
7. Dashboard and task views update with structured data.
8. Reminder watchdog runs every minute:
   - Sends pre-deadline reminders (about 30 minutes before).
   - Sends post-deadline follow-up nudges.
9. Optional AI endpoints provide suggestions, decomposition, summary insights, and related context.

## Repository Architecture

- [frontend/README.md](frontend/README.md): Frontend architecture and UI details.
- [backend/README.md](backend/README.md): API services, security, and reminder jobs.
- [DATABASE.md](DATABASE.md): Data model and schema details.
- [AI_MODEL.md](AI_MODEL.md): AI prompting and inference behavior.

## Quick Start

### 1. Prerequisites

- Node.js 18+ and npm.
- MongoDB instance (local or cloud).
- Groq API key.
- Twilio account (optional, only required for SMS reminders).

### 2. Backend Setup

From project root:

```bash
cd backend
npm install
```

Create a .env file in backend with:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

Start backend:

```bash
npm run dev
```

### 3. Frontend Setup

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on Vite dev server and expects backend APIs at http://localhost:5000.

### 4. Default Local Endpoints

- Backend base: http://localhost:5000
- Health route: GET /
- Auth routes: /api/users
- Task routes: /api/tasks

## API Highlights

All task routes are protected by JWT auth middleware.

- GET /api/tasks: Fetch user tasks.
- POST /api/tasks: Create task manually.
- POST /api/tasks/parse: Parse and save natural-language task.
- PATCH /api/tasks/:id: Update task.
- DELETE /api/tasks/:id: Delete task.
- GET /api/tasks/summary: Aggregated stats + AI insight.
- POST /api/tasks/:id/decompose: Generate and append subtasks.
- GET /api/tasks/suggestions: AI next-task suggestions.
- GET /api/tasks/search?q=term: Search by title/category/tags.
- GET /api/tasks/:id/related: AI semantic related items.

## Security and Privacy

- Passwords are hashed with BcryptJS.
- JWT secures private routes.
- Task queries are filtered by authenticated user ID.
- Users only access their own data.

## Important Notes

- Voice input depends on browser support for Web Speech API.
- If Twilio variables are not set, app still runs; SMS sending is skipped.
- Frontend API URLs are currently set to localhost in source for local development.

## Vision

Curator is designed to make thought capture take under 5 seconds while preserving context, structure, and follow-through.

Capture naturally. Let the system do the formatting, organization, and nudging.
