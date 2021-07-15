const WebSocket = require("ws");
const main = require("../index.js");
let plFeucht1,
plFeucht2,
plFeucht3;
exports.plFeucht1 = plFeucht1;
exports.plFeucht2 = plFeucht2;
exports.plFeucht3 = plFeucht3;
/********************************Pflanzenüberwachung*********************************************/
main.app.post("/plfanze1", function (req, res) {
    plFeucht1 = req.body.feuchtigkeit;
    console.log("Pflanze 1: " + plFeucht1);
    plZeit1 = main.berechneZeit();
    broadcastPflanzen(plFeucht1, plZeit1, "S1");
    if (plFeucht1 >= 440) {
      //390 - 440
      bot.sendMessage(chatId, "Pflanze 1 bitte Gießen!");
    }
    res.sendStatus(200);
});
  
main.app.post("/plfanze2", function (req, res) {
    plFeucht2 = req.body.feuchtigkeit;
    console.log("Pflanze 2: " + plFeucht2);
    plZeit2 = berechneZeit();
    broadcastPflanzen(plFeucht2, plZeit2, "S2");
    if (plFeucht2 >= 320) {
      //380-410
      bot.sendMessage(chatId, "Pflanze 2 bitte Gießen!");
    }
    res.sendStatus(200);
  });
  
  main.app.post("/plfanze3", function (req, res) {
    plFeucht3 = req.body.feuchtigkeit;
    console.log("Pflanze 3: " + plFeucht3);
    plZeit3 = berechneZeit();
    broadcastPflanzen(plFeucht3, plZeit3, "S3");
    if (plFeucht3 >= 180) {
      //zw 180 && 200
      bot.sendMessage(chatId, "Pflanze 2 bitte Gießen!");
    }
    res.sendStatus(200);
  });
  /***********************************************************************************************/

  function broadcastPflanzen(feucht, zeit, sender) {
      
    for (let i = 3; i < main.currentClientsws.length; i++) {
      main.currentClientsws[i].send(
        JSON.stringify({ type: "PLfeuchtigkeit" + sender, value: feucht })
      );
      main.currentClientsws[i].send(
        JSON.stringify({ type: "PLzeit" + sender, value: zeit })
      );
    }
  }
  exports.broadcastPflanzen = broadcastPflanzen;