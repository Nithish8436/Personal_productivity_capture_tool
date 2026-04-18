# Curator - Database Schema & Data Modeling

**Curator** uses **MongoDB** as its primary data store, chosen for its flexible document structure which perfectly suits the evolving nature of personal productivity entries.

## 📊 Core Models

### 1. User Model (`models/userModel.js`)
Stores account information and preferences.
- `name`: String (Required)
- `email`: String (Unique, Required)
- `password`: String (Hashed via Bcrypt)
- `phone`: String (Optional - for SMS Reminders)

### 2. Task Model (`models/taskModel.js`)
The central unit of the application. It acts as a hybrid store for Tasks, Notes, and Reminders.
- `user`: ObjectId (Reference to User)
- `title`: String
- `description`: String
- `deadline`: Date
- `itemType`: Enum (Task, Note, Reminder, To-do)
- `category`: Enum (Work, Personal, Health, Learning, Finance, Other)
- `priority`: Enum (Low, Medium, High, Critical)
- `smsReminder`: Boolean (User preference)
- `reminderSent`: Boolean (Alert status)
- `overdueReminderSent`: Boolean (Follow-up status)
- `subtasks`: Array of Objects (title, completed)
- `tags`: Array of Strings (Extracted keywords)

## 🔍 Indexing & Querying
- **User Ownership**: All queries are filtered by the `user` ID to ensure strict data privacy.
- **Search**: Implemented via Regex in the `taskController` to allow partial matching on titles, categories, and tags.
- **Background Scans**: Indexed on `deadline`, `completed`, and `smsReminder` flags for ultra-fast cron job performance.
