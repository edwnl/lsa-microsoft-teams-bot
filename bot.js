const cron = require('node-cron');

const { getUpcomingClasses, loadSheet } = require('./utils/excel');
const { sendMessage } = require('./webhooks/teamsWebhook');
const {
    getDate,
    log,
    getTimeRangeString
} = require('./utils/utils');

// Import required bot configuration.
require('dotenv').config();

// Logs the time the bot is started, since Excel sheet
// may be updated during the week. (To update data fed to
// the bot (i.e. Excel Sheet), a manual restart is required.)
const startDate = getDate(); // TODO: Dynamically load excel Sheet

// LSA Zones, and their channel links
const LSA_CHANNELS = {
    HASS_Arts: process.env.HASS_ARTS,
    HASS_BLE: process.env.HASS_BLE,
    STEM: process.env.STEM,
    Life_Sciences: process.env.LIFE_SCIENCES,
    Southbank: process.env.SOUTHBANK
};

// Bot starting logic.
log('Starting LSA Bot.');

// Loads the Excel sheet in directory.
if (!loadSheet()) return;

log('LSA Bot is ready!');

/**
 * Updates all LSA Zone Channels with classes in 30 minutes.
 */
function updateChannels() {
    for (const zone in LSA_CHANNELS) {
        // String representing the time range of classes.
        const timeString = getTimeRangeString();

        // Retrieve the channel link for the Zone. Return if no link defined for Zone
        const link = LSA_CHANNELS[zone];
        if (link === undefined) {
            log(`No webhook link found for zone ${ zone }! Make sure the link is present in the .env file.`);
            continue;
        }

        // Upcoming Classes for the Zone. Return if no classes are happening
        const classes = getUpcomingClasses(zone);
        if (classes.length === 0) continue;

        log(`Announcing ${ classes.length } classes coming up in zone ${ zone }, from ${ timeString }.`);

        // Construct message for the LSA Zone Channel
        let text = `## Upcoming BSL Class${ (classes.length > 1 ? 'es' : '') }\n\n` +
            `**Zone**: ${ zone.replaceAll('_', ' ') }\n\n` +
            `**Time**: ${ timeString }\n\nㅤ\n\n`; // Invisible character to force empty line

        classes.forEach(data => { text += `**${ data.time }** - ${ data.location } - ${ data.subject }\n\n`; });

        text += 'ㅤ\n\n*Messages are sent every 5th and 35th minute of the hour, and ' +
                    'announces classes happening in the next 30 minutes. ' +
                    'No message will be sent if no classes are scheduled.*' +
                    `\n\n*Excel data last updated: ${ startDate.toLocaleString() }*`;

        // Construct summary message for notifications. (e.g. 4 Science BSL Classes 1:00 PM - 1:30 PM)
        const summary = `${ classes.length } ${ zone.replaceAll('_', ' ') } ` +
                        `BSL class${ (classes.length > 1 ? 'es' : '') } ${ timeString }\n\n`;

        // Send the message to teams
        sendMessage(link, text, summary);
    }
}

// Update Channels every 5th and 35th minute of the hour.
// Runs from 8am to 8pm, Monday to Friday in the Melbourne timezone.
// Most classes start at 0, 15, 30 and 45th min, meaning a min 10 reminder.
cron.schedule('5,35 8-20 * * 1-5', () => updateChannels(), { timezone: 'Australia/Melbourne' });
