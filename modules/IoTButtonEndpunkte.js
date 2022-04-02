const main = require("../index");
const Ikea = require("./tradfri");
const mongodb = require("./mongoDB");
const rS = require("./rolladenSteuerung");
const homematic = require("./homematic");

main.app.get("/essenFertig", function (req, res) {
    for (let i = 0; i < 3; i++) {
        main.currentClientsws[4].send("0,0,0,0");
        main.currentClientsws[5].send("0,0,0,0");
        main.currentClientsws[4].send("255,0,0,255");
        main.currentClientsws[5].send("255,0,0,255");
    }
    main.currentClientsws[4].send("255,255,255,255");
    main.currentClientsws[5].send("255,255,255,255");
    res.sendStaus(200);
});

main.app.get("/hello", function (req, res) {
    mongodb.getLastGone("kommen")
    main.consoleLogTime("Zuhause Angemeldet:");
    try {
        main.currentClientsws[1].send("256,161,20,100"); //DART
        main.currentClientsws[2].send("256,161,20,100"); //Sofa
        main.currentClientsws[3].send("40,191,255,255"); //Uhr
    } catch (error) {
        console.log("Client nicht Verfügbar!");
    }
    let a = new Date();
    if (a.getHours() >= 18 || a.getHours() <= 6) {
        Ikea.fetchLampe("BL", "Helligkeit", 30);
        Ikea.fetchLampe("BR", "Helligkeit", 30);
    } else {
        rS.rolladenUP();
    }
    if (a.getHours() < 21 || a.getHours() > 8) {
        homematic.heizungON(21);
    }
    res.sendStatus(200);
});

main.app.get("/tschuess", function (req, res) {
    mongodb.getLastGone("gehen");
    rS.rolladenDown();
    main.consoleLogTime("Abgemeldet:");
    for (let i = 0; i < main.currentClientsws.length; i++) {
        try {
            main.currentClientsws[i].send("0,0,0,0");
        } catch (error) {
            main.logger.error(error);
        }
    }
    Ikea.fetchLampe("BL", "Helligkeit", 0);
    Ikea.fetchLampe("BR", "Helligkeit", 0);
    Ikea.fetchLampe("BT", "Helligkeit", 0);
    homematic.heizungOff();
    res.sendStatus(200);
});


main.app.get("/druckerButton", function (req, res) {
    let adresse = "http://192.168.0.138:8080/rest/items/StD_Betrieb/state";
    fetch(adresse, { method: 'GET' }).then(response => response.text())
        .then((response) => {
            antwort = response;
            if (antwort == "OFF") {
                Ikea.fetchSteckdose("ON");            
            }else{
                Ikea.fetchSteckdose("OFF");            
            }
        })
        .catch(err => console.log(err));
    
    res.sendStatus(200);
});



