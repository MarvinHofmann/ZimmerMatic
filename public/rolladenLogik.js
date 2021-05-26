const ws = new WebSocket("ws://192.168.0.58:8000");
let aktRoutine;
ws.addEventListener("open", (message) => {
  console.log("Client connected with server!");
});
ws.addEventListener("message", function (event) {
  const data = event.data;

  if (data === "now") {
    btnfunction(3);
  }
});

function btnfunction(number) {
  switch (number) {
    case 1:
      ws.send("hoch");
      break;
    case 2:
      ws.send("stop");
      break;
    case 3:
      ws.send("runter");
      break;

    default:
      break;
  }
}

function send() {
  console.log("sende");
  console.log(document.getElementById("inputTime").value);
  fetch("/create", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      time: document.getElementById("inputTime").value,
      richtung: document.getElementById("inputRichtung").value,
    }),
  });
  document.getElementById("inputTime").innerText = "Erfolgreich";
  document.getElementById("inputTime").innerText = "Erstellt";
}

function sendDelete() {
  console.log("sende Löschen");
  console.log(document.getElementById("inputIndexDelete").value);
  fetch("/deleteR", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      num: document.getElementById("inputIndexDelete").value,
    }),
  });
  document.getElementById("inputIndexDelete").innerText =
    "Erfolgreich gelöscht";
}

$("input[type='number']").inputSpinner({

  // button text/icons
  decrementButton: "<strong>-</strong>", 
  incrementButton: "<strong>+</strong>", 

  // class of input group
  groupClass: "input-group-spinner",

  // button class
  buttonsClass: "btn-outline-secondary",

  // button width
  buttonsWidth: "2.5em",

  // text alignment
  textAlign: "center",

  // delay in milliseconds
  autoDelay: 500, 

  // interval in milliseconds
  autoInterval: 100,

  // set this `true` to disable the possibility to enter or paste the number via keyboard
  buttonsOnly: false, 

  // set this to `false` to disallow the use of the up and down arrow keys to step
  keyboardStepping: true, 

  // the locale, per default detected automatically from the browser
  locale: navigator.language, 

  // the editor (parsing and rendering of the input)
  editor: I18nEditor, 
  
  // the template of the input
  template: // the template of the input
    '<div class="input-group ${groupClass}">' +
    '<div class="input-group-prepend"><button style="min-width: ${buttonsWidth}" class="btn btn-decrement ${buttonsClass} btn-minus" type="button">${decrementButton}</button></div>' +
    '<input type="text" inputmode="decimal" style="text-align: ${textAlign}" class="form-control form-control-text-input"/>' +
    '<div class="input-group-append"><button style="min-width: ${buttonsWidth}" class="btn btn-increment ${buttonsClass} btn-plus" type="button">${incrementButton}</button></div>' +
    '</div>'
  
});

changedElement.addEventListener("change",function(event) {
    valueOutput.innerHTML = changedElement.value
    instance.setValue(new value)
    instance.destroy()
})
  