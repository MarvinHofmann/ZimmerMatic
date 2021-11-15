const ws = new WebSocket("ws://192.168.0.58:3000");

ws.addEventListener("open", () => {
  console.log("Client connected with server!");
  getStateFenster();
});

ws.addEventListener("message", function (event) {
  
  const data = JSON.parse(event.data);
  //console.log(data);
  switch (data.type) {
    case "uptime":
      document.getElementById("uptime").innerText = String(data.value);
      break;
    case "BR":
      console.warn("Ankommende zahl: " + data.value);
      checkState(data.value, "BR");
      break;
    case "BT":
      console.warn("Ankommende zahl: " + data.value);
      checkState(data.value, "BT");
      break;
    case "BL":
      console.warn("Ankommende zahl: " + data.value);
      checkState(data.value, "BL");
      break;
    case "Temp":
      document.getElementById("medianTemp").innerText = String(data.value);
      console.log(data.value);
      break;
    case "Feucht":
      document.getElementById("medianFeucht").innerText = String(data.value);
      console.log(data.value);
      break;
    case "High":
      document.getElementById("high").innerText = String(data.value) + "°C";
      console.log(data.value);
      break;
  }
});
function checkState(value, lampe) {
  console.warn(value);
  console.warn(lampe);
  if (value > 0) {
    console.log("Lampe ist an!");
    document.getElementById(lampe + "_Status").innerText = "ON";
    document.getElementById("lichtMain").innerText = "ON";
    document.getElementById("lichtMain").style.color = "green";
  } else {
    console.log("Lampe ist aus!");
    document.getElementById(lampe + "_Status").innerText = "OFF";
  }
}

function updateClock() {
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
  document.getElementById("aktzeit").innerText =
    "Es ist der " + String(getTag()) + " um " + String(zeit);
}
timer = setInterval(updateClock, 1000);

function getTag() {
  let dt = new Date();
  let month = "" + (dt.getMonth() + 1);
  let day = "" + dt.getDate();
  let year = dt.getFullYear();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  let dateF = [day, month, year].join(".");
  return dateF;
}

function getLog() {
  window.open("http://zimmermatic:3443/DownloadLog", "_blank");
}

function getLogComplete() {
  window.open("http://zimmermatic:3443/DownloadLogCom", "_blank");
}

function rolladenAktion(richtung) {
  let adresse = "http://zimmermatic:3443/rolladen" + richtung;
  fetch(adresse, { method: "GET" });
}

function getStateFenster() {
  let adresse = "http://192.168.0.58:8080/rest/items/DGFensterkontakt_State/state";
  fetch(adresse, {method: 'GET'}).then(response => response.text())
  .then((response) => {
      antwort = response;
      console.log(antwort);
      document.getElementById("fensterStatus").innerText = antwort;
  })
  .catch(err => console.log(err));   
}