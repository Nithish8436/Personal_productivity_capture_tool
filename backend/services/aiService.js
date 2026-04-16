const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Parses unstructured user input into a structured task object
 * @param {string} text - Raw input from user (text or speech-to-text result)
 * @returns {Promise<Object>} - Structured task data
 */
const parseUserInput = async (text) => {
  try {
    // Inject current date so AI can resolve "tomorrow", "next week", etc.
    const now = new Date();
    const todayStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a productivity assistant. Convert the user's unstructured input into a structured JSON object.
          
          IMPORTANT - Today's date is: ${todayStr} (${now.toISOString().slice(0, 10)}).
          Use this to resolve any relative dates like "tomorrow", "today", "next Monday", "this Friday", "in 3 days", "next week", etc.
          For example, if today is Wednesday April 15 2026, then "tomorrow" = 2026-04-16, "next Monday" = 2026-04-21.
          
          The JSON object must follow this schema:
          {
            "title": "Short descriptive title",
            "description": "Full details, content, or the actual information being captured (e.g. the password itself, server details, or specific note content)",
            "itemType": "One of: Task, Note, Reminder, To-do",
            "tags": ["extracted-keyword-1", "extracted-keyword-2"],
            "deadline": "ISO 8601 date string or null if not mentioned",
            "category": "One of: Work, Personal, Health, Learning, Finance, Other",
            "priority": "One of: Low, Medium, High, Critical",
            "subtasks": [
              { "title": "Subtask title", "completed": false }
            ]
          }

          Rules:
          - 'Note': Informational thoughts or facts (e.g., "The client wants portrait layout").
          - 'Task': Actionable items that can be completed.
          - 'Reminder': Time-sensitive prompts (e.g., "Call the bank tomorrow").
          - 'To-do': Simple list items (e.g., "Buy milk").
          - Tags: Extract 1-3 semantic keywords for easy retrieval later.
          - If no priority is implied, default to 'Medium'.
          - If no category is implied, default to 'Other'.
          - Respond ONLY with the JSON object. No preamble or markdown blocks.`,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1, // Low temp for more consistent JSON
      response_format: { type: 'json_object' },
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;
    return JSON.parse(responseContent);
  } catch (error) {
    console.error('AI Parsing Error:', error);
    throw new Error('Failed to parse task input');
  }
};

/**
 * Generates a productivity insight summary based on task statistics
 * @param {Object} stats - Computed task metrics
 * @returns {Promise<string>} - A short, punchy productivity insight
 */
const generateTaskSummary = async (stats) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a productivity performance analyst. Analyze the following user statistics and provide a single, punchy, professional, and slightly motivating "Operational Insight" or "Productivity Tip". 
          
          Guidelines:
          - Keep it under 25 words.
          - Use a professional yet encouraging tone.
          - Example: "Your focus peaks at 10:30 AM. Schedule your Critical tasks then for maximum output."
          - Reference the specific numbers if they are interesting (e.g. high completion rate).`,
        },
        {
          role: 'user',
          content: `User Statistics:
          Total Tasks: ${stats.total}
          Completed: ${stats.completed}
          Completion Rate: ${stats.completionRate}%
          Most Active Category: ${stats.mostActiveCategory}
          Urgent/Critical Tasks: ${stats.urgentCount}`,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7, // Higher temp for more natural-sounding advice
    });

    return chatCompletion.choices[0]?.message?.content || "Keep up the momentum! Your productivity is trending upwards.";
  } catch (error) {
    console.error('AI Summary Error:', error);
    return "Focus on your Critical tasks today to maximize your daily impact.";
  }
};

/**
 * Generates subtasks for an existing task
 * @param {Object} task - The task object containing title and category
 * @returns {Promise<Array>} - Array of subtask objects
 */
const decomposeTask = async (task) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an expert productivity planner. Your job is to break down a given task into 3-5 logical, actionable subtasks.
          
          Respond ONLY with a JSON array of objects. 
          The JSON must follow this exact format:
          [
            { "title": "Subtask 1 title", "completed": false },
            { "title": "Subtask 2 title", "completed": false }
          ]
          
          No markdown, no preamble.`,
        },
        {
          role: 'user',
          content: `Break down this task: Title: "${task.title}", Category: "${task.category || 'General'}"`,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.2,
      response_format: { type: 'json_array' },
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;
    return JSON.parse(responseContent);
  } catch (error) {
    console.error('AI Decomposition Error:', error);
    throw new Error('Failed to decompose task');
  }
};

/**
 * Generates proactive task suggestions based on current open tasks
 * @param {Array} activeTasks - List of currently open tasks
 * @returns {Promise<Array>} - Array of suggested task objects
 */
const suggestTasks = async (activeTasks) => {
  try {
    const taskTitles = activeTasks.map(t => t.title).join(', ');
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a proactive AI assistant. Based on the user's current open tasks, suggest 2 logical next tasks they might need to do.
          
          Respond ONLY with a JSON object containing a "suggestions" key.
          Format:
          {
            "suggestions": [
              { "title": "Suggested task 1", "priority": "Medium", "category": "Work" },
              { "title": "Suggested task 2", "priority": "Low", "category": "Personal" }
            ]
          }
          
          Make the suggestions actionable and relevant. No markdown.`,
        },
        {
          role: 'user',
          content: `Current open tasks: ${taskTitles || 'None. Suggest some generally good habits to start.'}`,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      response_format: { type: 'json_object' },
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;
    const result = JSON.parse(responseContent);
    return result.suggestions || [];
  } catch (error) {
    console.error('AI Suggestion Error:', error);
    return [];
  }
};

/**
 * Uses AI to find semantic connections between a current task and historical data
 * @param {Object} currentTask - The task being inspected
 * @param {Array} history - A list of past tasks/notes to compare against
 * @returns {Promise<Array>} - Array of connected task IDs and the reason for the link
 */
const discoverRelatedContext = async (currentTask, history) => {
  try {
    if (history.length === 0) return [];
    
    const historicalContext = history.map(h => ({ id: h._id, title: h.title, tags: h.tags, description: h.description }));
    
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a knowledge graph specialist. Your task is to identify SEMANTIC connections between a "Current Task" and a "List of Past Items".
          
          Connection criteria:
          - Shares the same subject matter (e.g., both about a specific project).
          - Logical sequence (e.g., one is a follow-up to the other).
          - Shared entities (e.g., people, software, locations).
          - Conceptual overlap (e.g., both are about "WiFi configuration").
          
          Respond ONLY with a JSON array identifying the matches.
          Format: 
          [
            { "id": "original-mongodb-id", "reason": "Short reason why they are connected" }
          ]
          
          If no logical connection exists, return an empty array [].
          Limit to the top 2 most relevant connections.`,
        },
        {
          role: 'user',
          content: `Current Task: Title: "${currentTask.title}", Description: "${currentTask.description}", Tags: ${JSON.stringify(currentTask.tags)}
          
          List of Past Items: ${JSON.stringify(historicalContext)}`,
        },
      ],
      model: 'llama-3.1-8b-instant', // Faster model for background links
      temperature: 0.1,
      response_format: { type: 'json_array' },
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;
    return JSON.parse(responseContent);
  } catch (error) {
    console.error('AI Link Error:', error);
    return [];
  }
};

module.exports = {
  parseUserInput,
  generateTaskSummary,
  decomposeTask,
  suggestTasks,
  discoverRelatedContext,
};
