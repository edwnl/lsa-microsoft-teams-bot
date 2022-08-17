const {
    DAYS,
    LSA_AREAS,
    CLASS_TIME_RANGE_MS
} = require('./globals');

// Matches 12:00 PM etc.
const TIME_REGEX = /^(0?[1-9]|1[0-2]):([0-5]\d)\s?((?:A|P)M)$/i;

/**
 * Removes a section from a string given
 * a start and end index.
 * @param str String to operate on.
 * @param start Starting index (inclusive)
 * @param end Ending index (exclusive)
 * @returns {string|*} Modified string.
 */
function removeStrRange(str, start, end) {
    if (start > str.length - 1 || end > str.length - 1 ||
        start <= 0 || end <= 0 ||
        end < start) return str;
    return str.substring(0, start) + str.substring(end);
}

/**
 * Given a date object, returns a trimmed version of
 * date.toLocaleTimeString(). e.g. 12:50:02PM -> 12:50 PM
 * @param date Date Object
 * @returns {string|*} Trimmed String
 */
function getTimeString(date) {
    const str = date.toLocaleTimeString();
    return removeStrRange(str, str.length - 6, str.length - 3);
}

/**
 * Returns a string containing the current time and
 * the time in 30 minutes. e.g. 12:00PM - 12:30PM
 * @returns {string} Result string.
 */
function getTimeRangeString() {
    const start = getDate();
    const end = new Date(start.getTime() + CLASS_TIME_RANGE_MS);

    return `${ getTimeString(start) } - ${ getTimeString(end) }`;
}

/**
 * Logs a message with a timestamp.
 * @param msg Message to log.
 */
function log(msg) {
    console.log(`[${ getDate().toLocaleString() }] ${ msg }`);
}

/**
 * Returns a date object in the Melbourne timezone.
 * @returns {Date} Date object in Melbourne Timezone.
 */
function getDate() {
    return new Date(
        new Date().toLocaleString('en-US', {
            timeZone: 'Australia/Melbourne'
        })
    );
}

/**
 * Returns the index of days in {@link DAYS} today.
 * Undefined if it's not Sat or Sun.
 * @returns {undefined|number} Index used to retrieve day.
 */
function getDayIndex() {
    const dayIndex = getDate().getDay() - 1;
    return (dayIndex < 0 || dayIndex > DAYS.length) ? 0 : dayIndex;
}

/**
 * Gets the date object for a target day, from {@link DAYS}.
 * Hour and minutes of the date object are set later.
 * @param day Day as a string. Valid options are {@link DAYS}
 * @returns {Date|undefined} Returns the date object, or undefined
 * if the day provided is invalid.
 */
function getDateObject(day) {
    // Safety check if day is Mon - Fri
    if (!DAYS.includes(day)) return undefined;

    const today = getDate();

    // days.indexOf(day) returns the target day's offset (0 - 4)
    const targetOffset = DAYS.indexOf(day);

    // today.getDate() - today.getDay() + 1 returns Monday
    const date = today.getDate() - today.getDay() + 1 + targetOffset;

    return new Date(today.setDate(date));
}

/**
 * Given a time (e.g. 12:00 PM), and a day (e.g. Monday),
 * return a Date object.
 * @param time Time in the format HH:MM [PM/AM]
 * @param day One of the days from {@link DAYS}
 * @returns {Date|undefined} Returns the date object
 * if the parameters are valid.
 */
function parseTime(time, day) {
    // Stores hour and minute.
    // times[0] = HH, times[1] = MM.
    const times = [];

    // Test to see if the time is valid.
    if (!TIME_REGEX.test(time)) return undefined;

    // Extract the hour and minute from time
    time.slice(0, time.length - 3) // Remove AM / PM
        .split(':') // Split by semicolon
        .forEach(str => times.push(parseInt(str))); // Cast each number to Int

    // Increase hours by 12 hours if PM is included.
    if (time.toLowerCase().includes(' pm') && times[0] !== 12) {
        times[0] += 12;
    }

    // Get the date object for the day.
    const date = getDateObject(day);
    if (date === undefined) return undefined;

    // Set hrs, min and secs.
    date.setHours(times[0]);
    date.setMinutes(times[1]);
    date.setSeconds(0);

    return date;
}

/**
 * Given a location, find the LSA area it belongs to.
 * Uses data from {@link LSA_AREAS}
 * @param location String location for a university room.
 * @returns {string|undefined} The area, or undefined if it's not found.
 */
function findArea(location) {
    // Loop through the keywords of each area and see
    // if it is included in the location name.
    for (const area in LSA_AREAS) {
        if (LSA_AREAS[area].find(element =>
            location.toLowerCase().includes(element.toLowerCase()))) {
            return area;
        }
    }
    log(`${ location } does not belong to an area!`);
    return undefined;
}

module.exports = {
    findArea, parseTime, getDayIndex, getDate, log, getTimeRangeString
};
