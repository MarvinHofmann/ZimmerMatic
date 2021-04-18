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
let temp1;
let feucht1;
let temp2;
let feucht2;
let temp3;
let feucht3;
//Ereignisse
//1.HTTP Get request 
app.get('/' , function ( request, response){
    console.log("Eingehende get request");
    response.sendStatus(200);
    broadcast(feucht1, temp1, feucht2, temp2, feucht3, temp3);

});
//2.Einrichten POST REQUEST d1 minis
app.post('/' , function ( req, res){
    //console.log("Eingehende POST request");
    temp1 = req.body.temperatur;
    feucht1 = req.body.feuchtigkeit;
    console.log('Temperatur1: ' + temp1 + ' Feuchtigkeit1: ' + feucht1);
    broadcast(feucht1, temp1, 0, 0, 0, 0);
    res.sendStatus(200);
        
});

app.post('/senderZwei' , function ( req, res){
  //console.log("Eingehende POST request");
  temp2 = req.body.temperatur;
  feucht2 = req.body.feuchtigkeit;
  console.log('Temperatur2: ' + temp2 + ' Feuchtigkeit2: ' + feucht2);
  //broadcastSenderZwei(feucht, temp);
  broadcast(0,0,feucht2,temp2,0,0);
  res.sendStatus(200);
      
});

app.post('/senderDrei' , function ( req, res){
  //console.log("Eingehende POST request");
  temp3 = req.body.temperatur;
  feucht3 = req.body.feuchtigkeit;
  console.log('Temperatur3: ' + temp3 + ' Feuchtigkeit3: ' + feucht3);
  //broadcastSenderDrei(feucht, temp);
  broadcast(0,0,0,0,feucht3,temp3)
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
  function broadcast(feucht, temp, feucht2, temp2, feucht3, temp3) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'feuchtigkeitS1', value: feucht }));
        client.send(JSON.stringify({ type: 'temperaturS1', value: temp }));
        client.send(JSON.stringify({ type: 'feuchtigkeitS2', value: feucht2 }));
        client.send(JSON.stringify({ type: 'temperaturS2', value: temp2 }));
        client.send(JSON.stringify({ type: 'feuchtigkeitS3', value: feucht3 }));
        client.send(JSON.stringify({ type: 'temperaturS3', value: temp3 }));
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
