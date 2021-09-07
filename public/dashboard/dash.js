function format(seconds){
    function pad(s){
      return (s < 10 ? '0' : '') + s;
    }
    let hours = Math.floor(seconds / (60*60));
    let minutes = Math.floor(seconds % (60*60) / 60);
    let seconds = Math.floor(seconds % 60);
  
    return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
  }
  
  let uptime = process.uptime();
  console.log(format(uptime));

  document.getElementById("uptime").innerHTML = uptime;

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