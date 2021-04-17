const ws = new WebSocket('ws://ZimmerMatic:8080');

ws.addEventListener("open", () => {
    console.log("Client connected with server!")

})

ws.addEventListener('message', function (event){
    const data = JSON.parse(event.data);
    switch (data.type) {
      case 'feuchtigkeitS1':
        document.getElementById('feuchtCont').innerText = String(data.value + "%");
        console.log("Feuchtigkeit:");
        console.log(data.value);
        break;
  
      case 'temperaturS1':
        document.getElementById('tempCont').innerText = String(data.value + "°C");
        console.log("Temperatur");
        console.log(data.value);
        break;
      case 'feuchtigkeitS2':
        let x =document.getElementById('feuchtCont2').innerText = String(data.value + "%");
        console.log("Feuchtigkeit:");
        console.log(data.value);
        break;
  
      case 'temperaturS2':
        document.getElementById('tempCont2').innerText  = String(data.value + "°C");
        console.log("Temperatur");
        console.log(data.value);
        break;

     case 'feuchtigkeitS3':
            document.getElementById('feuchtCont3').innerText = String(data.value + "%");
            console.log("Feuchtigkeit:");
            console.log(data.value);
            break;
      
     case 'temperaturS3':
            document.getElementById('tempCont3').innerText = String(data.value + "°C");
            console.log("Temperatur");
            console.log(data.value);
            break;

    case 'feuchtigkeitS4':
              document.getElementById('feuchtCont4').innerText = String(data.value + "%");
              console.log("Feuchtigkeit:");
              console.log(data.value);
              break;
        
    case 'temperaturS4':
              document.getElementById('tempCont4').innerText = String(data.value + "°C");
              console.log("Temperatur");
              console.log(data.value);
              break;
  
      default:
        // Unknown websocket message type
    }
  });


