const ws = new WebSocket('ws://192.168.0.58:8000');

ws.addEventListener("open", () => {
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

function sumbit(){
    let time = document.getElementById(inputTime).innerText;
    let h = time.charAt[1]+charAt[2];
    let m = time.charAt[4]+charAt[5];
    console.log(time);
    console.log(h);
    console.log(m);
}