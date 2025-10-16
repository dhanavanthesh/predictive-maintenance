#include <OneWire.h>
#include <DallasTemperature.h>

#define ONE_WIRE_BUS 2
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

void setup() {
  Serial.begin(9600);
  Serial.println("DS18B20 Sensor Test");
  Serial.println("-------------------");

  sensors.begin();

  // Check how many sensors detected
  int deviceCount = sensors.getDeviceCount();
  Serial.print("Found ");
  Serial.print(deviceCount);
  Serial.println(" devices.");

  if (deviceCount == 0) {
    Serial.println("\nERROR: No sensors found!");
    Serial.println("Check:");
    Serial.println("1. Wiring (Yellow->Pin2, Red->5V, Black->GND)");
    Serial.println("2. Add 4.7kΩ resistor between Yellow and Red");
    Serial.println("3. Sensor might be damaged");
  }
}

void loop() {
  sensors.requestTemperatures();
  float temp = sensors.getTempCByIndex(0);

  Serial.print("Temperature: ");
  Serial.print(temp);
  Serial.println("°C");

  if (temp == -127.00) {
    Serial.println("  ⚠️ Sensor not responding - likely needs pull-up resistor");
  }

  delay(2000);
}
