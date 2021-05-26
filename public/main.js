const ws = new WebSocket("ws://192.168.0.58:8000");

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
      document.getElementById("average").innerText = String(data.value);
      break;

    default:
    // Unknown websocket message type
  }
});

