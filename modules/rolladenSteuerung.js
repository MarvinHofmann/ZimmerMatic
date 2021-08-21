const main = require("../index");
const temp = require("./temp");
const lampen = require("./tradfri");
const led = require("./leds");

main.app.post('/fensterZu', function (request, response) {
  console.log("Soll ich fenster zu ?");
  let a = new Date();
  console.log("stunde: " + a.getHours());
  if (a.getHours() >= 22 || a.getHours() <= 6) {
    console.log("mache rolladen zu");
    main.currentClientsws[0].send("101");
    lampen.fetchLampe("BL", "Helligkeit", 0);
    lampen.fetchLampe("BR", "Helligkeit", 0);
    
    main.currentClientsws[4].send("0,0,0,0");
    syncDelay(1500);
    main.currentClientsws[1].send("0,0,0,0");
    syncDelay(1500);
    main.currentClientsws[2].send("0,0,0,0");
    syncDelay(1500);
    main.currentClientsws[3].send("0");
    syncDelay(1500);
    //status = true;
  }
  response.sendStatus(200);
});

function rolladenUP() {
  if (temp.average > 24) {
    //status = false;
  }
  main.currentClientsws[0].send("99");
}
exports.rolladenUP = rolladenUP;
function rolladenStop() {
  main.currentClientsws[0].send("100");
}
exports.rolladenStop = rolladenStop;
function rolladenDown() {
  status = true;
  main.currentClientsws[0].send("101");
}
exports.rolladenDown = rolladenDown;

let fensterabstand;
function handleAbstand(abstand) {
  fensterabstand = abstand;
  if (abstand >= 13) {
    for (let i = 0; i < main.ClientswsBrowser.length; i++) {
      main.ClientswsBrowser[i].send(
        JSON.stringify({ type: "abstand", value: abstand })
      );
    }
  }
}
exports.handleAbstand = handleAbstand;

function syncDelay(milliseconds){
  var start = new Date().getTime();
  var end=0;
  while( (end-start) < milliseconds){
      end = new Date().getTime();
  }
 }