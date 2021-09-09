
const ws = new WebSocket("ws://192.168.0.58:3000");

ws.addEventListener("open", () => {
  console.log("Client connected with server!");
});

ws.addEventListener("message", function (event) {
    const data = JSON.parse(event.data);
    //console.log(data);
    switch (data.type) {
      case "uptime":
        document.getElementById("uptime").innerText = String(data.value);
        break;
    }
});
function getLog(){
    window.open( 
        "http://zimmermatic:3443/DownloadLog", "_blank");
}

function getLogComplete(){
    window.open( 
        "http://zimmermatic:3443/DownloadLogCom", "_blank");
}

getState("BL");
//getState("BR");
//getState("BT");
function getState(lampe) {
  let state;
  let adresse = "http://192.168.0.58:8080/rest/items/" + lampe + "_Helligkeit";
  console.log("Frage Lampe an:" + adresse);
  fetch(adresse, {method: 'GET', mode: 'no-cors'}).then(response => response.json()).then(data =>{
    console.log(response.json());
      switch (data.value) {
        case "state":
          console.log("Anfrage erfolgreich: " + data);
          state = data.value;
          console.log(state);
          break;
      }
  });
  if (state > 0) {
    document.getElementById("BL_Status").innerText = String("ON");
  }else{
    document.getElementById("BL_Status").innerText = String("OFF");
  }
}

function rolladenRunter() {
    
}

function rolladenHoch() {
    
}
