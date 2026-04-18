const cron = require('node-cron');
const Task = require('../models/taskModel');
const User = require('../models/userModel');
const { sendSMS } = require('./smsService');

const initReminderJob = () => {
  // Run every minute
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      
      // --- 1. PRE-DEADLINE REMINDERS (30 mins before) ---
      const thirtyMinutesLater = new Date(now.getTime() + 30 * 60000);
      const upcomingTasks = await Task.find({
        completed: false,
        smsReminder: true,
        reminderSent: false,
        deadline: { $gte: now, $lte: thirtyMinutesLater }
      }).populate('user');

      for (const task of upcomingTasks) {
        if (task.user && task.user.phone) {
          const message = `🔔 Reminder: Your task "${task.title}" is due soon! (${new Date(task.deadline).toLocaleTimeString()})`;
          try {
            await sendSMS(task.user.phone, message);
            task.reminderSent = true;
            await task.save();
          } catch (err) { console.error('Upcoming reminder failed'); }
        }
      }

      // --- 2. POST-DEADLINE FOLLOW-UPS (5 mins after) ---
      // Check for tasks that passed their deadline between 5 and 60 minutes ago
      const fiveMinsAgo = new Date(now.getTime() - 5 * 60000);
      const oneHourAgo = new Date(now.getTime() - 60 * 60000);

      const overdueTasks = await Task.find({
        completed: false,
        smsReminder: true,
        overdueReminderSent: false,
        deadline: { $gte: oneHourAgo, $lte: fiveMinsAgo }
      }).populate('user');

      for (const task of overdueTasks) {
        if (task.user && task.user.phone) {
          const message = `🧐 Did you finish "${task.title}"? \nIf yes, please mark it as done in your dashboard so I can track your progress!`;
          try {
            await sendSMS(task.user.phone, message);
            task.overdueReminderSent = true;
            await task.save();
          } catch (err) { console.error('Overdue follow-up failed'); }
        }
      }

    } catch (error) {
      console.error('Error in reminder job:', error);
    }
  });

  console.log('Task Reminder Job Initialized (checking every minute)');
};

module.exports = { initReminderJob };
