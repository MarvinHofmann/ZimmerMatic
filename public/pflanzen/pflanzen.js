const ws = new WebSocket("ws://192.168.0.138:3000");

ws.addEventListener("open", () => {
  console.log("Client connected with server!");
});


ws.addEventListener("message", function (event) {
  const data = JSON.parse(event.data);
  console.log(data);
  switch (data.type) {
    case "PLfeuchtigkeitS1":
      document.getElementById("pflanzCont").innerText = String(
        data.value
      );
      break;

    case "PLfeuchtigkeitS2":
      document.getElementById("pflanzCont2").innerText = String(
        data.value
      );
      break;

    case "PLfeuchtigkeitS3":
      document.getElementById("pflanzCont3").innerText = String(
        data.value
      );
      break;

    case "PLzeitS1":
      document.getElementById("uhrP1").innerText = data.value;
      break;

    case "PLzeitS2":
      document.getElementById("uhrP2").innerText = data.value;
      break;

    case "PLzeitS3":
      document.getElementById("uhrP3").innerText = data.value;
      break;

    default:
    // Unknown websocket message type
  }
});
