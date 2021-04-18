const ws = new WebSocket('ws://ZimmerMatic:8080');

ws.addEventListener("open", () => {
    console.log("Client connected with server!")

})

ws.addEventListener('message', function (event){
    const data = JSON.parse(event.data);
    let Uhrzeit = berechneZeit(); 
    console.log(Uhrzeit);
    switch (data.type) {
      case 'feuchtigkeitS1':
        document.getElementById('feuchtCont').innerText = String(data.value + "%");
        //console.log("Feuchtigkeit:");
        //console.log(data.value);
        document.getElementById('uhr1').innerText = Uhrzeit;
        break;
  
      case 'temperaturS1':
        document.getElementById('tempCont').innerText = String(data.value + "°C");
        //console.log("Temperatur");
        //console.log(data.value);
        break;

      case 'feuchtigkeitS2':
        let x =document.getElementById('feuchtCont2').innerText = String(data.value + "%");
        //console.log("Feuchtigkeit:");
        //console.log(data.value);
        
        document.getElementById('uhr2').innerText = Uhrzeit;
        break;
  
      case 'temperaturS2':
        document.getElementById('tempCont2').innerText  = String(data.value + "°C");
        //console.log("Temperatur");
        //console.log(data.value);
        break;

     case 'feuchtigkeitS3':
        document.getElementById('feuchtCont3').innerText = String(data.value + "%");
        //console.log("Feuchtigkeit:");
        //console.log(data.value);
        document.getElementById('uhr3').innerText = Uhrzeit;
        break;
      
     case 'temperaturS3':
        document.getElementById('tempCont3').innerText = String(data.value + "°C");
        //console.log("Temperatur");
        //console.log(data.value);
        break;

      default:
        // Unknown websocket message type
    }
  });

  function berechneZeit(){
    let a = new Date();
    b = c = d = zeit = 0;
    b = a.getHours();
    c = a.getMinutes();
    d = a.getSeconds();
    if(b < 10){b = '0'+b;} 
    if(c < 10){c = '0'+c;} 
    if(d < 10){d = '0'+d;}
    zeit = b+':'+c+':'+d
    return zeit ;
  }


