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
let anzClients = 2;

const schedule = require("node-schedule");
const cronParser = require("cron-parser");

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

app.listen(port, () => {
  console.log("********************");
  console.log("Restarting at:");
  console.log(time.berechneZeit());
  console.log(time.getTag());
  console.log("********************");
  console.log(`App listening at http://ZimmerMatic:${port}`); // Publisher Server auf Port 3443
  console.log("Die IP Adresse lautet: 192.168.0.58");
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

//Globale Variablen
let status = true;
exports.status = status;

//D1 Mini Whitelist, um ihm besondere Dinge zu senden
let d1 = "::ffff:192.168.0.62";
let ledD1 = "::ffff:192.168.0.73";
let ledD1Sofa = "::ffff:192.168.0.64";
let ledD1UHR = "::ffff:192.168.0.76";
let ledD1Schreibtisch = "::ffff:192.168.0.78";
let ledD1EmelySchr = "::ffff:192.168.0.80";

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

app.get("/DownloadLog", function (req, res) {
  const file = `${__dirname}/cheese.log`;
  console.log("Anfrage kam an");
  console.log(file);
  res.download(file); // Set disposition and send it.
});

app.get("/DownloadLogCom", function (req, res) {
  console.log("********************");
  console.log("Download Anfrage");
  console.log(time.berechneZeit() + ", " + time.getTag());
  console.log("********************");
  const file = `${__dirname}/log-file.txt`;
  console.log(file);
  res.download(file); // Set disposition and send it.
});

app.get("/hello", function (req, res) {
  console.log("Nachricht kam an!");
  currentClientsws[1].send("255,161,20,100");
  currentClientsws[2].send("255,161,20,100");
  currentClientsws[3].send("40,191,255,255");
  let a = new Date();
  if (a.getHours() >= 18 || a.getHours() <= 6) {
    Ikea.fetchLampe("BL", "Helligkeit", 30);
    Ikea.fetchLampe("BR", "Helligkeit", 30);
  }
  rS.rolladenUP();
  res.sendStatus(200);
});

app.get("/tschuess", function (req, res) {
  console.log("Nachricht kam an!");
  for (let i = 0; i < currentClientsws.length; i++) {
    try {
      currentClientsws[i].send("0,0,0,0");
    } catch (error) {
      console.log(error);
      logger.error(error);
    }
  }
  Ikea.fetchLampe("BL", "Helligkeit", 0);
  Ikea.fetchLampe("BR", "Helligkeit", 0);
  rS.rolladenDown();
  res.sendStatus(200);
});

//Sagt, wenn ein Client verbunden ist oder wenn er disconnected
wssLED.on("connection", function connection(ws, req) {
  console.log("Client connected!");
  //hole IP Adresse
  const ip = req.socket.remoteAddress;
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
        rS.rolladenUP();
        break;
      case "stop":
        rS.rolladenStop();
        break;
      case "runter":
        rS.rolladenDown();
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