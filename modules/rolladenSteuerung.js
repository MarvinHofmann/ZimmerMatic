const main = require("../index");
const temp = require("./temp");
const lampen = require("./tradfri");
const led = require("./leds");

main.app.post('/fensterZu', function (request, response) {
  console.log("Soll ich fenster zu ?");
  let a = new Date();
  console.log("stunde: " + a.getHours());
  if (a.getHours() >= 12 || a.getHours() <= 18) {
    console.log("mache rolladen zu");
    try {
      main.currentClientsws[0].send("101");
    } catch (error) {
      console.log(error);
    }
    syncDelay(1500);    
    for (let i = 1; i < main.currentClientsws.length; i++) {
      try {
        currentClientsws[i].send("0,0,0,0");
      } catch (error1) {
        console.error(error1);
      }
    }
    syncDelay(3000);
    //status = true;
    lampen.fetchLampe("BL", "Helligkeit", 0);
    lampen.fetchLampe("BR", "Helligkeit", 0);
    
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
  let start = new Date().getTime();
  let end=0;
  while( (end-start) < milliseconds){
      end = new Date().getTime();
  }
 }

main.app.get('/rolladenUp' ,function(req, res){
  rolladenUP();
  res.sendStatus(200);
});

main.app.get('/rolladenDown' ,function(req, res){
  rolladenDown();
  res.sendStatus(200);
});