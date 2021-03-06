const ws = new WebSocket("ws://192.168.0.138:3000");

let aktRoutine;

ws.addEventListener("open", (message) => {
  console.log("Client connected with server!");
});

ws.addEventListener("message", function (event) {
  const data = JSON.parse(event.data);
  //console.log(data);
  switch (data.type) {
    case "routineT0":
      document.getElementById("Routine1").innerText = "1.Routine " + String(data.value) + " ";
      break;
    case "routineT1":
      document.getElementById("Routine2").innerText = "2.Routine " + String(data.value) + " "
      break;
    case "routineT2":
      document.getElementById("Routine3").innerText = "3.Routine " + String(data.value) + " "
      break;
    case "routineT3":
      document.getElementById("Routine4").innerText = "4.Routine " + String(data.value) + " "
      break;
    case "routineT4":
      document.getElementById("Routine5").innerText = "5.Routine " + String(data.value) + " "
      break;
    case "routineR0":
      document.getElementById("RoutineR1").innerText = String(data.value);
      break;
    case "routineR1":
      document.getElementById("RoutineR2").innerText = String(data.value);
      break;
    case "routineR2":
      document.getElementById("RoutineR3").innerText = String(data.value);
      break;
    case "routineR3":
      document.getElementById("RoutineR4").innerText = String(data.value);
      break;
    case "routineR4":
      document.getElementById("RoutineR5").innerTex = String(data.value);
      break;
  }
});

function send() {
  console.log("sende");
  console.log(document.getElementById("inputTime").value);

  fetch("http://zimmermatic:3443/create", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      time: document.getElementById("inputTime").value,
      richtung: getRichtung(),
      einmalig: getEinmalig(),
    }),
  });
}

function getRichtung() {
  if (document.getElementById("Hoch").checked) {
    return "99"
  } else if (document.getElementById("Runter").checked) {
    return "101"
  }
}

function getEinmalig() {
  if (document.getElementById("Einmalig").checked) {
    return 1;
  } else {
    return 0;
  }
}

function sendDelete() {
  console.log("sende L??schen");
  console.log(document.getElementById("inputIndexDelete").value);
  fetch("/deleteR", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      num: (document.getElementById("inputIndexDelete").value) - 1,
    }),
  });
}

