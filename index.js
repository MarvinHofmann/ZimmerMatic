/*ZimmerMatic Node.js Webserver*/

//Websocket Server
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 }); // abgespilteter WS Server auf anderem Port

// Init. EXpress Server
const express = require('express')
const app = express()

const port = 3443
let bodyParser = require('body-parser');

app.use(express.static('public'));//Seite Läauft ganze zeit ohne init request
app.use(bodyParser.json());
app.listen(port, () => {
  console.log(`App listening at http://raspberrypi:${port}`) // Publisher Server auf Port 3443
})

//Ereignisse
//1.HTTP Get request 
app.get('/' , function ( request, response){
    console.log("Eingehende get request");
    response.sendStatus(200);

});

//Sagt euch wenn ein Client verbunden ist oder wenn er disconnected
wss.on("connection", ws => {
    console.log("Client connected!");
  
    ws.on("close", data => {
      console.log("Client has disconnceted");
    })
  
  })
  
  // diese funktion schickt das übergebene Objekt , int , string oder json an alle verbundenen Clients
  function broadcast(data) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }
  
  