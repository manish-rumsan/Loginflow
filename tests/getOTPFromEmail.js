// getOTPFromEmail.js
const imaps = require("imap-simple");

const config = {
  imap: {
    user: "manish@rumsan.net",
    password: "uzpyfqpkyibouoly", // // Replace with the 16-character App Password with no space
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    tlsOptions: {
      rejectUnauthorized: false, // Bypass self-signed cert check (temporary)
    },
  },
};

async function getOTPFromEmail() {
  let connection;
  try {
    connection = await imaps.connect(config);
    await connection.openBox("INBOX");

    const delay = 10 * 60 * 1000; // 10 minutes
    const sinceDate = new Date(Date.now() - delay);

    const searchCriteria = ["UNSEEN", ["SINCE", sinceDate.toISOString()]];
    const fetchOptions = { bodies: ["TEXT"], markSeen: true };

    const results = await connection.search(searchCriteria, fetchOptions);

    if (!results.length) {
      throw new Error("No unseen emails found in the last 10 minutes");
    }

    for (let res of results) {
      const text = res.parts.find((part) => part.which === "TEXT")?.body;
      if (!text) continue;

      const otpMatch = text.match(/\b\d{6}\b/); // Matches 6-digit OTP
      if (otpMatch) {
        console.log(`Found 6-digit OTP: ${otpMatch[0]}`);
        return otpMatch[0];
      }
    }

    throw new Error("No 6-digit OTP found in recent unread emails");
  } catch (error) {
    console.error("Error fetching OTP:", error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

module.exports = getOTPFromEmail;
