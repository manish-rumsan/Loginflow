// tests/loginFlow.js

const { test, expect } = require("@playwright/test");
const { getOtpFromMailinator } = require("./core");

/**
 * Automates a login flow using email and OTP.
 */
test("test automate", async ({ page }) => {
  // Launch browser

  try {
    // Define the email address
    // CHANGE HERE: Keep the random email to avoid conflicts in public Mailinator inboxes, or set a specific email (e.g., 'myfixedemail@mailinator.com') if required. Note: Specific emails may cause conflicts if others use the same inbox.
    const emailAddress = `rumsan@mailinator.com`;
    console.log(`Using email: ${emailAddress}`);

    // Navigate to login page
    // CHANGE HERE: Replace with your login page URL (e.g., 'https://myapp.com/login').
    await page.goto(
      "https://cambodia.stage.rahat.io/auth/login?returnTo=%2Fdashboard",
      {
        waitUntil: "domcontentloaded",
      }
    );

    // Step 1: Enter email (username)
    // CHANGE HERE: Update the selector '#email' to match your site's email input field (e.g., 'input[name="username"]').
    await page.fill("#email", emailAddress);
    // CHANGE HERE: Update the selector '#submit-email' to match your site's submit button.

    await page.getByRole("button", { name: "Send OTP" }).click();

    // Wait for OTP email to be triggered
    // CHANGE HERE: Adjust the timeout (2000ms) if your app's email delivery is slower or faster.
    await page.waitForTimeout(2000);

    // Step 2: Retrieve OTP from Mailinator
    const otp = await getOtpFromMailinator(page, emailAddress);
    console.log(`Retrieved OTP: ${otp}`);

    // Step 3: Enter OTP
    // CHANGE HERE: Update the selector '#otp' to match your site's OTP input field.
    await page.fill("#otp", otp);
    // CHANGE HERE: Update the selector '#submit-otp' to match your site's OTP submit button.
    await page.click("button[type='submit']");

    // Verify login success
    // CHANGE HERE: Update the selector '#welcome' to a selector that appears after successful login (e.g., 'div#dashboard').
  } catch (error) {
    console.error(`Login flow failed: ${error.message}`);
  } finally {
    // Close browser
    await page.close();
  }
});
