getStateHeizung("HZF_ST")
getStateHeizung("HZFen_ST")

async function getStateHeizung(who) {
    let adresse = "http://192.168.0.138:8080/rest/items/" + who + "/state";
    const antwort = await fetch(adresse, { method: 'GET' }).then(response => response.text());
    document.getElementById(who).innerText = String(antwort);
}

function waerme(value, who) {
    sendFetch(value, who);
    document.getElementById(who).innerText = value + String("°C");
}

function print(value, who) {
    if (who === 1) {
        document.getElementById("set1").innerText = "Setze: " + value + String("°C");
    } else if (who === 2) {
        document.getElementById("set2").innerText = "Setze: " + value + String("°C");
    }
}

function sendFetch(wert, wer) {
    let adresse = "http://192.168.0.138:8080/rest/items/" + wer;
    fetch(adresse, { method: 'POST', body: wert });
}