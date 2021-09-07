const ws = new WebSocket("ws://192.168.0.58:3000");

ws.addEventListener("open", () => {
  console.log("Client connected with server!");
 
});
let jahr,monat,sekunde,tag,minute,millisekunde,stunde;

ws.addEventListener("message", function (event) {
    const data = JSON.parse(event.data);
    //console.log(data);
    switch (data.type) {
      case "jahr":
        jahr = data.value;
        break;
  
      case "monat":
        monat = data.value;
        break;
  
      case "tag":
        tag = data.value;
        break;
  
      case "stunde":
        stunde = data.value;
        break;
  
      case "minute":
        minute = data.value;
        break;
  
      case "sekunde":
        sekunde = data.value;
        break;
  
      case "millisekunde":
        millisekunde = data.value;
        break;
          
      default:
      // Unknown websocket message type
    }
  });
  

const startDateTime = new Date(jahr,monat,tag,stunde,minute,sekunde,millisekunde); // letzter Neustart 
const startStamp = startDateTime.getTime();

let newDate = new Date();
let newStamp = newDate.getTime();

let timer;

function updateClock() {
    newDate = new Date();
    newStamp = newDate.getTime();
    let diff = Math.round((newStamp-startStamp)/1000);
    
    let d = Math.floor(diff/(24*60*60));
    diff = diff-(d*24*60*60);
    let h = Math.floor(diff/(60*60));
    diff = diff-(h*60*60);
    let m = Math.floor(diff/(60));
    diff = diff-(m*60);
    let s = diff;
    
    document.getElementById("uptime").innerHTML = d+" Tage, "+h+" Stunden, "+m+" Minuten, "+s+" Sekunden Uptime";
}

timer = setInterval(updateClock, 1000);

function getLog(){
    window.open( 
        "http://zimmermatic:3443/DownloadLog", "_blank");
}

function getLogComplete(){
    window.open( 
        "http://zimmermatic:3443/DownloadLogCom", "_blank");
}

