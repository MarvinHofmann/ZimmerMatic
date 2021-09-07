function getLog(){
    fetch('http://192.168.0.58:3443/DownloadLog', {
      method: 'GET'      
  }).then(response => response.json())
  .then(data => console.log(data));
  console.log("Sende anfrage auf Download");
}