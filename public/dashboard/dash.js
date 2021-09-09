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
      case "BR":
        checkState(data.value, "BR");
        break;
      case "BT":
        checkState(data.value, "BT");
          break;
      case "BL":
        checkState(data.value, "BL");
        break;
    }
});
function checkState(value, lampe){
  console.warn(value);
  console.warn(lampe);
  if (value > 0) {
    console.log("Lampe ist an!")
    document.getElementById(lampe + "_Status").innerText = "ON";
    document.getElementById("lichtMain").innerText = "ON";
    document.getElementById("lichtMain").style.color = "green";
  }else{
    console.log("Lampe ist aus!")
    document.getElementById(lampe + "_Status").innerText = "OFF";
  }
}

function updateClock() {
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
  document.getElementById("aktzeit").innerText = "Es ist der " + String(getTag()) + " um " + String(zeit);
  
}
timer = setInterval(updateClock, 1000);

function getTag() {
  let dt = new Date();
  let month = "" + (dt.getMonth() + 1);
  let day = "" + dt.getDate();
  let year = dt.getFullYear();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  let dateF = [day, month,year].join(".");
  return dateF;
}

function getLog(){
  window.open( 
      "http://zimmermatic:3443/DownloadLog", "_blank");
}

function getLogComplete(){
  window.open( 
      "http://zimmermatic:3443/DownloadLogCom", "_blank");
}

function rolladenAktion(richtung) {
let adresse = "http://zimmermatic:3443/rolladen" + richtung;
fetch(adresse, {method: 'GET'});
}