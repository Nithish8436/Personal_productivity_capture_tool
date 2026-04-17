# Curator - Backend Engine

The backend of **Curator** is a robust RESTful API built on the **MERN** stack architecture. It handles natural language processing coordination, background task scheduling, and secure user authentication.

## 🛠 Core Technologies
- **Node.js & Express**: The foundation of the server-side logic and routing.
- **Mongoose**: Elegant MongoDB object modeling.
- **JSON Web Token (JWT)**: Secure, stateless user authentication.
- **BcryptJS**: Password hashing for bank-grade security.
- **Groq SDK**: Interface for high-speed AI inference (Llama3).
- **Twilio SDK**: Enterprise-grade SMS gateway integration.
- **Node-Cron**: Background job scheduling for automated reminders.

## ⚙️ Service Architecture
### 1. AI Service (`services/aiService.js`)
Coordinates with the Groq API to:
- Parse unstructured text into structured JSON.
- Decompose complex tasks into subtasks.
- Find semantic links between new tasks and past entries.

### 2. Reminder Service (`services/reminderJob.js`)
An automated "Watchdog" that runs every minute to:
- Scan for upcoming task deadlines.
- Check for overdue tasks requiring a follow-up.
- Coordinate with the **SMS Service** to dispatch notifications.

## 🔐 Security Standards
- **Middleware Protection**: All private routes are shielded by a custom `protect` middleware that validates JWT signatures.
- **Data Integrity**: Schema-level validation prevents malformed data entries.
- **E.164 Normalization**: Automated phone number formatting for global SMS compatibility.

## 🚀 Environment Setup
Create a `.env` file in this directory with:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
GROQ_API_KEY=your_key
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=your_number
```
