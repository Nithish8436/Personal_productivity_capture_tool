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
      model: 'llama3-8b-8192',
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

module.exports = {
  parseUserInput,
};
