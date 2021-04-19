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
let temp2;
let feucht2;
let temp3;
let feucht3;
let zeit1;
let zeit2;
let zeit3;

//Ereignisse
//1.HTTP Get request 
app.get('/' , function ( request, response){
    console.log("Eingehende get request");
    broadcast(feucht, temp, zeit1);
    broadcastSenderZwei(feucht2, temp2, zeit2);
    broadcastSenderDrei(feucht3, temp3, zeit3);
    response.sendStatus(200);
});
//2.Einrichten POST REQUEST d1 minis
app.post('/' , function ( req, res){
    //console.log("Eingehende POST request");
    temp = req.body.temperatur;
    feucht = req.body.feuchtigkeit;
    zeit1 = berechneZeit();
    console.log('Temperatur1: ' + temp + ' Feuchtigkeit1: ' + feucht + ' Zeit: ' + zeit1);
    broadcast(feucht, temp, zeit1);
    res.sendStatus(200);
        
});

app.post('/senderZwei' , function ( req, res){
  //console.log("Eingehende POST request");
  temp2 = req.body.temperatur;
  feucht2 = req.body.feuchtigkeit;
  zeit2 = berechneZeit();
  console.log('Temperatur2: ' + temp2 + ' Feuchtigkeit2: ' + feucht2 + ' Zeit: ' + zeit2);
  broadcastSenderZwei(feucht2, temp2, zeit2);
  res.sendStatus(200);
      
});

app.post('/senderDrei' , function ( req, res){
  //console.log("Eingehende POST request");
  temp3 = req.body.temperatur;
  feucht3 = req.body.feuchtigkeit;
  zeit3 = berechneZeit();
  console.log('Temperatur3: ' + temp3 + ' Feuchtigkeit3: ' + feucht3 + ' Zeit: ' + zeit3);
  broadcastSenderDrei(feucht3, temp3, zeit3);  
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
  function broadcast(feucht, temp, zeit) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'feuchtigkeitS1', value: feucht }));
        client.send(JSON.stringify({ type: 'temperaturS1', value: temp }));
        client.send(JSON.stringify({ type: 'zeitS1', value: zeit }));
      }
    });
  }
  
  
  function broadcastSenderZwei(feucht, temp, zeit) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'feuchtigkeitS2', value: feucht }));
        client.send(JSON.stringify({ type: 'temperaturS2', value: temp }));
        client.send(JSON.stringify({ type: 'zeitS2', value: zeit }));
      }
    });
  }

  function broadcastSenderDrei(feucht, temp, zeit) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'feuchtigkeitS3', value: feucht }));
        client.send(JSON.stringify({ type: 'temperaturS3', value: temp }));
        client.send(JSON.stringify({ type: 'zeitS3', value: zeit }));
      }
    });
  }

  function berechneZeit(){
    let a = new Date();
    b = c = d = zeit = 0;
    b = a.getHours();
    c = a.getMinutes();
    d = a.getSeconds();
    if(b < 10){b = '0'+b;} 
    if(c < 10){c = '0'+c;} 
    if(d < 10){d = '0'+d;}
    zeit = b+':'+c+':'+d
    return zeit ;
  }

