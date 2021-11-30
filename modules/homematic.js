const fetch = require('node-fetch');
const main = require("../index");
const { publishDash } = require('./temp');

function fetchHeizung(Heizung, wert){
    let adresse = "http://192.168.0.58:8080/rest/items/" + Heizung;
   // console.log("fetch an:" + adresse);
   // console.log("wert: " + wert);
    fetch(adresse, {method: 'POST', body: wert});
}



main.app.post('/Heizung' , function ( request, response){
    let heizung = request.body.Heizung;
    let wert = request.body.Wert;
    fetchHeizung(heizung,wert);
    response.sendStatus(200);
});

main.app.get('/FensterState' , function ( request, response){
    let v = getStateFenster(true);
    console.log(v);
    response.send(v);
});

function heizungOff(){
    fetchHeizung("HZFen_ST", 0);
    fetchHeizung("HZF_ST", 0);
}
exports.heizungOff = heizungOff;

function heizungON(degree){
    fetchHeizung("HZFen_ST", degree);
    fetchHeizung("HZF_ST", degree);
}
exports.heizungON = heizungON;

function getStateFenster(rBool) {
    let adresse = "http://192.168.0.58:8080/rest/items/DGFensterkontakt_State/state";
    fetch(adresse, {method: 'GET'}).then(response => response.text())
    .then((response) => {
        antwort = response;
        console.log(antwort);
        if (rBool) {
            return antwort;
        }
        for (let i = 0; i < main.ClientswsBrowser.length; i++) {
          main.ClientswsBrowser[i].send(
            JSON.stringify({ type: heizung, value: response })
          );
        }
    })
    .catch(err => console.log(err));   
}