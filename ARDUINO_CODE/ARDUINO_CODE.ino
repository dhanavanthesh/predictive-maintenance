// Sound Sensor on Analog Pin A0
const int soundPin = A0;

void setup() {
  // Initialize serial communication at 9600 baud
  Serial.begin(9600);

  // Print CSV header (optional, server skips this line)
  Serial.println("soundLevel");

  // Wait for serial to be ready
  delay(1000);
}

void loop() {
  // Read analog value from sound sensor (0-1023)
  int soundLevel = analogRead(soundPin);

  // Send data: soundLevel
  Serial.println(soundLevel);

  // Wait 2 seconds before next reading
  delay(2000);
}
