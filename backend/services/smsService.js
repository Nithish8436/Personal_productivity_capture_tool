const twilio = require('twilio');

const sendSMS = async (to, message) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    console.warn('Twilio credentials missing. SMS not sent.');
    return;
  }

  const client = twilio(accountSid, authToken);

  // Normalize phone number (Ensure E.164 format)
  let formattedTo = to.trim();
  if (!formattedTo.startsWith('+')) {
    // Default to +91 (India) if it's 10 digits and lacks country code
    if (formattedTo.length === 10) {
      formattedTo = '+91' + formattedTo;
    } else {
      // Otherwise just try to add plus if it looks like a code exists but + is missing
      formattedTo = '+' + formattedTo;
    }
  }

  try {
    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: formattedTo
    });
    console.log(`SMS sent to ${formattedTo}: ${result.sid}`);
    return result;
  } catch (error) {
    console.error(`Error sending SMS to ${to}:`, error);
    throw error;
  }
};

module.exports = { sendSMS };
