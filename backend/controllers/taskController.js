const Task = require('../models/taskModel');
const { parseUserInput, generateTaskSummary, decomposeTask, suggestTasks } = require('../services/aiService');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

// @desc    Add a task manually
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, deadline, category, priority, subtasks, itemType, tags } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const newTask = new Task({
      user: req.user.id,
      title,
      deadline,
      category,
      priority,
      subtasks,
      itemType,
      tags,
      description
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task' });
  }
};

// @desc    Parse natural language input into a task
// @route   POST /api/tasks/parse
// @access  Private
const parseTask = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Text input is required' });
    }

    // Call AI Service
    const structuredData = await parseUserInput(text);

    // Create task from structured data
    const newTask = new Task({ ...structuredData, user: req.user.id });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error('ParseTask Controller Error:', error);
    res.status(500).json({ message: 'Error parsing and saving task' });
  }
};

// @desc    Update a task
// @route   PATCH /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found or user unauthorized' });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task' });
  }
};

// @desc    Smart search across tasks, tags, and categories
// @route   GET /api/tasks/search
// @access  Private
const searchTasks = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      const all = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
      return res.status(200).json(all);
    }

    // Search in title, category, and tags
    const searchRegex = new RegExp(q, 'i');
    const tasks = await Task.find({
      user: req.user.id,
      $or: [
        { title: searchRegex },
        { category: searchRegex },
        { tags: { $in: [searchRegex] } }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    console.error('Search Controller Error:', error);
    res.status(500).json({ message: 'Error searching tasks' });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found or user unauthorized' });
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
};

// @desc    Get productivity summary + AI insights
// @route   GET /api/tasks/summary
// @access  Private
const getSummary = async (req, res) => {
  try {
    const allTasks = await Task.find({ user: req.user.id });
    
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
// @access  Private
const decomposeExistingTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found or user unauthorized' });

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
// @access  Private
const getTaskSuggestions = async (req, res) => {
  try {
    // Only get open (non-completed) tasks for context
    const openTasks = await Task.find({ user: req.user.id, completed: false }).limit(10);
    
    const suggestions = await suggestTasks(openTasks);
    res.status(200).json(suggestions);
  } catch (error) {
    console.error('Suggestions Controller Error:', error);
    res.status(500).json({ message: 'Error generating suggestions' });
  }
};

// @desc    Get related past context for a specific task
// @route   GET /api/tasks/:id/related
// @access  Private
const getRelatedTasks = async (req, res) => {
  try {
    const currentTask = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!currentTask) return res.status(404).json({ message: 'Task not found' });
    
    // Get past items (excluding the current one)
    const history = await Task.find({ _id: { $ne: req.params.id }, user: req.user.id }).limit(50).sort({ createdAt: -1 });
    
    // Use AI to find semantic links
    const { discoverRelatedContext } = require('../services/aiService');
    const links = await discoverRelatedContext(currentTask, history);
    
    // Find the actual task objects for the suggested IDs
    const matchedIds = links.map(l => l.id);
    const relatedTasks = await Task.find({ _id: { $in: matchedIds } });
    
    // Combine with AI reasons
    const results = relatedTasks.map(rt => {
      const linkInfo = links.find(l => l.id === rt._id.toString());
      return {
        ...rt.toObject(),
        reason: linkInfo?.reason
      };
    });

    res.status(200).json(results);
  } catch (error) {
    console.error('RelatedTasks Controller Error:', error);
    res.status(500).json({ message: 'Error discovering related context' });
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
  searchTasks,
  getRelatedTasks,
};
