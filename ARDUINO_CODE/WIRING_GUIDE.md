# Wiring Guide for Predictive Maintenance System

This guide shows how to connect all sensors to your Arduino Uno.

## Required Components

1. **Arduino Uno**
2. **Sound Sensor Module** (Analog)
3. **DS18B20 Temperature Sensor** (Digital, OneWire)
4. **SW-420 Vibration Sensor** (3-pin, Digital)

---

## Sensor Wiring Connections

### 1. Sound Sensor (Analog Pin A0)

| Sound Sensor Pin | Arduino Pin | Function |
|-----------------|-------------|----------|
| VCC / +         | 5V          | Power supply |
| GND / -         | GND         | Ground |
| A0 / OUT        | A0          | Analog output signal |

---

### 2. SW-420 Vibration Sensor (Digital Pin 4)

**3-Pin Version:**

| Vibration Sensor Pin | Arduino Pin | Function |
|---------------------|-------------|----------|
| VCC / +             | 5V          | Power supply |
| GND / -             | GND         | Ground |
| D0 / OUT            | Digital 4   | Digital output (HIGH when vibration detected) |

**Important Notes:**
- The D0 pin outputs **HIGH (1)** when vibration is detected
- The D0 pin outputs **LOW (0)** when no vibration
- Some SW-420 modules have a sensitivity adjustment potentiometer (turn clockwise to increase sensitivity)

---

### 3. DS18B20 Temperature Sensor (Digital Pin 8)

| DS18B20 Pin | Wire Color (typical) | Arduino Pin | Function |
|-------------|---------------------|-------------|----------|
| VCC         | Red                 | 5V          | Power supply |
| GND         | Black               | GND         | Ground |
| DATA        | Yellow/White        | Digital 8   | OneWire data signal |

**Important Notes:**
- Requires a **4.7kΩ pull-up resistor** between DATA (Yellow) and VCC (Red)
- Without the pull-up resistor, you may get reading errors (-127°C)

---

## Complete Wiring Summary

### Arduino Pin Assignments:

| Arduino Pin | Sensor Connection |
|-------------|------------------|
| 5V          | Sound Sensor VCC, Vibration Sensor VCC, DS18B20 VCC |
| GND         | Sound Sensor GND, Vibration Sensor GND, DS18B20 GND |
| A0          | Sound Sensor Output |
| Digital 4   | SW-420 Vibration Sensor D0 Output |
| Digital 8   | DS18B20 Data Pin (with 4.7kΩ pull-up resistor) |

---

## Visual Connection Diagram

```
Arduino Uno
┌─────────────────────────────┐
│                             │
│  [5V]─────┬─────┬─────┬    │
│           │     │     │     │
│          [Sound][Vib][Temp] │
│                             │
│  [GND]────┴─────┴─────┴    │
│                             │
│  [A0]─────[Sound Sensor]   │
│                             │
│  [D4]─────[SW-420 Vib]     │
│                             │
│  [D8]─────[DS18B20]        │
│           (with 4.7kΩ      │
│            pull-up)         │
└─────────────────────────────┘
```

---

## Testing Your Sensors

### Test Individual Sensors:

1. **Test Vibration Sensor:**
   - Upload: `TEST_SENSOR/TEST_VIBRATION_SENSOR.ino`
   - Open Serial Monitor (9600 baud)
   - Tap or shake the sensor
   - Should display "VIBRATION DETECTED!" when vibration occurs

2. **Test Temperature Sensor:**
   - Upload: `TEST_SENSOR/TEST_SENSOR.ino`
   - Open Serial Monitor (9600 baud)
   - Should display temperature readings
   - If showing -127°C, check the 4.7kΩ pull-up resistor

3. **Test All Sensors Together:**
   - Upload: `ARDUINO_CODE/ARDUINO_CODE.ino`
   - Open Serial Monitor (9600 baud)
   - Should display: `soundLevel,temperature,vibration`
   - Example: `245,24.50,0` (no vibration) or `380,25.00,1` (vibration detected)

---

## Troubleshooting

### Vibration Sensor Issues:

1. **Always reads 0 or 1:**
   - Adjust the sensitivity potentiometer on the sensor
   - Turn clockwise to increase sensitivity

2. **No response:**
   - Check wiring connections
   - Verify D0 is connected to Digital Pin 4
   - Ensure VCC and GND are properly connected

### Temperature Sensor Issues:

1. **Reading -127°C:**
   - Add/check 4.7kΩ pull-up resistor between DATA and VCC
   - Verify OneWire library is installed
   - Check wire connections

2. **Reading 85°C constantly:**
   - Sensor initialization issue
   - Check wire connections
   - Ensure proper grounding

### Sound Sensor Issues:

1. **Always reads 0:**
   - Check VCC and GND connections
   - Verify A0 connection

2. **Erratic readings:**
   - Normal for analog sensors
   - May need to adjust sensor gain potentiometer

---

## Serial Output Format

The Arduino sends data via Serial in CSV format:

```
soundLevel,temperature,vibration
245,24.50,0
380,25.00,1
```

- **soundLevel**: 0-1023 (analog value)
- **temperature**: Celsius (float)
- **vibration**: 0 (no vibration) or 1 (vibration detected)

---

## Power Considerations

- **Total Current Draw:**
  - Sound Sensor: ~5-10mA
  - SW-420 Vibration: ~15mA
  - DS18B20 Temperature: ~1.5mA
  - **Total: ~25mA** (well within Arduino 5V pin capacity of 200mA)

- Safe to power all sensors from Arduino 5V pin
- Ensure USB cable provides adequate current (500mA+ recommended)

---

## Next Steps

1. Wire all sensors according to this guide
2. Test each sensor individually
3. Upload the main code (`ARDUINO_CODE.ino`)
4. Connect to the backend server
5. View real-time data on the web dashboard
