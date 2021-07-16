const ws = new WebSocket("ws://192.168.0.58:3000");
let offen = false;
ws.addEventListener("open", (message) => {
  console.log("Client connected with server!");
  ws.send("getAbstand");
});

ws.addEventListener("message", function (event) {
  const data = JSON.parse(event.data);
  switch (data.type) {
    case "abstand":
      document.getElementById("runterBtn").style.backgroundColor = "red";
      document.getElementById("runterBtn").innerText = "Fenster Offen";
      offen = true;
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
      break;
    case 3:
      if (!offen) {
        ws.send("runter"); 
      }
      break;

    default:
      break;
  }
}



