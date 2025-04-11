const { test, expect } = require("@playwright/test");



test("Login with OTP from email", async ({ page }) => {
  await page.goto(
    "https://cambodia.stage.rahat.io/auth/login?returnTo=%2Fdashboard"
  ); //write url
  await page.locator("#email").fill("manish@rumsan.net");
  await page.getByRole("button", { name: "Send OTP" }).click();
  await page.waitForTimeout(20000);
  await page.getByRole("button", { name: "Verify" }).click();
  await page.waitForURL(
    "https://cambodia.stage.rahat.io/dashboard#pagination=%7B%22page%22%3A1%2C%22perPage%22%3A10%7D&filters=%7B%7D&selectedListItems=%7B%7D"
  );
  await page.getByRole("link", { name: "Project" }).click();

  await expect(page.locator("#dashboard")).toBeVisible();

  await page.locator("div:nth-child(2) > .p-4 > .rounded-md").click();
  await page.close();
});
