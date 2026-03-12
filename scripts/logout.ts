// Name: Logout Trigger
// Description: This script is triggered when the user logs out. Resets the timer for the current ultradian cycle.
// Author: Eduard Uffelmann
/// System: lock-screen
// Tags: ultradian-cycle-tracker, logout
// Author: Eduard Uffelmann
// Twitter: @schmedu_
// Linkedin: https://www.linkedin.com/in/euffelmann/
// Website: https://schmedu.com
// Group: Ultradian Cycle Tracker

import "@johnlindquist/kit";

async function getSystemInfoDb() {
    let database = await db(await kenvPath("db", "system-info.json"), {
        lastLogin: new Date().toString(),
        lastLogout: void 0,
        dates: {},
        currentTasks: [],
        wasShutDown: false,
    });
    return database;
}


let database = await getSystemInfoDb();

let now = new Date();

// get current date in format YYYY-MM-DD
let currentDate = now.toISOString().slice(0, 10);
let lastLogin = new Date(database.lastLogin);

let timeSinceLastLogin = (now.getTime() - lastLogin.getTime()) / 1000 / 60;
// parse date from loginTimeDate
let loginTimeDate = lastLogin.toISOString().slice(0, 10);
// check if loginTimeDate is today
if (loginTimeDate === currentDate) {
    if (database.dates[currentDate] === undefined) {
        database.dates[currentDate] = {
            totalTime: timeSinceLastLogin,
        };
    } else {
        database.dates[currentDate].totalTime += timeSinceLastLogin;
    }
} else {
    // create new date from midnight of today
    let midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0,
        0
    );
    // get minutes from lastLogin to midnight
    let minutesSinceLastLogin =
        (midnight.getTime() - lastLogin.getTime()) / 1000 / 60;
    if (database.dates[loginTimeDate] === undefined) {
        database.dates[loginTimeDate] = {
            totalTime: timeSinceLastLogin,
        };
    } else {
        database.dates[loginTimeDate].totalTime += timeSinceLastLogin;
        database.dates[loginTimeDate].totalTime += minutesSinceLastLogin;
    }

    // get minutes from midnight to now
    let minutesSinceMidnight = (now.getTime() - midnight.getTime()) / 1000 / 60;
    database.dates[currentDate].totalTime = minutesSinceMidnight;
}

database.lastLogout = now.toString();
await database.write();
await menu("")
