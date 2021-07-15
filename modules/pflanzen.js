const main = require("../index.js");

main.app.get("/test", function (req, res) {
   console.log(req);
   console.log("funktioniert");
   res.sendStatus(200);
});