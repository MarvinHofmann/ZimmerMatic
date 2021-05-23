/*ZimmerMatic Node.js Webserver*/

//Websocket Server
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8000 }); // abgespilteter WS Server auf anderem Port
const schedule = require('node-schedule');
let currentClientsws = [];

let j;
// Init. EXpress Server
const express = require("express");
const app = express();

const port = 3443;
let bodyParser = require("body-parser");

app.use(express.static("public")); //Seite Läauft ganze zeit ohne init request
app.use(bodyParser.json());
app.listen(port, () => {
  console.log(`App listening at http://ZimmerMatic:${port}`); // Publisher Server auf Port 3443
  console.log("Die IP Adresse lautet: 192.168.0.58");
});

//Globale Variablen
let temp, feucht, temp2, feucht2, temp3, feucht3, zeit1, zeit2, zeit3, anzClients = 1;
let d1 = "::ffff:192.168.0.62";

//1.HTTP Get request
app.get("/", function (request, response) {
  console.log("Eingehende get request");
  response.sendStatus(200);
});

app.get("/test", function (request, response) {
  console.log("Eingehende get request");
  akt = erstelleJob('*/5 * * * *');
  response.sendStatus(200);
});

//2.Einrichten POST REQUEST d1 minis
app.post("/", function (req, res) {
  //console.log("Eingehende POST request");
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
  //console.log("Eingehende POST request");
  temp2 = req.body.temperatur;
  feucht2 = req.body.feuchtigkeit;
  zeit2 = berechneZeit();
  console.log("Temperatur2: " + temp2 + " Feuchtigkeit2: " + feucht2 + " Zeit: " + zeit2);
  broadcast(feucht2, temp2, zeit2, "S2");
  res.sendStatus(200);
});

app.post("/senderDrei", function (req, res) {
  //console.log("Eingehende POST request");
  temp3 = req.body.temperatur;
  feucht3 = req.body.feuchtigkeit;
  zeit3 = berechneZeit();
  console.log("Temperatur3: " + temp3 + " Feuchtigkeit3: " + feucht3 + " Zeit: " + zeit3);
  broadcast(feucht3, temp3, zeit3, "S3");
  res.sendStatus(200);
});

app.post("/routineRunter", function (req, res) {
  console.log("Eingehende POST request zur routine Runter");
  j = req.body.time;
  res.sendStatus(200);
});

app.post("/routineHoch", function (req, res) {
  console.log("Eingehende POST request zur routine");
  res.sendStatus(200);
});

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
  }

  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
    if(currentClientsws[0] != null){
      switch (message) {
        case 'hoch':
          currentClientsws[0].send("99");
          rolStatus = 0;
          break;
        case 'stop':
          rolStatus = 1;
          currentClientsws[0].send("100");
          break;
        case 'runter':
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
    currentClientsws[i].send(JSON.stringify({ type: "feuchtigkeit" + sender, value: feucht }));
    currentClientsws[i].send(JSON.stringify({ type: "temperatur" + sender, value: temp }));
    currentClientsws[i].send(JSON.stringify({ type: "zeit" + sender, value: zeit }));
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

let stringA = [];
stringA[0] = '*/3 * * * *';
stringA[1] = '*/5 * * * *';
stringA[2] = '*/5 * * * *';
let a = [];
for (let i = 0; i < 3; i++) {
   a[i] = schedule.scheduleJob(stringA[i], function(){
    console.log('scedule mit String ' + i);
    //currentClientsws[0].send("99");
  });
  console.log(a);
}


