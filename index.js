/*ZimmerMatic Node.js Webserver*/
//Websocket Server
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8000 }); // abgespilteter WS Server auf anderem Port
exports.wss = wss;
const schedule = require("node-schedule");
let currentClientsws = [];
exports.currentClientsws = currentClientsws;
const cronParser = require("cron-parser");
// Init. EXpress Server
const express = require("express");
const app = express();
exports.app = app;

const port = 3443;
let bodyParser = require("body-parser");
//exports.bodyParser = bodyParser;
app.use(bodyParser.json());
const path = require("path");
//express.static sucht im Ordner public nach der Index.js Datei und publisht sie direkt
app.use(express.static("public"));

//Cors
const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.listen(port, () => {
  console.log(`App listening at http://ZimmerMatic:${port}`); // Publisher Server auf Port 3443
  console.log("Die IP Adresse lautet: 192.168.0.58");
});

const telegrambot = require("./modules/telegram.js");
const pflanzen = require("./modules/pflanzen.js");
const temp = require("./modules/temp");

//Globale Variablen
let anzClients = 2;
let status = true;
exports.status = status;
let b;
//D1 Mini Whitelist, um ihm besondere Dinge zu senden
let d1 = "::ffff:192.168.0.62";
let ledD1 ="::ffff:192.168.0.73";
let ledD1Sofa ="::ffff:192.168.0.64";

app.post("/fensterZu", function (request, response) {
  console.log(berechneZeit());
  if (b >= 23 || b < 6) {
    console.log("mache rolladen zu")
    currentClientsws[0].send("101");
    status = true;
  }
  response.sendStatus(200);
});

app.get("/on", function (request, response) {
  currentClientsws[1].send("0");
  currentClientsws[2].send("0");
  response.sendStatus(200);
});

app.get("/off", function (request, response) {
  currentClientsws[1].send("1");
  currentClientsws[2].send("1");
  response.sendStatus(200);
});

//Sagt, wenn ein Client verbunden ist oder wenn er disconnected
wss.on("connection", function connection(ws, req) {
  console.log("Client connected!");
  //hole IP Adresse
  const ip = req.socket.remoteAddress;
  console.log(ip);
  if (ip === d1) {
    console.log("client 0 verbunden!");
    currentClientsws[0] = ws;
  }else if (ip === ledD1) {
    console.log("client Dart verbunden!");
    currentClientsws[1] = ws;
  }else if (ip === ledD1Sofa) {
    console.log("client Sofa verbunden!");
    currentClientsws[2] = ws;
  }else {
    currentClientsws[anzClients] = ws;
    anzClients++;
    temp.publish();
    pflanzen.publish();
    broadcastRoutinen();
  }
  //Sendet dem D1 mini als besonderen Client die Anweisungen hoch runter stop
  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
    if (currentClientsws[0] != null) {
      switch (message) {
        case "hoch":
          rolladenUP();
          break;
        case "stop":
          rolladenStop();
          break;
        case "runter":
          rolladenDown();
          break;
        case "getAbstand":
          currentClientsws[0].send("0");
          break;
        default:
          handleAbstand(message);
      }
    }
  });

  ws.on("close", (data) => {
    console.log("Client has disconnceted");
  });
});
let fensterabstand;
function handleAbstand(abstand) {
  fensterabstand = abstand;
  if (abstand >= 13) {
    for (let i = 3; i < currentClientsws.length; i++) {
      currentClientsws[i].send(
        JSON.stringify({ type: "abstand", value: abstand })
      );
    }
  }
}

// diese funktion schickt das übergebene Objekt , int , string oder json an alle verbundenen Clients
function berechneZeit() {
  let a = new Date();
  b = c = d = zeit = 0;
  b = a.getHours();
  c = a.getMinutes();
  d = a.getSeconds();
  if (b < 10) {
    b = "0" + b;
  }
  if (c < 10) {
    c = "0" + c;
  }
  if (d < 10) {
    d = "0" + d;
  }
  zeit = b + ":" + c + ":" + d;
  return zeit;
}
exports.berechneZeit = berechneZeit;

function rolladenUP() {
  if (temp.average > 24) {
    status = false;
  }
  currentClientsws[0].send("99");
}

function rolladenStop() {
  currentClientsws[0].send("100");
}

function rolladenDown() {
  status = true;
  currentClientsws[0].send("101");
}
exports.rolladenDown = rolladenDown;

/*****************************************RolladenRoutine********************************************* */
const prettyCron = require("prettycron");
let timeArray = [];
let jobArray = [];
let richArray = [];
let realTime = [];
let anzLoesch = 0;
aCoutn = 0;

function erstelleRoutine(richtung, isEinmalig, index) {
  jobArray[aCoutn] = schedule.scheduleJob(timeArray[aCoutn], function () {
    console.log("Führe Routine aus");
    currentClientsws[0].send(richtung);
    console.log(index - anzLoesch);
    if (isEinmalig == 1) {
      loescheRoutine(index - anzLoesch);
      console.log("lösche routine");
    }
  });
}

function loescheRoutine(index) {
  jobArray[index].cancel();
  jobArray.splice(index, 1);
  timeArray.splice(index, 1);
  richArray.splice(index, 1);
  realTime.splice(index, 1);
  realTime = cleanArray(realTime);
  jobArray = cleanArray(jobArray);
  timeArray = cleanArray(timeArray);
  richArray = cleanArray(richArray);
  anzLoesch++;
  aCoutn--;
  console.log("routine gelöscht");
}

app.post("/create", function (request, response) {
  console.log("Eingehende post request");
  let time = request.body.time;
  let einmalig = request.body.einmalig;
  timeArray[aCoutn] = request.body.time;
  richArray[aCoutn] = getRichtung(request.body.richtung);
  if (einmalig == 1) {
    realTime[aCoutn] = getStringEinmal(prettyCron.toString(time));
  } else {
    realTime[aCoutn] = prettyCron.toString(time);
  }
  erstelleRoutine(request.body.richtung, einmalig, aCoutn);
  console.log(realTime);
  console.log(jobArray);
  console.log(timeArray);
  console.log(richArray);
  console.log("Einmalig: " + einmalig);
  aCoutn++;
  response.sendStatus(200);
});

app.post("/deleteR", function (request, response) {
  console.log("Eingehende delete request");
  loescheRoutine(request.body.num);
  console.log(jobArray);
  console.log(timeArray);
  console.log(request.body.num);
  response.sendStatus(200);
});

function cleanArray(actual) {
  var newArray = new Array();
  for (var i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}

function broadcastRoutinen() {
  for (let i = 3; i < currentClientsws.length; i++) {
    for (let l = 0; l < aCoutn; l++) {
      currentClientsws[i].send(
        JSON.stringify({ type: "routineT" + l, value: realTime[l] })
      );
      currentClientsws[i].send(
        JSON.stringify({ type: "routineR" + l, value: richArray[l] })
      );
    }
  }
}

function getRichtung(num) {
  switch (num) {
    case "99":
      return "Hoch";
    case "101":
      return "Runter";
    default:
      break;
  }
}

function getStringEinmal(string) {
  split = Array.from(string);
  return (
    split[0] +
    split[1] +
    split[2] +
    split[3] +
    split[4] +
    split[5] +
    String("Einmalig")
  );
}
