# messengerdiscordchatintegration
This app will synchronise your discord chat with messenger chat.
(Currently it will copy messages from messenger into a discord chat)

<hr>
# Run it on Debian:
1. Make sure that "firefox-esr", "nodejs" and "npm" is installed on your machine,
   - `sudo apt update`
   - `sudo apt install firefox-esr`
   - `sudo apt install nodejs`
   - `sudo apt install npm`
2. edit `credentials.json`
   Example:
   ```
    {
      "fbUsername": "your_facebook_username/E-mail",
      "fbPassword": "facebook_password",
      "fbChatID": "you_will_find_it_at_the_end_of_the_URL",
      "dcBotToken": "Discord_bot_token",
      "dcChannelID": "Discord_channel_ID"
    }
   ```
4. type: "`$ npm install`"
5. type: "`$ npm start`"
