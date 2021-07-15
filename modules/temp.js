const WebSocket = require("ws");
const main = require("../index.js");
const tel = require("./telegram");
let temp,
  feucht,
  temp2,
  feucht2,
  temp3,
  feucht3,
  zeit1,
  zeit2,
  zeit3,
  average;
exports.temp = temp;
function broadcast(feucht, temp, zeit, sender) {
    for (let i = 3; i < main.currentClientsws.length; i++) {
      main.currentClientsws[i].send(
        JSON.stringify({ type: "feuchtigkeit" + sender, value: feucht })
      );
      main.currentClientsws[i].send(
        JSON.stringify({ type: "temperatur" + sender, value: temp })
      );
      main.currentClientsws[i].send(
        JSON.stringify({ type: "zeit" + sender, value: zeit })
      );
      main.currentClientsws[i].send(
        JSON.stringify({ type: "average", value: average })
      );
    }
  }

/********************************Temperatursensoren******************************************* */

main.app.post("/", function (req, res) {
    temp = req.body.temperatur;
    feucht = req.body.feuchtigkeit;
    zeit1 = main.berechneZeit();
    console.log(
      "Temperatur1: " + temp + " Feuchtigkeit1: " + feucht + " Zeit: " + zeit1
    );
    getTempAverage();
    broadcast(feucht, temp, zeit1, "S1");
    res.sendStatus(200);
  });
  
  main.app.post("/senderZwei", function (req, res) {
    temp2 = req.body.temperatur;
    feucht2 = req.body.feuchtigkeit;
    zeit2 = main.berechneZeit();
    console.log(
      "Temperatur2: " + temp2 + " Feuchtigkeit2: " + feucht2 + " Zeit: " + zeit2
    );
    getTempAverage();
    broadcast(feucht2, temp2, zeit2, "S2");
    res.sendStatus(200);
  });
  
  main.app.post("/senderDrei", function (req, res) {
    temp3 = req.body.temperatur;
    feucht3 = req.body.feuchtigkeit;
    zeit3 = main.berechneZeit();
    console.log(
      "Temperatur3: " + temp3 + " Feuchtigkeit3: " + feucht3 + " Zeit: " + zeit3
    );
    getTempAverage();
    broadcast(feucht3, temp3, zeit3, "S3");
    res.sendStatus(200);
  });


//schließe Rolladen, wenn wärmer als 24 ° Durchschnitt
function getTempAverage() {
    average = ((temp + temp2 + temp3) / 3).toFixed(2);
    if (average > 24 /*&& main.status === true*/) {
      tel.sendM("Fahre Rolladen runter Temperatur >24°");
      main.rolladenDown();
      main.status = false; //setze status
    }
}
exports.getTempAverage = getTempAverage;

function publish(){
    broadcast(feucht, temp, zeit1, "S1");
    broadcast(feucht2, temp2, zeit2, "S2");
    broadcast(feucht3, temp3, zeit3, "S3");
}
exports.publish = publish;