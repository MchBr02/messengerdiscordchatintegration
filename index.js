const { Builder, By, Key, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const credentials = require('./credentials.json');
const fs = require('fs');
const { spawn } = require('child_process');


const executeScript = () => {
  // Spawn a new child process to run the script
  const dcBotProcess = spawn('node', ['dcBot.js']);

  // Print the output of the script
  dcBotProcess.stdout.on('data', (data) => {
    console.log(`Script output: ${data}`);
  });

  // Print any errors that occur during script execution
  dcBotProcess.stderr.on('data', (data) => {
    console.error(`Script error: ${data}`);
  });

  // Handle the script process exit
  dcBotProcess.on('close', (code) => {
    console.log(`Script exited with code ${code}`);
  });
};


(async function example() {
  console.log("Starting messenger to discord integration script...");

  let options = new firefox.Options();
  options.addArguments("-private");
  options.headless(); // Enable headless mode
  // Set the path to the Firefox binary if needed
  // options.setBinary('path/to/firefox');

  let driver = await new Builder()
    .forBrowser('firefox')
    .setFirefoxOptions(options)
    .build();

  try {
    console.log("Navigating to the login page...");
    await driver.get('https://www.facebook.com/messages/t/' + credentials.fbChatID);

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
    await driver.findElement(By.id('email')).sendKeys(credentials.fbUsername);
    console.log("Entering password...");
    await driver.findElement(By.css('input[id="pass"]')).sendKeys(credentials.fbPassword);

    // Click the login button
    console.log("Clicking the login button...");
    await driver.findElement(By.css('button[type=submit]')).click();

    // Wait until the chat page loads
    console.log("Waiting for the chat page to load...");
    await driver.wait(until.elementLocated(By.css('div > div[class="x1n2onr6"] > div[role="row"]')), 20000);

    console.log("Login successful!");
    
    console.log("Wait..."); await driver.sleep(5000); // Wait
    // Perform further actions on the dashboard page as required
    
    // Create a directory for screenshots
    fs.mkdirSync('screenshots', { recursive: true });


    // Capture screenshots of new div elements inside div[class="x1n2onr6"]
    let previousDivCount = await driver.findElements(By.css('div > div[class="x1n2onr6"] > div[role="row"]')).length;

    while (true) {
      await driver.sleep(2000); // Wait for 2 seconds before capturing a screenshot

      // Find the new div elements
      let divElements = await driver.findElements(By.css('div > div[class="x1n2onr6"] > div[role="row"]'));
      let currentDivCount = divElements.length;
      console.log(`currentDivCount: ${currentDivCount}`);

      if (currentDivCount > previousDivCount) {
        for (let i = previousDivCount; i < currentDivCount; i++) {
          let div = divElements[i];
          let screenshot = await div.takeScreenshot();
          fs.writeFileSync(`screenshots/screenshot_${i}.png`, screenshot, 'base64');
          console.log(`Screenshot saved as screenshot_${i}.png`);
        }
      }

      previousDivCount = currentDivCount;

      // Add a delay before the next iteration
      await driver.sleep(5000);

      // Call the function to execute the discord script
      executeScript();
    }
  }

   finally {
    console.log("Closing the browser...");
    await driver.quit();
  }
})();
