const mongoose = require('mongoose');
require('dotenv').config();
const Task = require('../models/taskModel');
const User = require('../models/userModel');

const runTest = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/productivity');
        console.log('Connected to DB');

        const userId = "69e1bd267f03c9161c98cc45"; // User 'nithi'
        
        // 1. Create a task that is due in 20 minutes
        const deadline = new Date(Date.now() + 20 * 60000);
        
        const testTask = await Task.create({
            user: userId,
            title: "🚀 SMS Trigger Test",
            deadline: deadline,
            smsReminder: true,
            reminderSent: false,
            priority: 'High',
            category: 'Other'
        });

        console.log('Test Task Created:', testTask._id);
        console.log('Deadline set for:', deadline.toLocaleTimeString());

        // 2. Manually trigger the logic from reminderJob
        const now = new Date();
        const thirtyMinutesLater = new Date(now.getTime() + 30 * 60000);

        console.log(`Searching for tasks between ${now.toLocaleTimeString()} and ${thirtyMinutesLater.toLocaleTimeString()}...`);

        const upcomingTasks = await Task.find({
            _id: testTask._id, // Filter to just our test task
            completed: false,
            smsReminder: true,
            reminderSent: false,
            deadline: { $gte: now, $lte: thirtyMinutesLater }
        }).populate('user');

        if (upcomingTasks.length > 0) {
            console.log('✅ SUCCESS: Task found in trigger window!');
            const task = upcomingTasks[0];
            if (task.user && task.user.phone) {
                console.log(`✅ SUCCESS: User phone number found: ${task.user.phone}`);
                console.log(`Ready to send message: "🔔 Reminder: Your task \"${task.title}\" is due soon!"`);
                
                // We won't actually trigger Twilio to avoid using credits, 
                // but we've verified the logic works up to the send point.
            } else {
                console.log('❌ FAIL: User phone number missing.');
            }
        } else {
            console.log('❌ FAIL: Task not found in trigger window.');
        }

        // Clean up
        await Task.findByIdAndDelete(testTask._id);
        console.log('Test Task Cleaned Up');
        
        process.exit(0);
    } catch (err) {
        console.error('Test Error:', err);
        process.exit(1);
    }
};

runTest();
