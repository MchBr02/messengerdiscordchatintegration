const {Client, IntentsBitField} = require('discord.js');
const credentials = require('./credentials.json');
const fs = require('fs');

// Create a new Discord client with intents
const client = new Client({ 
    intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMessages
    ] 
  });

// Get the list of files in the directory
const directory = 'screenshots/';
fs.readdir(directory, (err, files) => {
if (err) {
    console.error('Error reading directory:', err);
    return;
}

// Event triggered when the bot is ready
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);


    // Loop through each file
    files.forEach(async (file) => {
        try {
        // Send the file to the desired channel
        const channel = client.channels.cache.get(credentials.dcChannelID);
        await channel.send({
            files: [`${directory}/${file}`]
        });

        // Delete the file
        fs.unlinkSync(`${directory}/${file}`);
        console.log(`Sent and deleted ${file}`);
        } catch (error) {
        console.error(`Error sending ${file}: ${error}`);
        }
    });
    });
});

// Login the bot with your Discord token
client.login(credentials.dcBotToken);
