const ws = new WebSocket('ws://raspberrypi:8080');
ws.addEventListener("open", () => {
    console.log("Client connected with server!")

})
ws.onmessage = function (event) {

    switch (event.data[0])
    {
        case "temp" :
            playlistTitles= JSON.parse(event.data[1]);
            const temperatur = event.data;
            console.log(temperatur);
        break;
        case "feucht" :
            playlist = JSON.parse(event.data[1]); //array 2 
            const feuchtigkeit = event.data;
            console.log(feuchtigkeit);
        break;
    }
    console.log(playlistTitlesClient);
};
