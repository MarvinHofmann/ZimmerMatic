let start = new Date;
const startDateTime = new Date(start.getFullYear,start.getMonth,start.getDate,start.getHours,start.getMinutes,start.getSeconds,start.getMilliseconds); // Erstes Release von Javascript
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

function getLights(){

}   