const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: [true, 'Task title is required']
  },
  description: {
    type: String
  },
  deadline: {
    type: Date
  },
  category: {
    type: String,
    default: 'Uncategorized'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  itemType: {
    type: String,
    enum: ['Task', 'Note', 'Reminder', 'To-do'],
    default: 'Task'
  },
  tags: {
    type: [String],
    default: []
  },
  completed: {
    type: Boolean,
    default: false
  },
  subtasks: [
    {
      title: String,
      completed: { type: Boolean, default: false }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Task', taskSchema);
