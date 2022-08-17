const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const LSA_AREAS = {
    HASS_Arts: [
        'Arts West',
        'Old Arts',
        'Building 125',
        'Food and Nutrition Building'
    ],
    HASS_BLE: [
        'FBE',
        'The Spot',
        'Law',
        'Kwong Lee Dow',
        '100 Leicester St'
    ],
    STEM: [
        'Chemistry',
        'Glyn Davis',
        'Peter Hall',
        'Engineering',
        'Metallurgy',
        'Redmond Barry',
        'Melbourne Connect',
        'McCoy'
    ],
    Life_Sciences: [
        'Alan Gilbert',
        '780 Elizabeth St',
        '780 Elisabeth St'
    ],
    Southbank: [
        'Southbank'
    ],
    UNKNOWN: [
        'Swinburne'
    ]
};

const LSA_CHANNELS = {
    HASS_Arts: process.env.HASS_ARTS,
    HASS_BLE: process.env.HASS_BLE,
    STEM: process.env.STEM,
    Life_Sciences: process.env.LIFE_SCIENCES,
    Southbank: process.env.SOUTHBANK
};

const CLASS_TIME_RANGE_MS = 1.8e+6; // 1.8e+6 is 30 min in MS

module.exports = { DAYS, LSA_AREAS, LSA_CHANNELS, CLASS_TIME_RANGE_MS };
