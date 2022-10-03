const XLSX = require('xlsx');

const {
    DAYS,
    CLASS_TIME_RANGE_MS
} = require('./globals');
const {
    findArea, parseTime, getDayIndex,
    getDate, log
} = require('./utils');

// Matches 4 letters then 5 numbers.
const CLASS_CODE_REGEX = /[a-zA-Z]{4}\d{5}/;

// This object stores the data of all BSL classes in the week
// Structure: LSA_CLASS_DATA[MONDAY-FRI][ZONE][List of classes]
const LSA_CLASS_DATA = {};

/**
 * Loads the Excel sheet in directory, extracting information
 * and storing them in LSA_CLASS_DATA.
 */
function loadSheet() {
    // Read the Excel file
    let workbook;
    try {
        workbook = XLSX.readFile(process.env.EXCEL_FILE_NAME);
    } catch (e) {
        log(`[EXCEL] Something went wrong while opening the file! Path: ${process.env.EXCEL_FILE_NAME} Error: ${e}.`);
        return false;
    }

    // Returns the index of DAYS to use. Default: 0.
    const dayIndex = getDayIndex();

    DAYS.forEach(day => {
        // Check if the day tab exists.
        if (!(day in workbook.Sheets)) return;
        // Only load days after today (inclusive)
        if (DAYS.indexOf(day) < dayIndex) return;
        
        // For Debugging.
        let class_counter = 0;
        log(`[EXCEL] Reading classes on ${day}.`)

        XLSX.utils
            .sheet_to_json(workbook.Sheets[day]) // Convert the sheet to JSON
            .forEach(line => {
                // Trim valid class codes, and leave the rest
                // Valid class code: e.g. ABCD10001
                let subject = line['Name'];
                if(subject === undefined) {
                    log(`[EXCEL] ERROR: Subject column not found! ${JSON.stringify(line)}`)
                    return;
                }

                const classCode = subject.substring(0, 9);
                if (CLASS_CODE_REGEX.test(classCode)) subject = classCode;

                // Remove PAR- for simplicity
                let location = line['Allocated Location Name'];
                if(location === undefined) {
                    log(`[EXCEL] Error: Location column not found! ${JSON.stringify(line)}`)
                    return;
                }
                location = location.replaceAll('PAR-', '');


                // Find the LSA Area based on the location name.
                const area = findArea(location);
                if (area === undefined) return;

                // Find the starting time, and parse it to MS since UNIX.
                const time = line['Scheduled Start Time'];
                if(time === undefined) {
                    log(`[EXCEL] Error: Start time column not found! ${JSON.stringify(line)}`)
                    return;
                }
                const timeMS = parseTime(time, day).getTime();

                // Create empty objects or arrays if they don't exist.
                if (!(day in LSA_CLASS_DATA)) LSA_CLASS_DATA[day] = {};
                if (!(area in LSA_CLASS_DATA[day])) LSA_CLASS_DATA[day][area] = [];

                // Inserting data into the LSA_CLASS_DATA object.
                LSA_CLASS_DATA[day][area].push({ 
                    startMS: timeMS,
                    subject: subject,
                    time: time,
                    location: location
                });
                class_counter++;
            });

            // For Debugging.
            log(`[EXCEL] Total read classes on ${day}: ${class_counter}`)
            class_counter = 0;
    });
    return true;
}

/**
 * Returns a list of upcoming classes in a specified zone
 * 30 minutes from now.
 * @param zone Zone of class. See {@link LSA_AREAS} for valid zones.
 * @returns {*} List of upcoming classes. Empty array if none.
 */
function getUpcomingClasses(zone) {
    const date = getDate();

    // Using a day index: find day string (i.e. Monday)
    const dayIndex = getDayIndex();
    if (dayIndex === undefined) return;

    // Find classes in the next 30 minutes by day, zone and start time
    return LSA_CLASS_DATA[DAYS[dayIndex]][zone]
        .filter(data => data.startMS >= date.getTime() &&
            data.startMS <= date.getTime() + CLASS_TIME_RANGE_MS);
}

module.exports = {
    LSA_CLASS_DATA,
    loadSheet,
    getUpcomingClasses
};
