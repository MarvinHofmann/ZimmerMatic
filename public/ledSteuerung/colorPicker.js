let Couchswitch = false;
let Uhrswitch = false;
let Tischswitch = false;
let Dartswitch = false;
let alleSwitch = true;
let colorPicker = new iro.ColorPicker("#picker", {
  width: 320,
  color: "#f00",
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
      //sende an 1 => dart d1 whitelist
    sendFetch(color.red, color.green, color.blue, color.value, 1);
  }
  if (Couchswitch) {
    sendFetch(color.red, color.green, color.blue, color.value, 2);
  }
  if (Tischswitch) {
    sendFetch(color.red, color.green, color.blue, color.value, 2);
  }
  if (Uhrswitch) {
    sendFetch(color.red, color.green, color.blue, color.value, 2);
  }
});

function sendFetch(red, green, blue, value, who) {
  console.log("Sende Fetch");
  fetch("http://192.168.0.58:3443/D1Leds", {
    method: "POST",
    headers: {
      "Content-Type": "application/JSON",
    },
    body: JSON.stringify({ red: red, green: green, blue: blue, value: value, who: who}),
  });
}

function sendFetchAll(red, green, blue, value) {
    fetch("http://192.168.0.58:3443/D1LedsAll", {
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

function setStatusUhr(value) {
  Uhrswitch = value;
  document.getElementById("Alle").checked = false;
  alleSwitch = false;
  console.log(value);
}

function setAll(value) {
  alleSwitch = value;
  document.getElementById("Couch").checked = false;
  document.getElementById("Dart").checked = false;
  document.getElementById("Tisch").checked = false;
  document.getElementById("Uhr").checked = false;
  Couchswitch = false;
  Dartswitch = false;
  Uhrswitch = false;
  Tischswitch = false;
  console.log(value);
}
