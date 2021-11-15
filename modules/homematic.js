const fetch = require('node-fetch');
const main = require("../index");
const { publishDash } = require('./temp');

function fetchHeizung(Heizung, wert){
    let adresse = "http://192.168.0.58:8080/rest/items/" + Heizung + "/state";
    fetch(adresse, {method: 'POST', body: wert});
}

//publish
function publishHeizung(){
    getState("HZF_ST");
    getState("HZFen_ST");
}
exports.publishHeizung = publishHeizung;
//GET STATE from set Temperature
function getState(heizung) {
let adresse = "http://192.168.0.58:8080/rest/items/" + heizung + "/state";
  fetch(adresse, {method: 'GET'}).then(response => response.text())
  .then((response) => {
      antwort = response;
      for (let i = 0; i < main.ClientswsBrowser.length; i++) {
        main.ClientswsBrowser[i].send(
          JSON.stringify({ type: heizung, value: response })
        );
      }
  })
  .catch(err => console.log(err));
}

main.app.post('/Heizung' , function ( request, response){
    let heizung = request.body.Heizung;
    let wert = request.body.Wert;
    fetchHeizung(heizung,wert);
    response.sendStatus(200);
});