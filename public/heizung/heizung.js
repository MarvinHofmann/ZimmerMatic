const ws = new WebSocket("ws://192.168.0.58:3000");

ws.addEventListener("open", () => {
  console.log("Client connected with server!");
});

ws.addEventListener("message", function (event) {
    const data = JSON.parse(event.data);
    console.log(data);
    //Hole hier daten für aktuellen Wert
    switch (data.type) {
      case "HZF_ST":
        document.getElementById("get1").innerText = String(data.value);
        break;
      case "HZFen_ST":
        document.getElementById("get2").innerText = String(data.value);
        break;
    }
  });

function waerme(value ,who) {
    if (who === 1) {
        sendFetch(value, "HZFen_ST");
        document.getElementById("get1").innerText = "Setze: " + value + String("°C");
        print(value);
    }else if (who === 2) {
        sendFetch(value, "HZF_ST");
        document.getElementById("get2").innerText = "Setze: " + value + String("°C");
        print(value);
    }
}

function print(value ,who) {
    if (who === 1) {
        console.log(value);
        document.getElementById("set1").innerText = "Setze: " + value + String("°C");
    }else if (who === 2) {
        console.log(value);
        document.getElementById("set2").innerText = "Setze: " + value + String("°C");    
    }
}

function sendFetch(wert, wer){
    console.log(wer);
    fetch('http://zimmermatic:3443/Heizung', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/JSON',
      },
      body: JSON.stringify({Heizung: wer, Wert: wert})
  });
}