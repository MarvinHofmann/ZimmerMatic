getStateHeizung("HZF_ST")
getStateHeizung("HZFen_ST")
getStateHeizung("HZF_V" )
getStateHeizung("HZFen_V")
getStateHeizung("HZFen_AT")
getStateHeizung("HZF_AT")

async function getStateHeizung(who, promtText) {
    let adresse = "http://192.168.0.138:8080/rest/items/" + who + "/state";
    const antwort = await fetch(adresse, { method: 'GET' }).then(response => response.text());
    document.getElementById(who).innerText =String(antwort);
}

function waerme(value, who) {
    sendFetch(value, who);
    document.getElementById(who).innerText ="Aktuell: " + value + String("°C");
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

document.getElementById("slider1").oninput = function() {
    var value = (this.value-this.min)/(this.max-this.min)*100
    this.style.background = 'linear-gradient(to right, #82CFD0 0%, #82CFD0 ' + value + '%, #fff ' + value + '%, white 100%)'
  };

  document.getElementById("slider2").oninput = function() {
    var value = (this.value-this.min)/(this.max-this.min)*100
    this.style.background = 'linear-gradient(to right, #82CFD0 0%, #82CFD0 ' + value + '%, #fff ' + value + '%, white 100%)'
  };