const ws = new WebSocket("ws://192.168.0.138:3000");

ws.addEventListener("open", (message) => {
  console.log("Client connected with server!");
  ws.send("getAbstand");
});

ws.addEventListener("message", function (event) {
  const data = JSON.parse(event.data);
  switch (data.type) {
    case "abstand":
      console.log(data.value);
      break;
    default:
      break;
  }
});

function btnfunction(number) {
  switch (number) {
    case 1:
      console.log("sende")
      ws.send("hoch");
      break;
    case 2:
      ws.send("stop");
      ws.send("getAbstand");
      ws.send("getAbstand");
      break;
    case 3:
      ws.send("runter");
      break;

    default:
      break;
  }
}



