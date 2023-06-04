const { Builder, By, Key, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const credentials = require('./credentials.json');

(async function example() {
  console.log("Starting messenger to discord integration script...");

  let options = new firefox.Options();
  // Set the path to the Firefox binary if needed
  // options.setBinary('path/to/firefox');

  let driver = await new Builder()
    .forBrowser('firefox')
    .setFirefoxOptions(options)
    .build();

  try {
    console.log("Navigating to the login page...");
    await driver.get('https://www.facebook.com/messages/t/100005572934848/');

    // Wait until the login page loads
    console.log("Waiting for the login page to load...");
    await driver.wait(until.elementLocated(By.id('email')), 10000);
    //console.log("Waiting"); await new Promise(resolve => setTimeout(resolve, 3000));

    // Accept only essential cookies
    console.log("Clicking the accept_only_essential_button...");
    await driver.findElement(By.css('button[data-cookiebanner="accept_only_essential_button"]')).click();

    // Find the username and password fields and fill in your credentials
    console.log("Entering login credentials...");
    console.log("Entering username...");
    await driver.findElement(By.id('email')).sendKeys(credentials.username);
    console.log("Entering password...");
    await driver.findElement(By.css('input[id="pass"]')).sendKeys(credentials.password);

    // Click the login button
    console.log("Clicking the login button...");
    await driver.findElement(By.css('button[type=submit]')).click();

    // Wait until the chat page loads
    console.log("Waiting for the chat page to load...");
    await driver.wait(until.elementLocated(By.css('div[class="x1n2onr6"]')), 10000);

    console.log("Login successful!");
    // Perform further actions on the dashboard page as required

  } finally {
    console.log("Closing the browser...");
    await driver.quit();
  }
})();
