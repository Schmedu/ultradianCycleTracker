// Name: Ultradian Cycle Tracker
// Description: This script tracks the time since the last login and notifies the user to take a break every 90 minutes.
// Tags: ultradian-cycle-tracker
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

const TIME_LIMIT = 90;
const INTERVAL_TIME = 5;

let database = await getSystemInfoDb();

// check if last login is more than 90 minutes ago
let lastLogin = Date.parse(database.lastLogin);

// how much time has passed since last login
let timeSinceLastLogin = new Date().getTime() - lastLogin;

// timeSinceLastLogin in Minutes
let timeSinceLastLoginInMinutes = parseInt(
  (timeSinceLastLogin / 1000 / 60).toFixed(0)
);

await menu(`${timeSinceLastLoginInMinutes}m`); // update the time in the menu bar

if (process.env.KIT_TRIGGER === "menu" || process.env.KIT_TRIGGER === "kar") {
  let currentDate = new Date().toISOString().slice(0, 10);
  let totalTime = database.dates[currentDate]?.totalTime || 0;
  totalTime += timeSinceLastLoginInMinutes;
  notify({
    title: "Working Time",
    body: `Currently: ${timeSinceLastLoginInMinutes.toFixed(0)}m - Total: ${(
      totalTime / 60
    ).toFixed(1)}h`,
  });
}

if (
  timeSinceLastLoginInMinutes >= TIME_LIMIT &&
  Number(timeSinceLastLoginInMinutes.toFixed(0)) % INTERVAL_TIME == 0 &&
  Date.parse(database.lastLogout) < lastLogin
) {
  notify({
    title: "Ultradian Cycle Tracker",
    body: `${timeSinceLastLoginInMinutes.toFixed(
      0
    )} mins worked! Take a break!`,
  });
}
