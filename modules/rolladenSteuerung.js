const main = require("../index");
const temp = require("./temp");
main.app.post("/fensterZu", function (request, response) {
  console.log(berechneZeit());
  if (b >= 23 || b < 6) {
    console.log("mache rolladen zu");
    main.currentClientsws[0].send("101");
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