#include <DHT.h>
#include <DHT_U.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include "DHT.h"
#include "arduino_secretSe2.h"
#define DHTPIN D5
#define DHTTYPE DHT22   // DHT 22  (AM2302)
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  
  Serial.begin(115200);                 //Serial connection
  WiFi.begin(SECRET_SSID, SECRET_PASS);   //WiFi connection   //WiFi connection
 
  while (WiFi.status() != WL_CONNECTED) {  //Wait for the WiFI connection completion
 
    delay(500);
    Serial.println("Waiting for connection");
 
  }
 dht.begin();
}
 
void loop() {
 delay(4000);
 float temp = dht.readTemperature();
 float feucht = dht.readHumidity();
 Serial.print("Humidity: ");
 Serial.print(feucht);
 Serial.println("%\t");
 Serial.print("Temperature: ");
 Serial.print(temp);
 Serial.println("C"); 
  if (WiFi.status() == WL_CONNECTED) { //Check WiFi connection status
 
    HTTPClient http;    //Declare object of class HTTPClient
 
    http.begin("http://192.168.0.58:3443/senderZwei");      //Specify request destination
    http.addHeader("Content-Type", "application/json");  //Specify content-type header
    int httpCode = http.POST("{ \"temperatur\": " + String(temp) + ", \"feuchtigkeit\":" + String(feucht) +" }");   //Send the request
    String payload = http.getString();                  //Get the response payload
 
    Serial.println(httpCode);   //Print HTTP return code
    Serial.println(payload);    //Print request response payload
 
    http.end();  //Close connection
 
  } else {
 
    Serial.println("Error in WiFi connection");
 
  }
 Serial.println("schlafe für 15 min");
 ESP.deepSleep(90*10e6);
 
}
