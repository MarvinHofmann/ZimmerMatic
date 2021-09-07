function getLog(){
    fetch('http://192.168.0.58:3443/DownloadLog', {
      method: 'GET'      
  });
}