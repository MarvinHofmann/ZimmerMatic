const ws = new WebSocket('ws://ZimmerMatic:8080');

ws.addEventListener("open", () => {
    console.log("Client connected with server!")

})

ws.addEventListener('message', function (event){
    const data = JSON.parse(event.data);
    switch (data.type) {
      case 'feuchtigkeit':
        document.getElementById('feuchtCont').innerText = data.value;
        console.log("Feuchtigkeit:");
        console.log(data.value);
        break;
  
      case 'temperatur':
        document.getElementById('tempCont').innerText = data.value;
        console.log("Temperatur");
        console.log(data.value);
        break;
  
      default:
        // Unknown websocket message type
    }
  });


