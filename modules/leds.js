const WebSocket = require("ws");
const main = require("../index");

main.app.post("/D1Leds", function (req, res) {
  let r = req.body.red;
  let g = req.body.green;
  let b = req.body.blue;
  let v = Number(req.body.value) * 2.5;
  let n = req.body.who;
  //console.log("Fetch kam an Sende an " + n);
  //console.log(`r: ${r}, g: ${g}, b: ${b}, v: ${v}`);
  try {
    currentClientsws[i].send(send(`${r},${g},${b},${v}`));
  } catch (error) {
    logger.error(error);
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
      currentClientsws[i].send(send(`${r},${g},${b},${v}`));
    } catch (error) {
      logger.error(error);
    }
  }
  res.sendStatus(200);
});
