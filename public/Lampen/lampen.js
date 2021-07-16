let slider = document.getElementById("myRange");
let BLSwitch = false;
let BRSwitch = false;
let alleSwitch = true;
let BateltischSwitch = false;


// Update the current slider value (each time you drag the slider handle)
function helligkeit(value) {
    if (alleSwitch) {
        sendFetchAll("Helligkeit", value);
    }if(BLSwitch){
        sendFetch("BL", "Helligkeit", value);
    }if(BRSwitch){
        sendFetch("BR", "Helligkeit", value);
    }if (BateltischSwitch) {
        sendFetch("BT", "Helligkeit", value);
    }
    console.log(value);
}

function farbtemperatur(value){
    if (alleSwitch) {
        sendFetchAll("Farbtemperatur", value);
    }if(BLSwitch){
        sendFetch("BL", "Farbtemperatur", value);
    }if(BRSwitch){
        sendFetch("BR", "Farbtemperatur", value);
    }if (BateltischSwitch) {
        sendFetch("BT", "Farbtempertaur", value);
    }
    console.log(value);
}

function setStatusBL(value){
    BLSwitch = value;
    document.getElementById("Alle").checked = false;
    alleSwitch = false;
    console.log(value);
}

function setStatusBR(value){
    BRSwitch = value
    document.getElementById("Alle").checked = false;
    alleSwitch = false;
    console.log(value);
}
function setBastel(value){
    BateltischSwitch = value
    document.getElementById("Alle").checked = false;
    alleSwitch = false;
    console.log(value);
}

function setAll(value){
    alleSwitch = value;
    document.getElementById("BL").checked = false;
    document.getElementById("BR").checked = false;
     BLSwitch = false;
     BRSwitch = false;
     let BateltischSwitch = false;
    console.log(value);
}

function sendFetch(lampe, modus, wert){
    fetch('http://192.168.0.58:3443/Lampen', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/JSON',
      },
      body: JSON.stringify({Lampe: lampe, Modus: modus, Wert: wert})
  });
}

function sendFetchAll(modus, wert){
    fetch('http://192.168.0.58:3443/LampenAll', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/JSON',
      },
      body: JSON.stringify({Modus: modus, Wert: wert})
  });
}