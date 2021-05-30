
#include <ArduinoWebsockets.h>
#include <ESP8266WiFi.h>
#include "arduino_secret.h"

const int DOWN = D3;
const int HOCH = D1;
const int STOP = D2;

const char* ssid = SECRET_SSID; //Enter SSID
const char* password = SECRET_PASS; //Enter Password
const char* websockets_server_host = SECRET_HOST; //Enter server adress
const uint16_t websockets_server_port = 8000; // Enter server port

using namespace websockets;

WebsocketsClient client;
void setup() {

  pinMode(DOWN, OUTPUT);
  pinMode(HOCH, OUTPUT);
  pinMode(STOP, OUTPUT);

  delay(2000);
  digitalWrite(DOWN, LOW);
  digitalWrite(HOCH, LOW);
  digitalWrite(STOP, LOW);

  Serial.begin(115200);
  Serial.println(ssid);
  Serial.println(password);
  Serial.println(websockets_server_host);
  // Connect to wifi
  WiFi.begin(ssid, password);

  // Wait some time to connect to wifi
  for (int i = 0; i < 10 && WiFi.status() != WL_CONNECTED; i++) {
    Serial.print(".");
    delay(1000);
  }

  // Check if connected to wifi
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("No Wifi!");
    return;
  }

  Serial.println("Connected to Wifi, Connecting to server.");
  // try to connect to Websockets server
  bool connected = client.connect(websockets_server_host, websockets_server_port, "/");
  
  if (connected) {
    Serial.println(WiFi.localIP()); 
    Serial.println("Connecetd!");
    client.send("Hello Server");
  } else {
    Serial.println("Not Connected!");
  }

  // run callback when messages are received
  client.onMessage([&](WebsocketsMessage message) {
    Serial.print("Got Message: ");
    Serial.println(message.data());
    int n = message.data().toInt();
    switch (n) {
      case 0: 
        digitalWrite(DOWN, LOW);
        delay(50);
        digitalWrite(STOP, LOW);
        delay(50);
        digitalWrite(HOCH, HIGH);
        delay(50);
        break;
      case 1:  
        digitalWrite(DOWN, LOW);
        delay(50);
        digitalWrite(HOCH, LOW);
        delay(50);
        digitalWrite(STOP, HIGH);
        delay(50);
        break;
      case 2:  
        digitalWrite(STOP, LOW);
        delay(50);
        digitalWrite(HOCH, LOW);
        delay(50);
        digitalWrite(DOWN, HIGH);
        delay(50);
        break;
    }
  });
}

void loop() {
  // let the websockets client check for incoming messages
  if (client.available()) {
    client.poll();
  }
  delay(500);
}
