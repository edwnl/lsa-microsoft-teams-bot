# Learning Space Assistants (LSA) Bot
## Introduction
The University of Melbourne hosts Blended Synchronous Learning (BSL) Sessions, which are classes with participants attending both in person and online. 
The setup for these classes is often complicated, and Learning Space Assistants (LSA) roam around BSL enabled rooms to help tutors with any technical issues.

Given the Excel Spreadsheet containing all the BSL Sessions happening in a day (Example: [EXAMPLE Timetable.xlsx](https://github.com/EdwinCRL/LSA-Bot/files/9357641/EXAMPLE.BSL.Timetable.xlsx)), this bot will notify LSAs at least 10 minutes before a session happens, through a Microsoft Teams channel.
This simplifies and improves the accuracy of checking for classes as manual spreadsheet lookup is not needed, and human errors are reduced. (E.g. misreading, forgot to check, etc.)

## How it works
LSA Bot is developed using Node.js, and uses webhooks to deliver the messages.
1. The file `BSL.xlsx` is read, and class data is structured and stored in memory.
2. Every 30 minutes, code is ran to check for scheduled classes within half an hour. A list of class happening will be reported to the teams channel.
   (More details about when the code is executed can be found at the bottom of `bot.js`)

![windows_teams_msg](https://user-images.githubusercontent.com/19798018/185056341-2a42fe84-6285-4aa3-a415-a35f76e571d5.png)
![ios_notification](https://user-images.githubusercontent.com/19798018/185056349-a24ee705-6a3c-4f65-ba57-e64780371740.png)

## Further Reading
- dotenv: https://www.npmjs.com/package/dotenv
- node-cron: https://www.npmjs.com/package/node-cron
- xlsx: https://www.npmjs.com/package/xlsx
- axios: https://www.npmjs.com/package/axios

## Hosting
The LSA Bot is currently hosted on a US based Ubuntu server, using Process Manager 2. (https://pm2.keymetrics.io/)

## To try this bot

- Clone the repository

    ```bash
    git clone https://github.com/EdwinCRL/LSA-Bot.git
    ```

- Install modules

    ```bash
    npm install
    ```

- Create a file named `.env` in the root directory. Paste in the following, and fill in the webhook links as required. (More info: https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook)
  ```dotenv
   # Insert webhook links generated from a teams channel for each zone.
   HASS_ARTS=''
   HASS_BLE=''
   STEM=''
   SOUTHBANK=''
   LIFE_SCIENCES=''
   EXCEL_FILE_NAME='EXAMPLE BSL TIMETABLE.xlsx'
  ```
  
- Download the Example Excel File, and place it in the root directory: [EXAMPLE BSL Timetable.xlsx](https://github.com/EdwinCRL/LSA-Bot/files/9357641/EXAMPLE.BSL.Timetable.xlsx)

- Start the bot

    ```bash
    npm start
    ```

