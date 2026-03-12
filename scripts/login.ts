// Name: Login Trigger
// Description: This script is triggered when the user logs in. Starts the timer for the current ultradian cycle.
/// System: unlock-screen
// Tags: ultradian-cycle-tracker, login
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

database.lastLogin = new Date().toString();
await database.write();

await menu("0m");
