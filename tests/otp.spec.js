const axios = require('axios');

async function getOtpFromMailinator(emailPrefix) {
  const inboxUrl = `https://www.mailinator.com/fetch_inbox?to=${emailPrefix}`;
  const messagesResponse = await axios.get(inboxUrl);

  const messages = messagesResponse.data.messages;
  if (!messages.length) throw new Error('No messages found in inbox');

  const latestId = messages[0].id;
  const messageUrl = `https://www.mailinator.com/fetch_email?msgid=${latestId}`;
  const messageResponse = await axios.get(messageUrl);

  const body = messageResponse.data.data.parts[0].body;
  const match = body.match(/\b\d{4,8}\b/); // Match a 4–8 digit OTP

  if (match) return match[0];
  else throw new Error('OTP not found in email body');
}

module.exports = getOtpFromMailinator;
