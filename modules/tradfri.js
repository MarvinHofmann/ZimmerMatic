const fetch = require('node-fetch');
const main = require("../index");

main.app.post('/Lampen' , function ( request, response){
    let lampe = request.body.Lampe;
    let modus = request.body.Modus;
    let wert = request.body.Wert;
    console.log("Lampe: " + lampe + " Modus: " + modus + " Wert: " + wert);
    fetchLampe(lampe, modus, wert);
    response.sendStatus(200);
});


main.app.post('/LampenAll' , function ( request, response){
  let modus = request.body.Modus;
  let wert = request.body.Wert;
  fetchLampe("BL", modus, wert);
  fetchLampe("BR", modus, wert);
  response.sendStatus(200);
});

function fetchLampe(lampe, modus, wert){
    let adresse = "http://192.168.0.58:8080/rest/items/" + lampe + "_" + modus;
    fetch(adresse, {method: 'POST', body: wert});
}
exports.fetchLampe = fetchLampe;
