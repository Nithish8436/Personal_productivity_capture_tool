const Task = require('../models/taskModel');
const { parseUserInput, generateTaskSummary, decomposeTask, suggestTasks } = require('../services/aiService');

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
    const { title, deadline, category, priority, subtasks } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const newTask = new Task({
      title,
      deadline,
      category,
      priority,
      subtasks,
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

// @desc    Update a task
// @route   PATCH /api/tasks/:id
// @access  Public
const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task' });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Public
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
};

// @desc    Get productivity summary + AI insights
// @route   GET /api/tasks/summary
// @access  Public
const getSummary = async (req, res) => {
  try {
    const allTasks = await Task.find();
    
    // Aggregations
    const total = allTasks.length;
    const completed = allTasks.filter(t => t.completed).length;
    const urgentCount = allTasks.filter(t => (t.priority === 'High' || t.priority === 'Critical') && !t.completed).length;
    
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Category Distribution
    const byCategory = allTasks.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {});
    
    const mostActiveCategory = Object.entries(byCategory).sort((a,b) => b[1] - a[1])[0]?.[0] || 'Other';

    // Generate AI Insight
    const stats = { total, completed, urgentCount, completionRate, mostActiveCategory };
    const insight = await generateTaskSummary(stats);

    res.status(200).json({
      ...stats,
      byCategory,
      insight
    });
  } catch (error) {
    console.error('Summary Controller Error:', error);
    res.status(500).json({ message: 'Error generating summary' });
  }
};

// @desc    Decompose an existing task into subtasks
// @route   POST /api/tasks/:id/decompose
// @access  Public
const decomposeExistingTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const newSubtasks = await decomposeTask({ title: task.title, category: task.category });
    
    // Merge new subtasks with existing ones, or replace if none exist
    task.subtasks = [...(task.subtasks || []), ...newSubtasks];
    
    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Decompose Controller Error:', error);
    res.status(500).json({ message: 'Error decomposing task' });
  }
};

// @desc    Get proactive task suggestions
// @route   GET /api/tasks/suggestions
// @access  Public
const getTaskSuggestions = async (req, res) => {
  try {
    // Only get open (non-completed) tasks for context
    const openTasks = await Task.find({ completed: false }).limit(10);
    
    const suggestions = await suggestTasks(openTasks);
    res.status(200).json(suggestions);
  } catch (error) {
    console.error('Suggestions Controller Error:', error);
    res.status(500).json({ message: 'Error generating suggestions' });
  }
};

module.exports = {
  getTasks,
  createTask,
  parseTask,
  updateTask,
  deleteTask,
  getSummary,
  decomposeExistingTask,
  getTaskSuggestions,
};
