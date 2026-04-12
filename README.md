# Lightweight Personal Productivity Capture Tool

An AI-powered system that converts unstructured natural language input into structured, actionable tasks with intelligent categorization and prioritization.

## Tech Stack
- **Frontend** – React (Vite)
- **Backend** – Node.js + Express
- **Database** – MongoDB (Mongoose)
- **AI** – Groq API (Llama3)

## Project Structure

```
├── backend/
│   ├── config/      # DB connection
│   ├── models/      # Mongoose schemas
│   ├── server.js
│   └── .env
└── frontend/
    └── src/
```

## Getting Started

### Backend
```bash
cd backend
npm install
# Add your MONGO_URI and GROQ_API_KEY to .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
