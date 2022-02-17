const main = require("../index");

/**1.entweder erst umwandeln von Zeit in cron
 * oder direkt in cron
 * 2. anlegen von array der crons 
 * 3. koppieren und speichern in DB
 * 4. Zulassen von 10 Crons
 * 5. Löschmechankik für JOBs
 * 6. Editmechanik
*/
let CronJob = require('cron').CronJob;
let job = new CronJob('* * * * * *', function() {
  console.log('You will see this message every second');
}, null, true, 'America/Los_Angeles');
job.start();