const ws = new WebSocket("ws://192.168.0.138:3000");

ws.addEventListener("open", () => {
  console.log("Client connected with server!");
  getStateFenster("RaumFenster");
  getStateFenster("DGFensterkontakt");
  getStateHeizung("HZF_ST")
  getStateHeizung("HZFen_ST")
  getStateHeizung("HZF_AT")
  getStateHeizung("HZFen_AT")
  getTagesHoch()
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

async function getStateFenster(who) {
  let adresse = "http://192.168.0.138:8080/rest/items/" + who + "_State/state";
  const antwort = await fetch(adresse, { method: 'GET' }).then(response => response.text());
  console.log(antwort);
  document.getElementById(who).innerText = antwort;
}

async function getStateHeizung(who) {
  let adresse = "http://192.168.0.138:8080/rest/items/" + who + "/state";
  const antwort = await fetch(adresse, { method: 'GET' }).then(response => response.text());
  document.getElementById(who).innerText = String(antwort);
}

async function getTagesHoch() {
  let adresse = "http://zimmermatic:3443/db/tageshoch";
  const antwort = await fetch(adresse, { method: 'GET' }).then(response => response.text());
  document.getElementById("high").innerText = String(antwort);
}

async function setupMedium() {
  const ctx = document.getElementById("Durchschnitt").getContext("2d");
  const dataTemps = await getData("medium");
  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: dataTemps.times,
      datasets: [
        {
          label: "Temperatur in °C",
          data: dataTemps.temps,
          fill: false,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          borderWidth: 1,
        },
        {
          label: "Luftfeuchtigkeit in %",
          data: dataTemps.humid,
          fill: false,
          borderColor: "rgba(10, 10, 255, 1)",
          backgroundColor: "rgba(10, 10, 255, 0.5)",
          borderWidth: 1,
        },

      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });
}
window.addEventListener("load", setupMedium);

async function getData(sender) {
  // const response = await fetch('testdata.csv');
  const response = await fetch("http://zimmermatic:3443/db/temp/" + sender, {
    method: "GET",
  });
  const data = await response.json();

  const temps = [];
  const times = [];
  const humid = [];
  const tempS2 = [];
  const hum2 = [];
  const times2 = [];
  for (let i = 0; i < data.length; i++) {
    temps.push(data[i].temperatur);
    humid.push(data[i].feuchtigkeit);
    times.push(data[i].time);
  }
  return { temps, times, humid, tempS2, hum2 };
}