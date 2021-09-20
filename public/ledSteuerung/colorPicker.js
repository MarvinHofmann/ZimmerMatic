let Couchswitch = false;
let Uhrswitch = false;
let Tischswitch = false;
let TischswitchE = false;
let Dartswitch = false;
let alleSwitch = true;
let colorPicker = new iro.ColorPicker("#picker", {
  width: 320,
  color: "#0ff",
  wheelLightness: false,
});

colorPicker.on("input:end", function (color) {
  console.log(color.rgbString);
  console.log(color.value);
  console.log(color.red);
  console.log(color.green);
  console.log(color.blue);
  if (alleSwitch) {
    sendFetchAll(color.red, color.green, color.blue, color.value);
  }
  if (Dartswitch) {
    sendFetch(color.red, color.green, color.blue, color.value, 1);
  }
  if (Couchswitch) {
    sendFetch(color.red, color.green, color.blue, color.value, 2);
  }
  if (Tischswitch) {
    sendFetch(color.red, color.green, color.blue, color.value, 4);
  }
  if (TischswitchE) {
    sendFetch(color.red, color.green, color.blue, color.value, 5);
  }
  if (Uhrswitch) {
    sendFetch(color.red, color.green, color.blue, color.value, 3);
  }
});

function sendFetch(red, green, blue, value, who) {
  console.log("Sende Fetch");
  fetch("http://zimmermatic:3443/D1Leds", {
    method: "POST",
    headers: {
      "Content-Type": "application/JSON",
    },
    body: JSON.stringify({
      red: red,
      green: green,
      blue: blue,
      value: value,
      who: who,
    }),
  });
}

function sendFetchAll(red, green, blue, value) {
  fetch("http://zimmermatic:3443/D1LedsAll", {
    method: "POST",
    headers: {
      "Content-Type": "application/JSON",
    },
    body: JSON.stringify({ red: red, green: green, blue: blue, value: value }),
  });
}

function setStatusCouch(value) {
  Couchswitch = value;
  document.getElementById("Alle").checked = false;
  alleSwitch = false;
  console.log(value);
}

function setStatusDart(value) {
  Dartswitch = value;
  document.getElementById("Alle").checked = false;
  alleSwitch = false;
  console.log(value);
}

function setStatusTisch(value) {
  Tischswitch = value;
  document.getElementById("Alle").checked = false;
  alleSwitch = false;
  console.log(value);
}

function setStatusTischE(value) {
  TischswitchE = value;
  document.getElementById("Alle").checked = false;
  alleSwitch = false;
  console.log(value);
}

function setStatusUhr(value) {
  Uhrswitch = value;
  document.getElementById("Alle").checked = false;
  alleSwitch = false;
  console.log(value);
  s;
}

function setAll(value) {
  alleSwitch = value;
  document.getElementById("Couch").checked = false;
  document.getElementById("Dart").checked = false;
  document.getElementById("Tisch").checked = false;
  document.getElementById("TischE").checked = false;
  document.getElementById("Uhr").checked = false;
  Couchswitch = false;
  Dartswitch = false;
  Uhrswitch = false;
  Tischswitch = false;
  TischswitchE = false;
  console.log(value);
}

function buttonfunction(num) {
  switch (num) {
    case 1:
      sendFetchAll(0,0,0,0);
      break;
    case 2:
      sendFetch(0,255,255,100,2);
      sendFetch(252,79,255,100,1);
      sendFetch(252,79,255,100,5);
      sendFetch(0,255,255,100,3);
      sendFetch(0,255,255,100,4);
      break;
    case 3:
      sendFetch(255, 255, 255, 100, 4);
      break;
    case 4:
      sendFetchAll(0,255,255,100);
      break;
    case 5:
      sendFetchAll(0,255,255,100);
      break;
    case 6:
      
      break;
    default:
      break;
  }
}
