# Curator - AI & Intelligence Layer

**Curator** is powered by advanced LLMs (Large Language Models) to provide a "zero-chore" user experience. The AI handles the heavy lifting of structure, categorization, and recall.

## 🧠 Model Specifications
- **Core Model**: `llama-3.3-70b-versatile` (via **Groq Cloud**)
- **Speed**: Selected for near-instant (sub-500ms) inference speeds, enabling real-time voice processing.
- **Precision Model**: `llama-3.1-8b-instant` (used for lighter background tasks like semantic linking).

## 🧩 Intelligence Features

### 1. Natural Language Processing (NLP) Parser
Converts sentences like *"Need to grocery shopping tomorrow evening high priority"* into:
```json
{
  "title": "Grocery Shopping",
  "deadline": "2026-04-18T18:00:00Z",
  "priority": "High",
  "category": "Personal"
}
```
**Standardized Time Logic**: Mapping terms like "morning" (9AM) or "evening" (6PM) to specific ISO durations.

### 2. Smart Decomposition
Uses AI to break down ambiguous goals (e.g., "Build a website") into 3-5 logical sub-steps automatically.

### 3. Semantic Recall (Knowledge Graph)
Instead of simple keyword search, the AI analyzes the *meaning* of your tasks to find related context from months ago, helping you build a "Second Brain."

### 4. Proactive Suggestions
Analyzes your current open tasks and trends to suggest the "Next Logical Action" (e.g., If you have a project due, it suggests setting a review meeting).
