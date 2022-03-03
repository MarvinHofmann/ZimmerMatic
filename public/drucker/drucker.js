let dSwitch = false;
const ws = new WebSocket("ws://192.168.0.138:3000");
let offen = false;

ws.addEventListener("open", (message) => {
  console.log("Client connected with server!");
  sendFetchBegin();
});

ws.addEventListener("message", function (event) {
  const data = JSON.parse(event.data);
  console.log(data.value);
  switch (data.type) {
    case "Dose":
      if (data.value == "ON") {
        document.getElementById("druck").checked = true;
      } else {
        document.getElementById("druck").checked = false;
        console.log("isOFF");
      }
      break;
  }
});

function zuOcto() {
  window.open('http://octopi.local');
}

function sendFetchBegin() {
  fetch("http://zimmermatic:3443/GetState", {
    method: "GET",
    headers: {
      "Content-Type": "application/JSON",
    }
  });
}

function sendFetch(value) {
  fetch("http://zimmermatic:3443/SD", {
    method: "POST",
    headers: {
      "Content-Type": "application/JSON",
    },
    body: JSON.stringify({ state: value }),
  });
}

function setStatusSteckdose(value) {
  dSwitch = value;

  if (dSwitch == true) {
    sendFetch("ON");
  } else {
    sendFetch("OFF");
  }
  console.log(value + ": Value");
}