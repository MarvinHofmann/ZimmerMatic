const ws = new WebSocket('ws://192.168.0.58:8000');
let aktRoutine;
ws.addEventListener("open", (message) => {
    console.log("Client connected with server!")
})
ws.addEventListener('message', function (event){
    const data = event.data;
    
    if(data === "now"){
        btnfunction(3);
    }    
});

function btnfunction(number) {
    switch (number) {
      case 1:
        ws.send('hoch');
        break;
      case 2:
        ws.send('stop');
        break;
      case 3:
        ws.send('runter');
        break;

      default:
        break;
    }
  }

function send(){
  console.log("sende");
  console.log(document.getElementById("inputTime").innerText);
  fetch('/create', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({time: document.getElementById("inputTime").innerText})
  });
}