/*ZimmerMatic Node.js Webserver*/
//Websocket Server
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8000 }); // abgespilteter WS Server auf anderem Port
const schedule = require("node-schedule");
let currentClientsws = [];
const cronParser = require("cron-parser");
// Init. EXpress Server
const express = require("express");
const app = express();

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

const TelegramBot = require("node-telegram-bot-api");
const token = "1885391976:AAE4_R-CQXXFZxIuz_AxFIyF6BuTdaWV2HM";
//const token1 = '1710906682:AAFpnBEr_fTgOGsQNN0zdjDcvzqIW_SBns4';
const bot = new TelegramBot(token, { polling: true });

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
  anzClients = 2,
  plFeucht1,
  plFeucht2,
  plFeucht3,
  average,
  plZeit1,
  plZeit2,
  plZeit3;
let status = true;
let anzAkk = 490,
  timeAkk;
let fenster = false;
let b;
//D1 Mini Whitelist, um ihm besondere Dinge zu senden
let d1 = "::ffff:192.168.0.62";
let ledD1 ="::ffff:192.168.0.73";

app.post("/fensterZu", function (request, response) {
  console.log(berechneZeit());
  if (b > 23) {
    console.log("mache rolladen zu")
    rolladenDown();
  }
  response.sendStatus(200);
});

app.get("/on", function (request, response) {
  currentClientsws[1].send("0");
  response.sendStatus(200);
});

app.get("/off", function (request, response) {
  currentClientsws[1].send("1");
  response.sendStatus(200);
});

app.post("/fenster", function (req, res) {
  if (req.body.status == 1) { // fenster offen
    fenster = true;  
  }else if (req.body.status == 0) {
    fenster = false;  //fenster zu
  }
  console.log("Fenster: " + fenster)
  res.sendStatus(200);
});


/********************************Temperatursensoren******************************************* */

app.post("/", function (req, res) {
  temp = req.body.temperatur;
  feucht = req.body.feuchtigkeit;
  zeit1 = berechneZeit();
  console.log(
    "Temperatur1: " + temp + " Feuchtigkeit1: " + feucht + " Zeit: " + zeit1
  );
  getTempAverage();
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
  getTempAverage();
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
  getTempAverage();
  broadcast(feucht3, temp3, zeit3, "S3");
  res.sendStatus(200);
});

/********************************Pflanzenüberwachung*********************************************/
app.post("/plfanze1", function (req, res) {
  plFeucht1 = req.body.feuchtigkeit;
  console.log("Pflanze 1: " + plFeucht1);
  plZeit1 = berechneZeit();
  broadcastPflanzen(plFeucht1, plZeit1, "S1");
  if (plFeucht1 >= 360) {
    //390 - 440
    bot.sendMessage(chatId, "Pflanze 1 bitte Gießen!");
  }
  res.sendStatus(200);
});

app.post("/plfanze2", function (req, res) {
  plFeucht2 = req.body.feuchtigkeit;
  console.log("Pflanze 2: " + plFeucht2);
  plZeit2 = berechneZeit();
  broadcastPflanzen(plFeucht2, plZeit2, "S2");
  if (plFeucht2 >= 320) {
    //380-410
    bot.sendMessage(chatId, "Pflanze 2 bitte Gießen!");
  }
  res.sendStatus(200);
});

app.post("/plfanze3", function (req, res) {
  plFeucht3 = req.body.feuchtigkeit;
  console.log("Pflanze 3: " + plFeucht3);
  plZeit3 = berechneZeit();
  broadcastPflanzen(plFeucht3, plZeit3, "S3");
  if (plFeucht3 >= 180) {
    //zw 180 && 200
    bot.sendMessage(chatId, "Pflanze 2 bitte Gießen!");
  }
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
  }else if (ip === ledD1) {
    console.log("client 1 verbunden!");
    currentClientsws[1] = ws;
  }else {
    currentClientsws[anzClients] = ws;
    anzClients++;
    broadcast(feucht, temp, zeit1, "S1");
    broadcast(feucht2, temp2, zeit2, "S2");
    broadcast(feucht3, temp3, zeit3, "S3");
    broadcastRoutinen();
    broadcastPflanzen(plFeucht1, plZeit1, "S1");
    broadcastPflanzen(plFeucht2, plZeit2, "S2");
    broadcastPflanzen(plFeucht3, plZeit3, "S3");
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
    for (let i = 2; i < currentClientsws.length; i++) {
      currentClientsws[i].send(
        JSON.stringify({ type: "abstand", value: abstand })
      );
    }
  }
}

// diese funktion schickt das übergebene Objekt , int , string oder json an alle verbundenen Clients
function broadcast(feucht, temp, zeit, sender) {
  for (let i = 2; i < currentClientsws.length; i++) {
    currentClientsws[i].send(
      JSON.stringify({ type: "feuchtigkeit" + sender, value: feucht })
    );
    currentClientsws[i].send(
      JSON.stringify({ type: "temperatur" + sender, value: temp })
    );
    currentClientsws[i].send(
      JSON.stringify({ type: "zeit" + sender, value: zeit })
    );
    currentClientsws[i].send(
      JSON.stringify({ type: "average", value: average })
    );
  }
}

function broadcastPflanzen(feucht, zeit, sender) {
  for (let i = 2; i < currentClientsws.length; i++) {
    currentClientsws[i].send(
      JSON.stringify({ type: "PLfeuchtigkeit" + sender, value: feucht })
    );
    currentClientsws[i].send(
      JSON.stringify({ type: "PLzeit" + sender, value: zeit })
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
//schließe Rolladen, wenn wärmer als 24 ° Durchschnitt
function getTempAverage() {
  average = ((temp + temp2 + temp3) / 3).toFixed(2);
  if (average > 24 && status === true) {
    bot.sendMessage(chatId, "Temperatur > 24°C Fahre Rolladen runter");
    rolladenDown();
    status = false;
  }
}

function rolladenUP() {
  if (average > 24) {
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
  for (let i = 2; i < currentClientsws.length; i++) {
    for (let l = 2; l < aCoutn; l++) {
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

/*********************************Telegram Bot**********************************/
//Start Messaage zum Anfangen der Kommunikation
let chatId;
bot.on("message", (msg) => {
  chatId = msg.chat.id;
  console.log(chatId);
  console.log(msg.text);
  switch (msg.text) {
    case "/temp":
      bot.sendMessage(chatId, "Die Temperatur im Mittel beträgt: " + average);
      break;
    case "/temp@zimmerMatic_Bot":
      bot.sendMessage(chatId, "Die Temperatur im Mittel beträgt: " + average);
      break;
    case "/status":
      bot.sendMessage(chatId, 
        "Durchschn. Temp: " + average 
      + "Temp1: " + temp
      + "Temp2: " + temp2
      + "Temp3: " + temp3
      + "Fenster: " + fensterabstand
      + "Pflanze3: " + plFeucht1
      + "Pflanze3: " + plFeucht2
      + "Pflanze3: " + plFeucht3);
      break;
    case "/akku":
      bot.sendMessage(chatId,"Anzahl Eingegangenen Sendungen mit Akku: " + anzAkk + " letze Zeit: " + timeAkk);
      break;
    case "/fs":
      currentClientsws[0].send("0");
      currentClientsws[0].send("0");
      if (fensterabstand > 13) {
        bot.sendMessage(
          chatId,
          "Das Fenster ist offen mit einem Abstand von: " + fensterabstand
        );
      } else {
        bot.sendMessage(
          chatId,
          "Das Fenster ist geschlossen mit einem Abstand von: " + fensterabstand
        );
      }
      break;
    case "/bf":
      if (fenster == true) {
        bot.sendMessage(chatId, "Das Fenster ist offen");
      } else {
        bot.sendMessage(chatId, "Das Fenster ist geschlossen");
      }
    default:
      break;
  }
});
