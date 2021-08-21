const WebSocket = require("ws");
const main = require("../index");

main.app.get("/on", function (request, response) {
    main.currentClientsws[3].send("40,191,255,255");
    main.currentClientsws[4].send("40,191,255,255");
    response.sendStatus(200);
});

main.app.get("/off", function (request, response) {
    main.currentClientsws[3].send("0");
    main.currentClientsws[4].send("0");
    response.sendStatus(200);
});

main.app.post("/D1Leds" , function (req, res) {
   let r = req.body.red; 
   let g = req.body.green; 
   let b = req.body.blue; 
   let v = (Number(req.body.value) *2.5); 
   let n = req.body.who;
   console.log("Fetch kam an Sende an " + n);
   console.log(`r: ${r}, g: ${g}, b: ${b}, v: ${v}`);
   main.currentClientsws[n].send(`${r},${g},${b},${v}`);
   res.sendStatus(200);
});

main.app.post("/D1LedsAll" , function (req, res) {
    let r = req.body.red; 
    let g = req.body.green; 
    let b = req.body.blue; 
    let v = (Number(req.body.value) *2.5); 
    console.log(`r: ${r}, g: ${g}, b: ${b}, v: ${v}`);
    main.currentClientsws[1].send(`${r},${g},${b},${v}`);
    main.currentClientsws[2].send(`${r},${g},${b},${v}`);
    main.currentClientsws[3].send(`${r},${g},${b},${v}`);
    main.currentClientsws[4].send(`${r},${g},${b},${v}`);
    res.sendStatus(200);
 });