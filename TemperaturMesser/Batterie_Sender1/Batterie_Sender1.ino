#include <DHT.h>
#include <DHT_U.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include "DHT.h"
#define DHTPIN D5
#define DHTTYPE DHT22   // DHT 22  (AM2302)
#include "arduino_secretBatt.h"
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  WiFi.begin(SECRET_SSID, SECRET_PASS);   //WiFi connection
  while (WiFi.status() != WL_CONNECTED) {  //Wait for the WiFI connection completion
     delay(500);
  }
  dht.begin();
}
 
void loop() {
 delay(2000);
 float temp = dht.readTemperature();
 float feucht = dht.readHumidity();
 
  if (WiFi.status() == WL_CONNECTED) { //Check WiFi connection status
 
    HTTPClient http;    //Declare object of class HTTPClient
 
    http.begin("http://192.168.0.58:3443/");      //Specify request destination
    http.addHeader("Content-Type", "application/json");  //Specify content-type header
    int httpCode = http.POST("{ \"temperatur\": " + String(temp) + ", \"feuchtigkeit\":" + String(feucht) +" }");   //Send the request
    http.end();  //Close connection
 
  }
 ESP.deepSleep(90*10e6);
 
}
