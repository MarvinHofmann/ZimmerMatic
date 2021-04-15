/*ZimmerMatic Node.js Webserver*/

//Websocket Server
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 }); // abgespilteter WS Server auf anderem Port

// Init. EXpress Server
const express = require('express')
const app = express()

const port = 3443
let bodyParser = require('body-parser');

let urlencodedParser = bodyParser.urlencoded({ extended: false})

app.use(express.static('public'));//Seite Läauft ganze zeit ohne init request
app.use(bodyParser.json());
app.listen(port, () => {
  console.log(`App listening at http://ZimmerMatic:${port}`) // Publisher Server auf Port 3443
  console.log('Die IP Adresse lautet: 192.168.0.58');
})

//Globale Variablen
let temp;
let feucht;

//Ereignisse
//1.HTTP Get request 
app.get('/' , function ( request, response){
    console.log("Eingehende get request");
    response.sendStatus(200);

});
//2.Einrichten POST REQUEST d1 minis
app.post('/' , function ( req, res){
    console.log("Eingehende POST request");
    temp = req.body.temperatur;
    feucht = req.body.feuchtigkeit;
    console.log('Temperatur: ' + temp + ' Feuchtigkeit: ' + feucht);
    broadcast(feucht, temp);
    res.sendStatus(200);
        
});

app.post('/senderZwei' , function ( req, res){
  console.log("Eingehende POST request");
  temp = req.body.temperatur;
  feucht = req.body.feuchtigkeit;
  console.log('Temperatur: ' + temp + ' Feuchtigkeit: ' + feucht);
  broadcastSenderZwei(feucht, temp);
  res.sendStatus(200);
      
});

app.post('/senderDrei' , function ( req, res){
  console.log("Eingehende POST request");
  temp = req.body.temperatur;
  feucht = req.body.feuchtigkeit;
  console.log('Temperatur: ' + temp + ' Feuchtigkeit: ' + feucht);
  broadcastSenderDrei(feucht, temp);
  res.sendStatus(200);
      
});

//Sagt euch wenn ein Client verbunden ist oder wenn er disconnected
wss.on("connection", ws => {
    console.log("Client connected!");
    ws.on("close", data => {
      console.log("Client has disconnceted");
    })
  
  })
  
  // diese funktion schickt das übergebene Objekt , int , string oder json an alle verbundenen Clients
  function broadcast(feucht, temp) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'feuchtigkeitS1', value: feucht }));
        client.send(JSON.stringify({ type: 'temperaturS1', value: temp }));
      }
    });
  }
  
  
  function broadcastSenderZwei(feucht, temp) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'feuchtigkeitS2', value: feucht }));
        client.send(JSON.stringify({ type: 'temperaturS2', value: temp }));
      }
    });
  }

  function broadcastSenderDrei(feucht, temp) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'feuchtigkeitS3', value: feucht }));
        client.send(JSON.stringify({ type: 'temperaturS3', value: temp }));
      }
    });
  }