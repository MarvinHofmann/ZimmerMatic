const ws = new WebSocket('ws://ZimmerMatic:8080');

ws.addEventListener("open", () => {
    console.log("Client connected with server!")

})
ws.onmessage = function (event) {
    console.log("Daten kamen an");
    switch (event.data[0])
    {
        case "temp" :
            playlistTitles= JSON.parse(event.data[1]);
            let temperatur = event.data[1];
            console.log("Temperatur:");
            console.log(temperatur);
        break;
        case "feucht" :
            playlist = JSON.parse(event.data[1]); //array 2 
            let feuchtigkeit = event.data[2];
            console.log("Feuchtigkeit:");
            console.log(feuchtigkeit);
        break;
    }
    //console.log(playlistTitlesClient);
};

ws.addEventListener('message', function (event, event1) {
    const temp = event.data;
    const feucht = event1.data;
    console.log('Message from server ',data);
    //document.getElementById("displaytext").innerText = data;
    console.log(feucht);
    console.log(temp);
});
