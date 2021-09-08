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

function rolladenRunter() {
    
}

function rolladenHoch() {
    
}
