#include "arduino_secretPF1.h"

#include <DHT.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
const int rainPin = A0;
#include "DHT.h"

#define DHTPIN D5
#define DHTTYPE DHT22   // DHT 22  (AM2302)
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);                 //Serial connection
  WiFi.begin(SECRET_SSID, SECRET_PASS);   //WiFi connection
  while (WiFi.status() != WL_CONNECTED) {  //Wait for the WiFI connection completion
    delay(500);
    Serial.println("Waiting for connection");
  }
  pinMode(rainPin, INPUT);
  dht.begin();
}

void loop() {
  delay(2000);
  int sensorValue = analogRead(rainPin);
  Serial.print("Feuchtigkeit: ");
  Serial.println(sensorValue);
  delay(2000);
  float temp = dht.readTemperature();
  float feucht = dht.readHumidity();
  Serial.print("Humidity: ");
  Serial.print(feucht);
  Serial.println("%\t");
  Serial.print("Temperature: ");
  Serial.print(temp);
  Serial.println("C");
  //////////////////////////////////////Pflanze///////////////////////////////
  HTTPClient http;    //Declare object of class HTTPClient
  http.begin("http://192.168.0.58:3443/plfanze1");      //Specify request destination
  http.addHeader("Content-Type", "application/json");  //Specify content-type header
  int httpCode = http.POST("{ \"feuchtigkeit\": " + String(sensorValue) + " }");  //Send the request
  String payload = http.getString();                  //Get the response payload
  Serial.println(httpCode);   //Print HTTP return code
  Serial.println(payload);    //Print request response payload
  http.end();  //Close connection
  /////////////////////////////////////Temp////////////////////////////////////
  HTTPClient http1;    //Declare object of class HTTPClient
  http1.begin("http://192.168.0.58:3443/senderZwei");      //Specify request destination
  http1.addHeader("Content-Type", "application/json");  //Specify content-type header
  int httpCode1 = http1.POST("{ \"temperatur\": " + String(temp) + ", \"feuchtigkeit\":" + String(feucht) + " }");  //Send the request
  String payload1 = http1.getString();                  //Get the response payload
  Serial.println(httpCode1);   //Print HTTP return code
  Serial.println(payload1);    //Print request response payload
  http1.end();  //Close connection
  //15min schlafen
  ESP.deepSleep(90*10e6);
  delay(10);
}
