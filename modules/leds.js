const WebSocket = require("ws");
const main = require("../index");

main.app.post("/D1Leds", function (req, res) {
  let r = req.body.red;
  let g = req.body.green;
  let b = req.body.blue;
  let v = Number(req.body.value) * 2.5;
  let n = req.body.who;
  try {
    main.currentClientsws[n].send(`${r},${g},${b},${v}`);
  } catch (error) {
    console.log(n);
    console.log("Client " + main.currentClientsws[n] + " nicht Verfügbar");
  }
  res.sendStatus(200);
});

main.app.post("/D1LedsAll", function (req, res) {
  let r = req.body.red;
  let g = req.body.green;
  let b = req.body.blue;
  let v = Number(req.body.value) * 2.5;
  //console.log(`r: ${r}, g: ${g}, b: ${b}, v: ${v}`);
  for (let i = 0; i < main.currentClientsws.length; i++) {
    try {
      main.currentClientsws[i].send(`${r},${g},${b},${v}`);
    } catch (error) {
      console.log("Client nicht Verfügbar");
    }
  }
  res.sendStatus(200);
});
