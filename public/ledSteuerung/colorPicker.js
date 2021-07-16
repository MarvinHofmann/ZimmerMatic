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
  sendFetch(color.red, color.green, color.blue, color.value);
});

function sendFetch(red, green, blue, value) {
  fetch("http://192.168.0.58:3443/D1Leds", {
    method: "POST",
    headers: {
      "Content-Type": "application/JSON",
    },
    body: JSON.stringify({ red: red, green: green, blue: blue, value: value }),
  });
}
