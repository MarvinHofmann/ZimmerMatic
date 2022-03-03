const WebSocket = require("ws");
const main = require("../index.js");
const tel = require("./telegram");
const rol = require("./rolladenSteuerung");
const zeit = require("./zeit.js");
const db = require("./mongoDB");

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
exports.average = average;
function broadcast(feucht, temp, zeit, sender) {
  for (let i = 0; i < main.ClientswsBrowser.length; i++) {
    main.ClientswsBrowser[i].send(
      JSON.stringify({ type: "feuchtigkeit" + sender, value: feucht })
    );
    main.ClientswsBrowser[i].send(
      JSON.stringify({ type: "temperatur" + sender, value: temp })
    );
    main.ClientswsBrowser[i].send(
      JSON.stringify({ type: "zeit" + sender, value: zeit })
    );
    main.ClientswsBrowser[i].send(
      JSON.stringify({ type: "average", value: average })
    );
  }
}

/********************************Temperatursensoren******************************************* */
let cntA = [0, 0, 0];
main.app.post("/", function (req, res) {
  console.log("Angekommen: " + req.body.temperatur + " : " + req.body.feuchtigkeit + " S1");
  temp = req.body.temperatur;
  feucht = req.body.feuchtigkeit;
  zeit1 = zeit.berechneZeit();
  getTempAverage();
  broadcast(feucht, temp, zeit1, "S1");
  handleDB(0, feucht, temp);
  res.sendStatus(200);
});

main.app.post("/senderZwei", function (req, res) {
  console.log("Angekommen: " + req.body.temperatur + " : " + req.body.feuchtigkeit + " S2");
  temp2 = req.body.temperatur;
  feucht2 = req.body.feuchtigkeit;
  zeit2 = zeit.berechneZeit();
  getTempAverage();
  broadcast(feucht2, temp2, zeit2, "S2");
  handleDB(1, feucht2, temp2);
  res.sendStatus(200);
});

main.app.post("/senderDrei", function (req, res) {
  console.log("Angekommen: " + req.body.temperatur + " : " + req.body.feuchtigkeit + " S3");
  temp3 = req.body.temperatur;
  feucht3 = req.body.feuchtigkeit;
  zeit3 = zeit.berechneZeit();
  getTempAverage();
  broadcast(feucht3, temp3, zeit3, "S3");
  handleDB(2, feucht2, temp3);
  res.sendStatus(200);
});

let cntAverage = 0;
//schließe Rolladen, wenn wärmer als 24 ° Durchschnitt
function getTempAverage() {
  console.log("werte: " + cntAverage);
  cntAverage ++;
  if (cntAverage == 3) {
    cntAverage = 0;
    averageHum = ((feucht + feucht2 + feucht3) / 3).toFixed(2);
    average = ((temp + temp2 + temp3) / 3).toFixed(2);
    let obj = {
      feuchtigkeit: averageHum,
      temperatur: average,
      date: zeit.getDBFormat(),
      time: zeit.getDBFormatTime(),
      timestamp: new Date().toLocaleString("de-DE", {timeZone: "Europe/Berlin"})
    }
    db.storeMedian(obj, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("ferfolgreich geschrieben");
      }
    })
  }
  averageHum = ((feucht + feucht2 + feucht3) / 3).toFixed(2);
  average = ((temp + temp2 + temp3) / 3).toFixed(2);
  if (average > 24 /*&& main.status === true*/) {
    //tel.sendM("Fahre Rolladen runter Temperatur >24°");
    rol.rolladenDown();
    // main.status = false; //setze status
  }

}
exports.getTempAverage = getTempAverage;

function getFeuchtAverage() {
  return ((feucht + feucht2 + feucht3) / 3).toFixed(2);
}

function publish() {
  broadcast(feucht, temp, zeit1, "S1");
  broadcast(feucht2, temp2, zeit2, "S2");
  broadcast(feucht3, temp3, zeit3, "S3");
}
exports.publish = publish;

exports.botSendStatus = function () {
  tel.sendM(
    "Durchschn. Temp: " + average
    + "Temp1: " + temp
    + "Temp2: " + temp2
    + "Temp3: " + temp3);
}

function handleDB(sender, feuchtIn, tempIn) {
  cntA[sender]++;
  let a = new Date();
  if (cntA[sender] == 2) { // nur jede halbe Stunde ein Value
    let jsonT = {
      sender: sender,
      feuchtigkeit: feuchtIn,
      temperatur: tempIn,
      date: zeit.getDBFormat(),
      time: zeit.getDBFormatTime(),
      timestamp: new Date().toLocaleString("de-DE", {timeZone: "Europe/Berlin"})
    };
    //db.getAll();
    db.store(jsonT, function (err) {
      if (err != null) {
        console.log(err);
      } else {
        console.log("erfolgreich gestored");
      }
    });
    cntA[sender] = 0;
  }
}

exports.publishDash = function () {
  for (let i = 0; i < main.ClientswsBrowser.length; i++) {
    main.ClientswsBrowser[i].send(
      JSON.stringify({ type: "Temp", value: average })
    );
    main.ClientswsBrowser[i].send(
      JSON.stringify({ type: "Feucht", value: getFeuchtAverage() })
    );
  }
}