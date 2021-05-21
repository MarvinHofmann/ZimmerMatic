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

function sendRoutine(){
    let h = document.getElementById('inputTime').value;
    let m = document.getElementById("inputTimeMin").value;
    let mh = 0;
    console.log('Stunde ' + h);
    console.log('Minute ' + m);

    if (document.getElementById("flexSwitchCheckChecked").checked) {
        mh = 0;
    }
    console.log(mh);
    aktRoutine = String(h + ":" + m)
    document.getElementById('aktuelleRoutine').innerText = aktRoutine;
    ws.send(h);
    ws.send(m);
    ws.send(mh);
}