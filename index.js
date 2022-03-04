/*ZimmerMatic Node.js Webserver*/
/*Index Datei, bindet alle Module des Modules Ordne ein, erstellt den Express Server,
sowie zwei websocket Server. Alle Whitelist Komponenten werden mit IP-Adresse gelistet.
Alle Websocket Verbindungen werden hier angenommen und losgeschickt*/

//Websocket Server
const WebSocket = require("ws");
const wssLED = new WebSocket.Server({ port: 8000 }); // abgespilteter WS Server auf anderem Port
exports.wssLED = wssLED;
//2. Websocket mit anderem Port
const wss = new WebSocket.Server({ port: 3000 }); // abgespilteter WS Server auf anderem Port
exports.wss = wss;
let ClientswsBrowser = [];
exports.ClientswsBrowser = ClientswsBrowser;
let clientsCn = 0;

let currentClientsws = [];
exports.currentClientsws = currentClientsws;
let anzClients = 2;

const schedule = require("node-schedule");
const cronParser = require("cron-parser");

const dotenv = require("dotenv");
dotenv.config();

//Logger4JS
const log4js = require("log4js");
log4js.configure({
  appenders: { cheese: { type: "file", filename: "cheese.log" } },
  categories: { default: { appenders: ["cheese"], level: "error" } },
});
const logger = log4js.getLogger("cheese");

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
app.use(express.static("templates"));

app.listen(port, () => {
  consoleLogTime("Restarting at:");
  console.log(`App listening at http://ZimmerMatic:${port}`); // Publisher Server auf Port 3443
  console.log("Die IP Adresse lautet: 192.168.0.138");
});

//Einpflegen der Module
const telegrambot = require("./modules/telegram.js");
const pflanzen = require("./modules/pflanzen.js");
const temp = require("./modules/temp");
const leds = require("./modules/leds");
const rS = require("./modules/rolladenSteuerung");
const rR = require("./modules/rolladenRoutine");
const Ikea = require("./modules/tradfri");
const time = require("./modules/zeit");
const logs = require("./modules/logfiles");
const homematic = require("./modules/homematic");
const mongodb = require("./modules/mongoDB");

//Globale Variablen
let status = true;
exports.status = status;

//D1 Mini Whitelist, um ihm besondere Dinge zu senden
let d1 = "::ffff:192.168.0.129";
let ledD1 = "::ffff:192.168.0.73";
let ledD1Sofa = "::ffff:192.168.0.64";
let ledD1UHR = "::ffff:192.168.0.76";
let ESP32UHR = "::ffff:192.168.0.128";
let ledD1Schreibtisch = "::ffff:192.168.0.78";
let ledD1EmelySchr = "::ffff:192.168.0.80";

/***********Halllo / Tschüss Button*******************/

app.get("/hello", function (req, res) {
  let goneTime = ((new Date().getTime() - mongodb.getLastGone("gehen")) / 60000);
  console.log(goneTime);
  console.log(new Date().getTime())
  let dbObj = {
    type: "kommen",
    date: time.getDBFormat(),
    time: time.getDBFormatTime(),
    milli: new Date().getTime(),
    calc: goneTime
  };
  mongodb.storeAnwesenheit(dbObj);
  consoleLogTime("Zuhause Angemeldet:");
  try {
    currentClientsws[1].send("256,161,20,100"); //DART
    currentClientsws[2].send("256,161,20,100"); //Sofa
    currentClientsws[3].send("40,191,255,255"); //Uhr
  } catch (error) {
    console.log("Client nicht Verfügbar!");
  }
  let a = new Date();
  if (a.getHours() >= 18 || a.getHours() <= 6) {
    Ikea.fetchLampe("BL", "Helligkeit", 30);
    Ikea.fetchLampe("BR", "Helligkeit", 30);
  } else {
    rS.rolladenUP();
  }
  if (a.getHours() < 21 || a.getHours() > 8) {
    homematic.heizungON(21);
  }
  res.sendStatus(200);
});

app.get("/tschuess", function (req, res) {
  let goneTime = ((new Date().getTime() - mongodb.getLastGone("kommen")) / 60000);
  let dbObj = {
    type: "gehen",
    date:  time.getDBFormat(),
    time: time.getDBFormatTime(),
    milli: new Date().getTime(),
    calc: goneTime
  };
  mongodb.storeAnwesenheit(dbObj);
  rS.rolladenDown();
  consoleLogTime("Abgemeldet:");
  for (let i = 0; i < currentClientsws.length; i++) {
    try {
      currentClientsws[i].send("0,0,0,0");
    } catch (error) {
      logger.error(error);
    }
  }
  Ikea.fetchLampe("BL", "Helligkeit", 0);
  Ikea.fetchLampe("BR", "Helligkeit", 0);
  Ikea.fetchLampe("BT", "Helligkeit", 0);
  homematic.heizungOff();
  res.sendStatus(200);
});

app.get("/EmergencyOne", function (req, res) {
  rS.rolladenDown();
  consoleLogTime("Emergeny!");
  let a = new Date();
  if (a.getHours() >= 22 || a.getHours() <= 7) {
    currentClientsws[4].send("255,255,255,100");
    currentClientsws[2].send("255,255,255,100");
    sleep(90000);
    currentClientsws[4].send("0,0,0,0");
    currentClientsws[2].send("0,0,0,0");
  } else {
    rS.rolladenUP();
    currentClientsws[4].send("255,255,255,40");
    currentClientsws[3].send("40,191,255,255");
  }
  function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }

  res.sendStatus(200);
});

/***************************************** */
//Websocket handling für alle whitelist Clients
wssLED.on("connection", function connection(ws, req) {
  console.log("Client connected!");
  //hole IP Adresse
  const ip = req.socket.remoteAddress;
  //updateConnection(ip, true);
  console.log(ip);
  /**Verbinden der Whitelist D1 mini */
  if (ip === d1) {
    console.log("client 0 verbunden!");
    currentClientsws[0] = ws;
  } else if (ip === ledD1) {
    console.log("client Dart verbunden!");
    currentClientsws[1] = ws;
  } else if (ip === ledD1Sofa) {
    console.log("client Sofa verbunden!");
    currentClientsws[2] = ws;
  } else if (ip === ledD1UHR) {
    console.log("client Uhr verbunden!");
    currentClientsws[3] = ws;
  } else if (ip === ledD1Schreibtisch) {
    console.log("client Tisch verbunden!");
    currentClientsws[4] = ws;
  } else if (ip === ledD1EmelySchr) {
    console.log("client Emely verbunden!");
    currentClientsws[5] = ws;
  } else if (ip == ESP32UHR) {
    console.log("Uhr Back To Future Verbunden!");
    currentClientsws[6] = ws;
  }
  //Sendet dem D1 mini als besonderen Client die Anweisungen hoch runter stop
  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
    //Einzige message die ankommen kann ist der Abstand vom Fenster
    rS.handleAbstand(message);
  });
  ws.on("close", (data) => {
    console.log("Client has disconnceted");
  });
});

wssLED.on("close", function close(ws, req) {
  console.log("Client disconnected on dis")
});

//Websocket für Browser Clients
wss.on("connection", function connection(ws, req) {
  ClientswsBrowser[clientsCn] = ws;
  temp.publish();
  pflanzen.publish();
  time.updateClock();
  Ikea.updateLicht();
  temp.publishDash();
  //broadcastRoutinen(); //Zeitweiße außer betrieb
  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
    switch (message) {
      case "hoch":
        rS.rolladenUP();
        break;
      case "stop":
        rS.rolladenStop();
        break;
      case "runter":
        rS.rolladenDown();
        break;
      case "getAbstand":
        try {
          currentClientsws[0].send("0");
        } catch (error) {
          console.log("Kein Abstand");
        }
        break;
      default:
    }
  });
  ws.on("close", (data) => { });
});

function consoleLogTime(incoming) {
  console.log("********************");
  console.log(incoming);
  console.log(time.berechneZeit());
  console.log(time.getTag());
  console.log("********************");
}
