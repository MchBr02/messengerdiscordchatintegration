const { Builder, By, Key, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const credentials = require('./credentials.json');
const fs = require('fs');
const { spawn } = require('child_process');

// ServiceBuilder configuration for GeckoDriver
const service = new firefox.ServiceBuilder('/usr/local/bin/geckodriver');

// Uncomment the next line if you want to see geckodriver output in the console
// service.setStdio('inherit');

// Firefox options configuration for headless execution
let options = new firefox.Options();
options.addArguments("-private");
options.addArguments("-headless");
options.setBinary('/usr/bin/firefox-esr');

// Function to execute the Discord script
const executeScript = () => {
  const dcBotProcess = spawn('node', ['dcBot.js']);

  dcBotProcess.stdout.on('data', (data) => {
    console.log(`Script output: ${data}`);
  });

  dcBotProcess.stderr.on('data', (data) => {
    console.error(`Script error: ${data}`);
  });

  dcBotProcess.on('close', (code) => {
    console.log(`Script exited with code ${code}`);
  });
};

// Main asynchronous function to run the Selenium script
(async function main() {
  console.log("Starting messenger to discord integration script...");

  let driver = await new Builder()
    .forBrowser('firefox')
    .setFirefoxService(service)
    .setFirefoxOptions(options)
    .build();

  try {
    console.log("Navigating to the login page...");
    await driver.get('https://www.facebook.com/messages/t/' + credentials.fbChatID);

    console.log("Waiting for the login page to load...");
    await driver.wait(until.elementLocated(By.id('email')), 10000);

    console.log("Clicking the accept_only_essential_button...");
    await driver.findElement(By.css('button[data-cookiebanner="accept_only_essential_button"]')).click();

    console.log("Entering login credentials...");
    await driver.findElement(By.id('email')).sendKeys(credentials.fbUsername);
    await driver.findElement(By.css('input[id="pass"]')).sendKeys(credentials.fbPassword);

    console.log("Clicking the login button...");
    await driver.findElement(By.css('button[type=submit]')).click();

    console.log("Waiting for the chat page to load...");
    await driver.wait(until.elementLocated(By.css('div > div[class="x1n2onr6"] > div[role="row"]')), 20000);

    console.log("Login successful!");
    console.log("Wait...");
    await driver.sleep(5000);

    fs.mkdirSync('screenshots', { recursive: true });

    let previousDivCount = await driver.findElements(By.css('div > div[class="x1n2onr6"] > div[role="row"]')).length;

    while (true) {
      await driver.sleep(2000);

      let divElements = await driver.findElements(By.css('div > div[class="x1n2onr6"] > div[role="row"]'));
      let currentDivCount = divElements.length;

      if (currentDivCount > previousDivCount) {
        for (let i = previousDivCount; i < currentDivCount; i++) {
          let div = divElements[i];
          let screenshot = await div.takeScreenshot();
          fs.writeFileSync(`screenshots/screenshot_${i}.png`, screenshot, 'base64');
          console.log(`Screenshot saved as screenshot_${i}.png`);
        }
      }

      previousDivCount = currentDivCount;

      await driver.sleep(5000);

      executeScript();
    }
  } finally {
    console.log("Closing the browser...");
    await driver.quit();
  }
})();
