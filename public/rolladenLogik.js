const ws = new WebSocket('ws://192.168.0.58:8000');

ws.addEventListener("open", () => {
    console.log("Client connected with server!")
})

function btnfunction(number) {
    switch (number) {
      case 1:
        ws.send('hoch');
        break;
      case 2:
        ws.send('stop');
        break;
      case 3:
        ws.send('runter');
        break;

      default:
        break;
    }
  }
  function berechneZeit() {
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
    return zeit;
  }

  if(berechneZeit() === "12:00"){
      btnfunction(3);
  }
