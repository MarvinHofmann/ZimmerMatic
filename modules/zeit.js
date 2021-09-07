const WebSocket = require("ws");
const main = require("../index");

let start = new Date();
let jahr = start.getFullYear();
let monat =  start.getMonth();
let tag = start.getDate();
let stunde = start.getHours();
let minute = start.getMinutes();
let sekunde = start.getSeconds();
let millisekunde = start.getMilliseconds();
 // Erstes Release von Javascript

 
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

    let startZeit = d+" Tage, "+h+" Stunden, "+m+" Minuten Uptime";
    broadcastTime(startZeit);
 }
 exports.updateClock = updateClock;
 
 timer = setInterval(updateClock, 45000);

 function broadcastTime(String){
    for (let i = 0; i < main.ClientswsBrowser.length; i++) {
      main.ClientswsBrowser[i].send(
        JSON.stringify({ type: "uptime", value: String })
      );
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
  exports.berechneZeit = berechneZeit;
  
  function getTag() {
    let dt = new Date();
    let month = "" + (dt.getMonth() + 1);
    let day = "" + dt.getDate();
    let year = dt.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
  
    let dateF = [year, month, day].join("-");
    return dateF;
  }
  exports.getTag = getTag;
  