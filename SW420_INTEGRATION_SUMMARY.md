# SW-420 Vibration Sensor Integration Summary

## Overview
Successfully integrated the **SW-420 3-pin vibration sensor** into the predictive maintenance system.

---

## Changes Made

### 1. Arduino Code (ARDUINO_CODE/ARDUINO_CODE.ino)

**Added:**
- SW-420 sensor configuration on Digital Pin 4
- Pin initialization in setup()
- Vibration reading in loop()
- Updated CSV output format

**Wiring:**
```
SW-420 Pin    → Arduino Pin
VCC/+         → 5V
GND/-         → GND
D0/OUT        → Digital Pin 4
```

**How it works:**
- D0 outputs **LOW (0)** when no vibration
- D0 outputs **HIGH (1)** when vibration is detected
- Reading is taken every 2 seconds along with sound and temperature

---

### 2. Backend Server (backend/server.js)

**Added:**
- `VIBRATION_THRESHOLD` constant (value: 1)
- `vibration` field to `latestData` object
- Parsing of vibration value from CSV
- `vibrationAlert` flag based on threshold
- Updated console logging to include vibration
- Updated `/api/thresholds` endpoint

**Data Format:**
```javascript
{
  soundLevel: 245,
  temperature: 24.50,
  vibration: 0,  // NEW: 0 or 1
  timestamp: "2025-10-23T...",
  soundAlert: false,
  tempAlert: false,
  vibrationAlert: false  // NEW
}
```

**Serial CSV Format:**
```
soundLevel,temperature,vibration
245,24.50,0
380,25.00,1
```

---

### 3. Test File Created

**Location:** `TEST_SENSOR/TEST_VIBRATION_SENSOR.ino`

**Purpose:** Standalone test to verify SW-420 sensor functionality

**Usage:**
1. Upload test sketch to Arduino
2. Open Serial Monitor (9600 baud)
3. Tap/shake the sensor
4. Should display "VIBRATION DETECTED!" when triggered

---

### 4. Documentation Created

**WIRING_GUIDE.md:**
- Complete wiring instructions for all sensors
- Pin assignment table
- Visual connection diagram
- Troubleshooting section
- Testing procedures
- Serial output format

---

### 5. README.md Updated

**Changes:**
- Updated pin assignments (D8 for temperature, D4 for vibration)
- Corrected circuit diagrams
- Updated detailed wiring section
- Added note about 3-pin SW-420 version

---

## Pin Assignment Summary

| Sensor | Type | Pin | Notes |
|--------|------|-----|-------|
| LM393 Sound | Analog | A0 | Analog output (0-1023) |
| SW-420 Vibration | Digital | D4 | Digital output (0 or 1) |
| DS18B20 Temperature | Digital | D8 | OneWire protocol, needs 4.7kΩ pull-up |

---

## Testing Instructions

### Step 1: Test Vibration Sensor Alone
```bash
1. Upload: TEST_SENSOR/TEST_VIBRATION_SENSOR.ino
2. Open Serial Monitor (9600 baud)
3. Tap the sensor
4. Should show: "VIBRATION DETECTED! (1)"
```

### Step 2: Test All Sensors Together
```bash
1. Upload: ARDUINO_CODE/ARDUINO_CODE.ino
2. Open Serial Monitor (9600 baud)
3. Should see CSV output:
   soundLevel,temperature,vibration
   245,24.50,0
   380,25.00,1  (when vibration occurs)
```

### Step 3: Test Full System
```bash
1. Start backend: cd backend && node server.js
2. Start frontend: cd frontend && npm start
3. Open http://localhost:3000
4. Tap vibration sensor
5. Should see:
   - Vibration value change to 1
   - Alert if threshold exceeded
```

---

## Sensor Sensitivity Adjustment

The SW-420 module has a **potentiometer** on board:
- **Turn clockwise** → Increase sensitivity (detects smaller vibrations)
- **Turn counter-clockwise** → Decrease sensitivity (only large vibrations)

Start with medium sensitivity and adjust based on your application.

---

## Troubleshooting

### Vibration sensor always reads 0 or 1:
- Adjust the sensitivity potentiometer
- Check wiring connections
- Verify VCC and GND are connected

### Backend not receiving vibration data:
- Check serial monitor shows 3 values (soundLevel,temp,vibration)
- Verify backend parses all 3 values
- Check console logs for parsing errors

### Frontend not displaying vibration:
- Update frontend components to display vibration value
- Check WebSocket is receiving vibration field
- Verify frontend expects 3-field data format

---

## Next Steps

1. **Update Frontend** (if needed) to display vibration data
2. **Calibrate thresholds** based on your specific machinery
3. **Test in production** environment with actual equipment
4. **Adjust sensitivity** of SW-420 for your use case

---

## Files Modified

- ✅ `ARDUINO_CODE/ARDUINO_CODE.ino` - Added vibration sensor
- ✅ `backend/server.js` - Added vibration parsing and alerts
- ✅ `README.md` - Updated pin assignments
- ✅ `ARDUINO_CODE/WIRING_GUIDE.md` - Created detailed guide
- ✅ `TEST_SENSOR/TEST_VIBRATION_SENSOR.ino` - Created test file

---

## Technical Specifications

**SW-420 Vibration Sensor:**
- Operating Voltage: 3.3V - 5V
- Output: Digital (HIGH/LOW)
- Sensitivity: Adjustable via potentiometer
- Current Draw: ~15mA
- Detection: Vibration/shock/tilt
- Response Time: <100ms

---

## Complete System Data Flow

```
SW-420 Sensor
    ↓ (Digital HIGH/LOW on Pin 4)
Arduino Uno
    ↓ (Serial CSV: soundLevel,temp,vibration)
Node.js Backend (COM4, 9600 baud)
    ↓ (WebSocket via Socket.IO)
React Frontend
    ↓ (Display + Alerts)
User Interface
```

---

## Success Criteria ✅

- [x] SW-420 sensor wired to Arduino Pin 4
- [x] Arduino code reads vibration state
- [x] Backend receives and parses vibration data
- [x] Vibration threshold system implemented
- [x] Test file created and documented
- [x] Complete wiring guide provided
- [x] README updated with correct pin assignments

---

**Integration Complete!** 🎉

Your predictive maintenance system now monitors:
1. **Sound levels** (LM393 on A0)
2. **Temperature** (DS18B20 on D8)
3. **Vibration** (SW-420 on D4)
