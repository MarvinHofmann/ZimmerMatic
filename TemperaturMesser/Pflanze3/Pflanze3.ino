#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
const int rainPin = A0;
#include "arduino_secretPF3.h"
void setup() {
  
  Serial.begin(115200);                 //Serial connection
  WiFi.begin(SECRET_SSID, SECRET_PASS);   //WiFi connection
 
  while (WiFi.status() != WL_CONNECTED) {  //Wait for the WiFI connection completion
    delay(500); 
  }
   pinMode(rainPin, INPUT);
}
 
void loop() {
 delay(1000);
 int sensorValue = analogRead(rainPin);
  if (WiFi.status() == WL_CONNECTED) { //Check WiFi connection status
    HTTPClient http;    //Declare object of class HTTPClient
    http.begin("http://192.168.0.58:3443/plfanze3");      //Specify request destination
    http.addHeader("Content-Type", "application/json");  //Specify content-type header
    int httpCode = http.POST("{ \"feuchtigkeit\": " + String(sensorValue) +" }");   //Send the request
    String payload = http.getString();                  //Get the response payload
    http.end();  //Close connection
  }
 //Stunde schlafen
 ESP.deepSleep(3.6*10e8);
 
}
