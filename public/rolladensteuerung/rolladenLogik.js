const ws = new WebSocket("ws://192.168.0.58:8000");

ws.addEventListener("open", (message) => {
  console.log("Client connected with server!");
});

function btnfunction(number) {
  switch (number) {
    case 1:
      console.log("sende")
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

