const axios = require('axios');

/**
 * Sends a POST request to a webhook link, with
 * a body of type, context, summary and tex.
 * @param link Link to post to.
 * @param message Message to send. See:
 * https://docs.microsoft.com/en-us/microsoftteams/platform/task-modules-and-cards/cards/cards-format?tabs=adaptive-md%2Cconnector-html
 * @param summary Summary of the message (displayed in notifications).
 */
function sendMessage(link, message, summary) {
    axios.post(link, {
        type: 'MessageCard',
        context: 'https://schema.org/extensions',
        summary: summary,
        text: message
    });
}

module.exports = {
    sendMessage
};
