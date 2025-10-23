// Include libraries for DS18B20 temperature sensor
#include <OneWire.h>
#include <DallasTemperature.h>

// Sound Sensor on Analog Pin A0
const int soundPin = A0;

// SW-420 Vibration Sensor Configuration (3-pin version)
// Wiring: VCC/+ to 5V, GND/- to GND, D0/OUT to Digital Pin 4
const int vibrationPin = 4;  // Digital pin for vibration sensor

// DS18B20 Temperature Sensor Configuration
// Wiring: Red (VCC) to 5V, Black (GND) to GND, Yellow/White (Data) to Digital Pin 8
#define ONE_WIRE_BUS 8  // Data wire is connected to pin 8

// Setup a oneWire instance to communicate with DS18B20
OneWire oneWire(ONE_WIRE_BUS);

// Pass oneWire reference to DallasTemperature library
DallasTemperature sensors(&oneWire);

void setup() {
  // Initialize serial communication at 9600 baud
  Serial.begin(9600);

  // Initialize vibration sensor pin as INPUT
  pinMode(vibrationPin, INPUT);

  // Initialize DS18B20 sensor
  sensors.begin();

  // Print CSV header (optional, server skips this line)
  Serial.println("soundLevel,temperature,vibration");

  // Wait for serial to be ready
  delay(1000);
}

void loop() {
  // Read analog value from sound sensor (0-1023)
  int soundLevel = analogRead(soundPin);

  // Request temperature reading from DS18B20
  sensors.requestTemperatures();

  // Read temperature in Celsius (device 0)
  float temperature = sensors.getTempCByIndex(0);

  // Check if temperature reading is valid (-127 means error)
  if (temperature == -127.00 || temperature == 85.00) {
    temperature = 0.0;  // Default to 0 if reading fails
  }

  // Read vibration sensor digital value (HIGH=1 when vibration detected, LOW=0 when no vibration)
  int vibrationDetected = digitalRead(vibrationPin);

  // Send data: soundLevel,temperature,vibration
  Serial.print(soundLevel);
  Serial.print(",");
  Serial.print(temperature);
  Serial.print(",");
  Serial.println(vibrationDetected);

  // Wait 2 seconds before next reading
  delay(2000);
}
