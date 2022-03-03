const ws = new WebSocket("ws://192.168.0.138:3000");

ws.addEventListener("open", () => {
  console.log("Client connected with server!");
});


ws.addEventListener("message", function (event) {
  const data = JSON.parse(event.data);
  //console.log(data);
  switch (data.type) {
    case "feuchtigkeitS1":
      document.getElementById("feuchtCont").innerText = String(
        data.value + "%"
      );
      break;

    case "temperaturS1":
      document.getElementById("tempCont").innerText = String(data.value + "°C");
      break;

    case "feuchtigkeitS2":
      document.getElementById("feuchtCont2").innerText = String(
        data.value + "%"
      );
      break;

    case "temperaturS2":
      document.getElementById("tempCont2").innerText = String(
        data.value + "°C"
      );
      break;

    case "feuchtigkeitS3":
      document.getElementById("feuchtCont3").innerText = String(
        data.value + "%"
      );
      break;

    case "temperaturS3":
      document.getElementById("tempCont3").innerText = String(
        data.value + "°C"
      );
      break;

    case "zeitS1":
      document.getElementById("uhr1").innerText = data.value;
      break;

    case "zeitS2":
      document.getElementById("uhr2").innerText = data.value;
      break;

    case "zeitS3":
      document.getElementById("uhr3").innerText = data.value;
      break;

    case "average":
      document.getElementById("average").innerText = "Durchschnitt " + String(data.value) + " °C";
      break;

    default:
    // Unknown websocket message type
  }
});

window.addEventListener("load", setupMedium);
window.addEventListener("load", setupSender1);
window.addEventListener("load", setupSender2);
window.addEventListener("load", setupSender3);

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
                    label: "feuchtigkeit in %",
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

async function setupSender1() {
    const ctx = document.getElementById("Sender1").getContext("2d");
    const dataTemps = await getData("sender1");
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
                    label: "feuchtigkeit in %",
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

async function setupSender2() {
    const ctx = document.getElementById("Sender2").getContext("2d");
    const dataTemps = await getData("sender2");
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
                    label: "feuchtigkeit in %",
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


async function setupSender3() {
    const ctx = document.getElementById("Sender3").getContext("2d");
    const dataTemps = await getData("sender3");
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
                    label: "feuchtigkeit in %",
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



async function getData(sender) {
    // const response = await fetch('testdata.csv');
    const response = await fetch("http://192168.0.138:3443/db/temp/" + sender, {
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
