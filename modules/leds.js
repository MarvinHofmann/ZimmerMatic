const WebSocket = require("ws");
const main = require("../index");

main.app.get("/on", function (request, response) {
    main.currentClientsws[1].send("0");
    main.currentClientsws[2].send("0");
    response.sendStatus(200);
});
  
main.app.get("/off", function (request, response) {
    main.currentClientsws[1].send("1");
    main.currentClientsws[2].send("1");
    response.sendStatus(200);
});