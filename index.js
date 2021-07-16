/*ZimmerMatic Node.js Webserver*/
//Websocket Server
const WebSocket = require("ws");
const wssLED = new WebSocket.Server({ port: 8000 }); // abgespilteter WS Server auf anderem Port
exports.wssLED = wssLED;

const wss = new WebSocket.Server({ port: 3000 }); // abgespilteter WS Server auf anderem Port
exports.wss = wss;
let ClientswsBrowser = [];
exports.ClientswsBrowser = ClientswsBrowser;
let clientsCn = 0;

let currentClientsws = [];
exports.currentClientsws = currentClientsws;

const schedule = require("node-schedule");

const cronParser = require("cron-parser");

// Init. EXpress Server
const express = require("express");
const app = express();
exports.app = app;
const port = 3443;

let bodyParser = require("body-parser");
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
//Einpflegen der Module 
const telegrambot = require("./modules/telegram.js");
const pflanzen = require("./modules/pflanzen.js");
const temp = require("./modules/temp");
const leds = require("./modules/leds");

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

//Sagt, wenn ein Client verbunden ist oder wenn er disconnected
wssLED.on("connection", function connection(ws, req) {
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
  }
  //Sendet dem D1 mini als besonderen Client die Anweisungen hoch runter stop
  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
    //Einzige message die ankommen kann ist der Abstand vom Fenster
    handleAbstand(message);   
  });
  ws.on("close", (data) => {
    console.log("Client has disconnceted");
  });
});

wss.on("connection", function connection(ws, req) {
  console.log("Client connected!");
  ClientswsBrowser[clientsCn] = ws;
  temp.publish();
  pflanzen.publish();
  //broadcastRoutinen();
  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
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
    for (let i = 0; i < ClientswsBrowser.length; i++) {
      ClientswsBrowser[i].send(
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

