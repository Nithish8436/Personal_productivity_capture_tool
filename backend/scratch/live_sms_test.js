const twilio = require('twilio');
require('dotenv').config();

const testRealSMS = async () => {
    const to = "+919361296094"; // The user's number from DB
    const message = "🧪 This is a REAL Twilio connectivity test from Curator.";

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    console.log(`Using SID: ${accountSid?.substring(0, 5)}...`);
    console.log(`Using From: ${fromNumber}`);

    if (!accountSid || !authToken || !fromNumber) {
        console.error('❌ Twilio credentials missing in .env!');
        process.exit(1);
    }

    const client = twilio(accountSid, authToken);

    try {
        const result = await client.messages.create({
            body: message,
            from: fromNumber,
            to: to
        });
        console.log(`✅ SUCCESS: SMS sent! SID: ${result.sid}`);
        process.exit(0);
    } catch (error) {
        console.error(`❌ TWILIO ERROR:`, error.message);
        console.error(`Code: ${error.code}`);
        process.exit(1);
    }
};

testRealSMS();
