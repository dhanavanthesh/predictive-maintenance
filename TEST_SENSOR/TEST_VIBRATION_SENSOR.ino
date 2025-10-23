// SW-420 Vibration Sensor Test
// This test program reads the SW-420 vibration sensor and prints its state to the Serial Monitor

// SW-420 Vibration Sensor Configuration (3-pin version)
// Wiring:
//   VCC/+ → 5V (Arduino 5V pin)
//   GND/- → GND (Arduino Ground)
//   D0/OUT → Digital Pin 4 (Arduino Digital Pin 4)

const int vibrationPin = 4;  // Digital pin connected to D0 of SW-420

void setup() {
  // Initialize serial communication
  Serial.begin(9600);
  Serial.println("SW-420 Vibration Sensor Test");
  Serial.println("============================");
  Serial.println();

  // Configure vibration sensor pin as INPUT
  pinMode(vibrationPin, INPUT);

  Serial.println("Sensor initialized!");
  Serial.println("Waiting for vibrations...");
  Serial.println();

  delay(1000);
}

void loop() {
  // Read the digital state from the vibration sensor
  // HIGH (1) = Vibration detected
  // LOW (0) = No vibration
  int vibrationState = digitalRead(vibrationPin);

  // Print the current state
  Serial.print("Vibration State: ");

  if (vibrationState == HIGH) {
    Serial.println("VIBRATION DETECTED! (1)");
  } else {
    Serial.println("No vibration (0)");
  }

  // Wait 500ms before next reading
  delay(500);
}
