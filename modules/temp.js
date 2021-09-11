const WebSocket = require("ws");
const main = require("../index.js");
const tel = require("./telegram");
const rol = require("./rolladenSteuerung");
const zeit = require("./zeit.js");
const db = require("./db");
const { CLOSING } = require("ws");

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
let cntA = [0,0,0];
main.app.post("/", function (req, res) {
    temp = req.body.temperatur;
    feucht = req.body.feuchtigkeit;
    zeit1 = zeit.berechneZeit();
    console.log(
      "Temperatur1: " + temp + " Feuchtigkeit1: " + feucht + " Zeit: " + zeit1
    );
    getTempAverage();
    broadcast(feucht, temp, zeit1, "S1");
    handleDB(0,feucht,temp);
    res.sendStatus(200);
  });
  
  main.app.post("/senderZwei", function (req, res) {
    temp2 = req.body.temperatur;
    feucht2 = req.body.feuchtigkeit;
    zeit2 = zeit.berechneZeit();
    console.log(
      "Temperatur2: " + temp2 + " Feuchtigkeit2: " + feucht2 + " Zeit: " + zeit2
    );
    getTempAverage();
    broadcast(feucht2, temp2, zeit2, "S2");
    handleDB(1,feucht2,temp2);
    res.sendStatus(200);
  });
  
  main.app.post("/senderDrei", function (req, res) {
    temp3 = req.body.temperatur;
    feucht3 = req.body.feuchtigkeit;
    zeit3 = zeit.berechneZeit();
    console.log(
      "Temperatur3: " + temp3 + " Feuchtigkeit3: " + feucht3 + " Zeit: " + zeit3
    );
    getTempAverage();
    broadcast(feucht3, temp3, zeit3, "S3");
    handleDB(2,feucht2,temp3);
    res.sendStatus(200);
  });


//schließe Rolladen, wenn wärmer als 24 ° Durchschnitt
function getTempAverage() {
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

function publish(){
    broadcast(feucht, temp, zeit1, "S1");
    broadcast(feucht2, temp2, zeit2, "S2");
    broadcast(feucht3, temp3, zeit3, "S3");
}
exports.publish = publish;

exports.botSendStatus = function(){
  tel.sendM( 
    "Durchschn. Temp: " + average 
  + "Temp1: " + temp
  + "Temp2: " + temp2
  + "Temp3: " + temp3);
}

function handleDB(sender, feuchtIn, tempIn) {
  let a = new Date();
  cntA[sender]++;
  console.log(cntA[sender]);
  if (cntA[sender] == 4) {
    console.log("Habe 4 ");
    let jsonT = {
      feuchtigkeit: feuchtIn,
      temperatur: tempIn,
      date: String(a.getDate()) + String(a.getMonth()+1) + String(a.getUTCFullYear())
    };
    db.find({}, function (err, docs) {
      console.log(docs);
    });
    console.log("speichern!");
    db.store(jsonT, function (err) {
      if (err != null) {
        console.log(err);
      }else{
        console.log("erfolgreich gestored");
      }
    });
    cntA[sender] = 0;
  }
  console.log(cntA[sender]);
}

exports.publishDash = function(){
  for (let i = 0; i < main.ClientswsBrowser.length; i++) {
    main.ClientswsBrowser[i].send(
      JSON.stringify({ type: "Temp", value: average })
    );
    main.ClientswsBrowser[i].send(
      JSON.stringify({ type: "Feucht" , value: getFeuchtAverage() })
    );
    main.ClientswsBrowser[i].send(
      JSON.stringify({ type: "High", value: db.getTagesHoch() })
    );
  }
}