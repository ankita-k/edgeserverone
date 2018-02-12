#include <MySignals.h>
#include "Wire.h"
#include "SPI.h"

int Signal;

void setup()
{
  Serial.begin(115200);
  MySignals.begin();
}


void loop()
{
  while (!Serial.available());
  Signal = Serial.read();
  
  if (Signal == 1) {
    float temperature = MySignals.getTemperature();
    Serial.println(temperature, 2);
  }
  if (Signal == 2) {
    float conductance = MySignals.getGSR(CONDUCTANCE);
    float resistance = MySignals.getGSR(RESISTANCE);
    float conductanceVol = MySignals.getGSR(VOLTAGE);

    Serial.print(conductance, 2);
    Serial.print("A");

    Serial.print(resistance, 2);
    Serial.print("B");

    Serial.print(conductanceVol, 4);
    Serial.println("");
  }
}
