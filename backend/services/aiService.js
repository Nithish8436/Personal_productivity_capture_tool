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
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a productivity assistant. Convert the user's unstructured input into a structured JSON object.
          
          The JSON object must follow this schema:
          {
            "title": "Short descriptive title of the task",
            "deadline": "ISO 8601 date string or null if not mentioned",
            "category": "One of: Work, Personal, Health, Learning, Finance, Other",
            "priority": "One of: Low, Medium, High, Critical",
            "subtasks": [
              { "title": "Subtask title", "completed": false }
            ]
          }

          Rules:
          - If no priority is implied, default to 'Medium'.
          - If no category is implied, default to 'Other'.
          - Break down complex tasks into 2-4 subtasks if possible.
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

module.exports = {
  parseUserInput,
  generateTaskSummary,
};
