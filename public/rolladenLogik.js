const ws = new WebSocket('ws://192.168.0.58:8000');

ws.addEventListener("open", () => {
    console.log("Client connected with server!")
})
ws.addEventListener('message', function (event){
    const data = event.data;
    console.log("Client schickt:")
    console.log(data)
    if(data === "now"){
        btnfunction(3);
    }    
  });
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