const ws = new WebSocket("ws://192.168.0.58:8000");
let aktRoutine;
ws.addEventListener("open", (message) => {
  console.log("Client connected with server!");
});

ws.addEventListener("message", function (event) {
  const data = JSON.parse(event.data);
  console.log(data);
  switch (data.type) {
    case "routineT0":
      document.getElementById("Routine1").innerTex = data.value;
      break;
    case "routineT1":
      document.getElementById("Routine2").innerTex = data.value;
      break;
    case "routineT2":
      document.getElementById("Routine3").innerTex = data.value;
      break;
    case "routineT3":
      document.getElementById("Routine4").innerTex = data.value;
      break;
    case "routineT4":
      document.getElementById("Routine5").innerTex = data.value;
      break;
    case "routineR0":
      document.getElementById("RoutineR1").innerTex = data.value;
      break;
    case "routineR1":
      document.getElementById("RoutineR2").innerTex = data.value;
      break;
    case "routineR2":
      document.getElementById("RoutineR3").innerTex = data.value;
      break;
    case "routineR3":
      document.getElementById("RoutineR4").innerTex = data.value;
      break;
    case "routineR4":
      document.getElementById("RoutineR5").innerTex = data.value;
      break;
  }
});

function btnfunction(number) {
  switch (number) {
    case 1:
      ws.send("hoch");
      break;
    case 2:
      ws.send("stop");
      break;
    case 3:
      ws.send("runter");
      break;

    default:
      break;
  }
}

function send() {
  console.log("sende");
  console.log(document.getElementById("inputTime").value);
  fetch("/create", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      time: document.getElementById("inputTime").value,
      richtung: document.getElementById("inputRichtung").value,
    }),
  });
  document.getElementById("inputTime").innerText = "Erfolgreich";
  document.getElementById("inputTime").innerText = "Erstellt";
}

function sendDelete() {
  console.log("sende Löschen");
  console.log(document.getElementById("inputIndexDelete").value);
  fetch("/deleteR", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      num: document.getElementById("inputIndexDelete").value,
    }),
  });
  document.getElementById("inputIndexDelete").innerText =
    "Erfolgreich gelöscht";
}
