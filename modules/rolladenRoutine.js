const main = require("../index");
/**
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

main.app.post("/create", function (request, response) {
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

main.app.post("/deleteR", function (request, response) {
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
 */