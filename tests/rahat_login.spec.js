const {test, expect}=require('@playwright/test');

test('Rahat Login',async({page})=>{
    await page.goto("https://ck.dev.rahat.io/")
    await page.locator("#email").fill("rumsan@mailinator.com")
    
})
