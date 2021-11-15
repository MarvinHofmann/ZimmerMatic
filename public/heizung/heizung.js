getStateHeizung("HZF_ST")
getStateHeizung("HZFen_ST")

async function getStateHeizung(who) {
    let adresse = "http://192.168.0.58:8080/rest/items/" + who + "/state";
    const antwort = await fetch(adresse, {method: 'GET'}).then(response => response.text());
    console.log(antwort);
    console.log(who);
    document.getElementById(who).innerText = String(antwort);
}

function waerme(value ,who) {
        sendFetch(value, who);
        console.log(who);

        document.getElementById(who).innerText =value + String("°C");
}

function print(value ,who) {
    if (who === 1) {
        //console.log(value);
        document.getElementById("set1").innerText = "Setze: " + value + String("°C");
    }else if (who === 2) {
        //console.log(value);
        document.getElementById("set2").innerText = "Setze: " + value + String("°C");    
    }
}

function sendFetch(wert, wer){
    let adresse = "http://192.168.0.58:8080/rest/items/" + wer;
    // console.log("fetch an:" + adresse);
    // console.log("wert: " + wert);
     fetch(adresse, {method: 'POST', body: wert});
}