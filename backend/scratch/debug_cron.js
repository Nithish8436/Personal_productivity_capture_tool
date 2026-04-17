const mongoose = require('mongoose');
require('dotenv').config();
const Task = require('../models/taskModel');
const User = require('../models/userModel');
const { sendSMS } = require('../services/smsService');

const debugJob = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/productivity');
        console.log('--- Debugging Reminder Job ---');

        const now = new Date();
        const thirtyMinutesLater = new Date(now.getTime() + 30 * 60000);

        console.log(`Current Time: ${now.toISOString()}`);
        console.log(`Window End: ${thirtyMinutesLater.toISOString()}`);

        const upcomingTasks = await Task.find({
            completed: false,
            smsReminder: true,
            reminderSent: false,
            deadline: { $gte: now, $lte: thirtyMinutesLater }
        }).populate('user');

        console.log(`Found ${upcomingTasks.length} tasks in the window.`);

        for (const task of upcomingTasks) {
            console.log(`Processing Task: ${task.title}`);
            if (task.user && task.user.phone) {
                console.log(`Sending SMS to: ${task.user.phone}`);
                try {
                    await sendSMS(task.user.phone, `🔔 TEST: ${task.title}`);
                    task.reminderSent = true;
                    await task.save();
                    console.log('✅ Task marked as sent.');
                } catch (err) {
                    console.error('❌ Twilio send failed:', err.message);
                }
            } else {
                console.log('⚠️ User or Phone missing for task Owner.');
            }
        }
        
        process.exit(0);
    } catch (err) {
        console.error('Debug Error:', err);
        process.exit(1);
    }
};

debugJob();
