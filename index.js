/*ZimmerMatic Node.js Webserver*/
//Websocket Server
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8000 }); // abgespilteter WS Server auf anderem Port
const schedule = require("node-schedule");
let currentClientsws = [];

// Init. EXpress Server
const express = require("express");
const app = express();

const port = 3443;
let bodyParser = require("body-parser");
app.use(bodyParser.json());

//express.static sucht im Ordner public nach der Index.js Datei und publisht sie direkt
app.use(express.static("public"));

app.listen(port, () => {
  console.log(`App listening at http://ZimmerMatic:${port}`); // Publisher Server auf Port 3443
  console.log("Die IP Adresse lautet: 192.168.0.58");
});

//Globale Variablen
let temp,
  feucht,
  temp2,
  feucht2,
  temp3,
  feucht3,
  zeit1,
  zeit2,
  zeit3,
  anzClients = 1,
  plFeucht1,
  plFeucht2,
  plFeucht3;
//D1 Mini Whitelist, um ihm besondere Dinge zu senden
let d1 = "::ffff:192.168.0.62";

//1.HTTP Get request
app.get("/", function (request, response) {
  console.log("Eingehende get request");
  response.sendStatus(200);
});

/********************************Temperatursensoren******************************************* */

app.post("/", function (req, res) {
  temp = req.body.temperatur;
  feucht = req.body.feuchtigkeit;
  zeit1 = berechneZeit();
  console.log(
    "Temperatur1: " + temp + " Feuchtigkeit1: " + feucht + " Zeit: " + zeit1
  );
  broadcast(feucht, temp, zeit1, "S1");
  res.sendStatus(200);
});

app.post("/senderZwei", function (req, res) {
  temp2 = req.body.temperatur;
  feucht2 = req.body.feuchtigkeit;
  zeit2 = berechneZeit();
  console.log(
    "Temperatur2: " + temp2 + " Feuchtigkeit2: " + feucht2 + " Zeit: " + zeit2
  );
  broadcast(feucht2, temp2, zeit2, "S2");
  res.sendStatus(200);
});

app.post("/senderDrei", function (req, res) {
  temp3 = req.body.temperatur;
  feucht3 = req.body.feuchtigkeit;
  zeit3 = berechneZeit();
  console.log(
    "Temperatur3: " + temp3 + " Feuchtigkeit3: " + feucht3 + " Zeit: " + zeit3
  );
  broadcast(feucht3, temp3, zeit3, "S3");
  res.sendStatus(200);
});

/********************************Pflanzenüberwachung*********************************************/
app.post("/plfanze1", function (req, res) {
  res.sendStatus(200);
});

app.post("/plfanze2", function (req, res) {
  res.sendStatus(200);
});

app.post("/plfanze3", function (req, res) {
  res.sendStatus(200);
});
/***********************************************************************************************/

//Sagt euch wenn ein Client verbunden ist oder wenn er disconnected
wss.on("connection", function connection(ws, req) {
  console.log("Client connected!");

  const ip = req.socket.remoteAddress;
  console.log(ip);
  if (ip === d1) {
    console.log("client 0 verbunden!");
    currentClientsws[0] = ws;
  } else {
    currentClientsws[anzClients] = ws;
    anzClients++;
    broadcast(feucht, temp, zeit1, "S1");
    broadcast(feucht2, temp2, zeit2, "S2");
    broadcast(feucht3, temp3, zeit3, "S3");
    broadcastRoutinen();
  }
  //Sendet dem D1 mini als besonderen Client die Anweisungen hoch runter stop
  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
    if (currentClientsws[0] != null) {
      switch (message) {
        case "hoch":
          currentClientsws[0].send("99");
          rolStatus = 0;
          break;
        case "stop":
          rolStatus = 1;
          currentClientsws[0].send("100");
          break;
        case "runter":
          rolStatus = 2;
          currentClientsws[0].send("101");
          break;
      }
    }
  });

  ws.on("close", (data) => {
    console.log("Client has disconnceted");
  });
});

// diese funktion schickt das übergebene Objekt , int , string oder json an alle verbundenen Clients
function broadcast(feucht, temp, zeit, sender) {
  for (let i = 1; i < currentClientsws.length; i++) {
    currentClientsws[i].send(
      JSON.stringify({ type: "feuchtigkeit" + sender, value: feucht })
    );
    currentClientsws[i].send(
      JSON.stringify({ type: "temperatur" + sender, value: temp })
    );
    currentClientsws[i].send(
      JSON.stringify({ type: "zeit" + sender, value: zeit })
    );
  }
}

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

/*****************************************RolladenRoutine********************************************* */

let timeArray = [];
let jobArray = [];
let richArray = [];
aCoutn = 0;

function erstelleRoutine(richtung) {
  jobArray[aCoutn] = schedule.scheduleJob(timeArray[aCoutn], function () {
    console.log("Führe Routine aus");
    currentClientsws[0].send(richtung);
  });
}

function loescheRoutine(index) {
  jobArray[index].cancel();
  jobArray.splice(index, 1);
  timeArray.splice(index, 1);
  richArray.splice(index, 1);
  jobArray = cleanArray(jobArray);
  timeArray = cleanArray(timeArray);
  richArray = cleanArray(richArray);
  aCoutn--;
  console.log("routine gelöscht");
}

app.post("/create", function (request, response) {
  console.log("Eingehende post request");
  timeArray[aCoutn] = request.body.time;
  richArray[aCoutn] = getRichtung(request.body.richtung);
  erstelleRoutine(request.body.richtung);
  console.log(jobArray);
  console.log(timeArray);
  console.log(richArray);
  aCoutn++;
  response.sendStatus(200);
});

app.post("/deleteR", function (request, response) {
  console.log("Eingehende delete request");
  loescheRoutine(request.body.num);
  console.log(jobArray);
  console.log(timeArray);
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
  for (let i = 1; i < aCoutn; i++) {
    currentClientsws[i].send(
      JSON.stringify({ type: "routineT" + i, value: timeArray[i] })
    );
    currentClientsws[i].send(
      JSON.stringify({ type: "routineR" + i, value: richArray[i] })
    );
  }
}

function getRichtung(num) {
  switch (num) {
    case 99:
      return "Hoch";
    case 101:
      return "Runter"
    default:
      break;
  }
}
