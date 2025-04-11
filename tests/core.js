// core/mailinator.js

/**
 * Retrieves a 6-digit OTP from a public Mailinator inbox.
 * @param {import('playwright').Page} page - Playwright page instance.
 * @param {string} emailAddress - Mailinator email address (e.g., test123@mailinator.com).
 * @returns {Promise<string>} - The 6-digit OTP.
 * @throws {Error} - If no emails, no OTP, or other issues occur.
 */
async function getOtpFromMailinator(page, emailAddress) {
  // CHANGE HERE: Do NOT hardcode the emailAddress (e.g., 'test123@mailinator.com'). Keep it as a parameter to allow flexibility for different emails in each test run. Pass the email when calling this function from your script (e.g., loginFlow.js).
  await page.goto("https://www.mailinator.com/v4/public/inboxes.jsp", {
    waitUntil: "domcontentloaded",
  });

  try {
    // Enter email address in the search field
    // CHANGE HERE: Update the selector '#inbox_field' if Mailinator changes the input field's ID or structure.
    await page.fill("#inbox_field", emailAddress);
    await page.press("#inbox_field", "Enter");

    // Wait for inbox to load (up to 30 seconds)
    // CHANGE HERE: Adjust the timeout (30000ms) if your emails take longer or shorter to appear.
    await page.waitForLoadState("networkidle");
    await page.waitForSelector("#inbox_pane", { timeout: 30000 });

    // Check for emails
    // CHANGE HERE: Update the selector 'div.msg-item' if Mailinator changes the email list item class.
    const emailRows = await page.$$("#inbox_pane");
    if (emailRows.length === 0) {
      throw new Error("No emails found in the inbox.");
    }

    // Click the most recent email
    // CHANGE HERE: Modify the selector 'div.msg-item:first-child' if you need a different email (e.g., second email) or if the class changes.

    await page
      .locator("#row_rumsan-1744370708-01313605839013")
      .getByRole("cell", { name: "team@rumsan.net" })
      .click();

    // Wait for email content
    // CHANGE HERE: Update the selector '#msg_body' or timeout (10000ms) if Mailinator changes the email content container or if loading is slower.
    await page.waitForSelector("#row_rumsan-1744370708-01313605839013", {
      timeout: 10000,
    });

    // Extract email content
    // CHANGE HERE: Update the selector '#msg_body' if the email content container ID changes.
    const emailContent = page
      .locator('iframe[name="html_msg_body"]')
      .contentFrame()    

    // Find 6-digit OTP
    // CHANGE HERE: Modify the regex /\b\d{6}\b/ if your OTP has a different format (e.g., 4 digits: /\b\d{4}\b/, or alphanumeric: /[A-Z0-9]{6}/).
    const otpMatch = emailContent.match(/\b\d{6}\b/);
    if (!otpMatch) {
      throw new Error("No 6-digit OTP found in the email.");
    }

    return otpMatch[0];
  } catch (error) {
    console.error(`Error retrieving OTP for ${emailAddress}: ${error.message}`);
    throw error;
  }
}

module.exports = { getOtpFromMailinator };
