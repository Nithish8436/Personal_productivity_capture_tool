const Task = require('../models/taskModel');
const { parseUserInput } = require('../services/aiService');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Public
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

// @desc    Add a task manually
// @route   POST /api/tasks
// @access  Public
const createTask = async (req, res) => {
  try {
    const { title, deadline, category, priority } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const newTask = new Task({
      title,
      deadline,
      category,
      priority,
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task' });
  }
};

// @desc    Parse natural language input into a task
// @route   POST /api/tasks/parse
// @access  Public
const parseTask = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Text input is required' });
    }

    // Call AI Service
    const structuredData = await parseUserInput(text);

    // Create task from structured data
    const newTask = new Task(structuredData);

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error('ParseTask Controller Error:', error);
    res.status(500).json({ message: 'Error parsing and saving task' });
  }
};

module.exports = {
  getTasks,
  createTask,
  parseTask,
};
