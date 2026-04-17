# Lightweight Personal Productivity Capture Tool

An AI-powered system that converts unstructured natural language input into structured, actionable tasks with intelligent categorization and prioritization.

## Tech Stack
- **Frontend** – React (Vite)
- **Backend** – Node.js + Express
- **Database** – MongoDB (Mongoose)
- **AI** – Groq API (Llama3)

## 🏗 Product Architecture
The system is divided into modular segments for scalability and clarity:

- 🎨 **[Frontend Documentation](./frontend/README.md)** – UI/UX, Design System, and Components.
- ⚙️ **[Backend Documentation](./backend/README.md)** – API logic, Services, and Watchdogs.
- 📊 **[Database Schema](./DATABASE.md)** – MongoDB Data Modeling and Indices.
- 🧠 **[AI Implementation](./AI_MODEL.md)** – NLP Parsing, Llama3, and Semantic Recall.

## 🚀 Quick Start

### 1. Environment Setup
Create a `.env` in the `backend/` folder (see [Backend Docs](./backend/README.md) for keys).

### 2. Launch Backend
```bash
cd backend
npm install
npm run dev
```

### 3. Launch Frontend
```bash
cd frontend
npm install
npm run dev
```

---
*Developed with focus on speed, aesthetics, and intelligence.*
