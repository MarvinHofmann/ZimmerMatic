const main = require("../index");
const time = require("./zeit");

main.app.get("/DownloadLog", function (req, res) {
    const file = "/cheese.log";
    console.log("Anfrage kam an");
    console.log(file);
    res.download(file); // Set disposition and send it.
  });
  
main.app.get("/DownloadLogCom", function (req, res) {
    console.log("********************");
    console.log("Download Anfrage");
    console.log(time.berechneZeit() + ", " + time.getTag());
    console.log("********************");
    const file = "/log-file.txt";
    console.log(file);
    res.download(file); // Set disposition and send it.
  });