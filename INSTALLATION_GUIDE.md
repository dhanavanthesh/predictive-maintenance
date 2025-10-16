# Complete Installation Guide
## Arduino Predictive Maintenance System

This guide will walk you through the complete setup process from scratch.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Hardware Setup](#hardware-setup)
3. [Software Installation](#software-installation)
4. [Arduino Configuration](#arduino-configuration)
5. [Backend Setup](#backend-setup)
6. [Frontend Setup](#frontend-setup)
7. [Running the Application](#running-the-application)
8. [Testing](#testing)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software:
- **Node.js** (v16.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Arduino IDE** (v1.8.0 or higher) - [Download](https://www.arduino.cc/en/software)
- **Git** (optional, for version control) - [Download](https://git-scm.com/)

### Required Hardware:
- Arduino Uno R3
- DS18B20 Temperature Sensor
- Sound Sensor Module (KY-037 or similar)
- USB A to B Cable (for Arduino)
- Breadboard
- Jumper wires
- 4.7kΩ resistor (pull-up resistor for DS18B20)

### Operating System:
- Windows 10/11
- macOS 10.15 or higher
- Linux (Ubuntu 20.04 or similar)

---

## Hardware Setup

### Step 1: Assemble the Circuit

#### DS18B20 Temperature Sensor Wiring:
```
DS18B20 Pin Layout (looking at flat side):
┌─────────────┐
│ GND VCC DAT │
└─────────────┘

Connections:
• GND  → Arduino GND
• VCC  → Arduino 5V
• DATA → Arduino Digital Pin 2
• Add 4.7kΩ resistor between VCC and DATA pins
```

#### Sound Sensor Module Wiring:
```
Sound Sensor Pins:
• VCC → Arduino 5V
• GND → Arduino GND
• A0  → Arduino Analog Pin A0
```

### Step 2: Circuit Diagram

```
                    Arduino Uno R3
                  ┌─────────────────┐
                  │                 │
    DS18B20       │  Digital Pin 2  │────── DATA (with 4.7kΩ to 5V)
                  │  5V             │────── VCC (both sensors)
                  │  GND            │────── GND (both sensors)
    Sound Sensor  │  Analog Pin A0  │────── A0
                  │                 │
                  └─────────────────┘
                          │
                          │ USB Cable
                          ↓
                      Computer
```

### Step 3: Verify Connections
- Double-check all wiring
- Ensure the 4.7kΩ pull-up resistor is connected between DS18B20 DATA and VCC
- Make sure no wires are loose

---

## Software Installation

### Step 1: Install Node.js and npm

**Windows:**
1. Download Node.js installer from [nodejs.org](https://nodejs.org/)
2. Run the installer (choose LTS version)
3. Follow the installation wizard (keep default settings)
4. Verify installation:
```bash
node --version
npm --version
```

**macOS:**
```bash
# Using Homebrew
brew install node

# Verify
node --version
npm --version
```

**Linux (Ubuntu/Debian):**
```bash
# Update package index
sudo apt update

# Install Node.js and npm
sudo apt install nodejs npm

# Verify
node --version
npm --version
```

### Step 2: Install Arduino IDE

**Windows:**
1. Download from [arduino.cc](https://www.arduino.cc/en/software)
2. Run the installer
3. Install driver when prompted

**macOS:**
1. Download .dmg file
2. Drag Arduino to Applications
3. Open and allow security permissions

**Linux:**
```bash
# Download and extract
wget https://downloads.arduino.cc/arduino-1.8.19-linux64.tar.xz
tar -xf arduino-1.8.19-linux64.tar.xz
cd arduino-1.8.19
sudo ./install.sh
```

---

## Arduino Configuration

### Step 1: Install Required Libraries

1. Open Arduino IDE
2. Go to **Sketch** → **Include Library** → **Manage Libraries**
3. Search and install the following libraries:

**OneWire Library:**
- In Library Manager, search: "OneWire"
- Install "OneWire by Paul Stoffregen"

**DallasTemperature Library:**
- Search: "DallasTemperature"
- Install "DallasTemperature by Miles Burton"

### Step 2: Upload Arduino Code

1. Connect Arduino Uno to computer via USB
2. In Arduino IDE, go to **Tools** → **Board** → **Arduino Uno**
3. Go to **Tools** → **Port** and select your Arduino port:
   - **Windows:** COM3, COM4, COM5, etc.
   - **macOS:** /dev/cu.usbmodem* or /dev/tty.usbmodem*
   - **Linux:** /dev/ttyUSB0 or /dev/ttyACM0

4. Open `ARDUINO_CODE.ino` from the project folder
5. Click **Upload** button (→) or press Ctrl+U
6. Wait for "Done uploading" message

### Step 3: Test Arduino Connection

1. Open **Serial Monitor** (Tools → Serial Monitor)
2. Set baud rate to **9600**
3. You should see output like:
```
temperature,soundLevel
25.50,342
25.62,338
25.75,345
```

If you see this, Arduino is working correctly!

---

## Backend Setup

### Step 1: Navigate to Backend Folder

```bash
cd predictive-maintenance/backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- express (web server)
- socket.io (real-time communication)
- serialport (Arduino communication)
- @serialport/parser-readline (parse serial data)
- cors (cross-origin requests)

**Installation should show:**
```
added 150+ packages in 30s
```

### Step 3: Configure Serial Port

1. Find your Arduino COM port:

**Windows - Using Device Manager:**
```bash
# Open Command Prompt as Administrator
mode
```
Or: Open Device Manager → Ports (COM & LPT) → Look for "Arduino Uno (COM3)"

**macOS:**
```bash
ls /dev/cu.*
# Look for: /dev/cu.usbmodem* or /dev/cu.usbserial*
```

**Linux:**
```bash
ls /dev/tty*
# Look for: /dev/ttyUSB0 or /dev/ttyACM0

# Give permission (if needed)
sudo chmod 666 /dev/ttyUSB0
# Or add user to dialout group
sudo usermod -a -G dialout $USER
# Then logout and login again
```

2. Edit `server.js` (line 22):
```javascript
const SERIAL_PORT = 'COM3'; // Change to YOUR port

// Windows: 'COM3', 'COM4', etc.
// macOS: '/dev/cu.usbmodem14101'
// Linux: '/dev/ttyUSB0' or '/dev/ttyACM0'
```

### Step 4: Verify Backend Installation

```bash
# Check if all packages are installed
npm list --depth=0

# Should show:
# ├── express@4.18.2
# ├── socket.io@4.6.1
# ├── serialport@12.0.0
# ├── @serialport/parser-readline@12.0.0
# └── cors@2.8.5
```

---

## Frontend Setup

### Step 1: Navigate to Frontend Folder

```bash
cd ../frontend
# Or from project root:
cd predictive-maintenance/frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- react (UI library)
- react-dom (React DOM renderer)
- react-scripts (build tools)
- socket.io-client (WebSocket client)
- chart.js (charting library)
- react-chartjs-2 (React wrapper for Chart.js)

**Installation should show:**
```
added 1500+ packages in 90s
```

### Step 3: Verify Frontend Installation

```bash
# Check if all packages are installed
npm list --depth=0

# Should show:
# ├── react@18.2.0
# ├── react-dom@18.2.0
# ├── react-scripts@5.0.1
# ├── socket.io-client@4.6.1
# ├── chart.js@4.4.0
# └── react-chartjs-2@5.2.0
```

---

## Running the Application

### Method 1: Development Mode (Recommended)

**Step 1: Start Backend Server**

Open Terminal/Command Prompt 1:
```bash
cd predictive-maintenance/backend
node server.js
```

**Expected output:**
```
========================================
Server running on http://localhost:5000
========================================

Serial port opened successfully on COM3
Client connected: abc123xyz
Temperature: 25.50°C, Sound: 342
Temperature: 25.62°C, Sound: 338
```

**Step 2: Start Frontend Development Server**

Open Terminal/Command Prompt 2:
```bash
cd predictive-maintenance/frontend
npm start
```

**Expected output:**
```
Compiled successfully!

You can now view predictive-maintenance-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.100:3000
```

**Step 3: Open Browser**
- Browser should auto-open to `http://localhost:3000`
- If not, manually open: `http://localhost:3000`

### Method 2: Production Mode

**Step 1: Build Frontend**
```bash
cd predictive-maintenance/frontend
npm run build
```

**Step 2: Run Backend (serves both API and React app)**
```bash
cd ../backend
node server.js
```

**Step 3: Open Browser**
- Navigate to: `http://localhost:5000`

---

## Testing

### Test 1: Without Arduino (Simulation Mode)

1. **Disconnect Arduino** or set wrong COM port in server.js
2. Start backend:
```bash
cd backend
node server.js
```

**Expected:**
```
Error opening serial port: ...
Running in SIMULATION mode
```

3. Start frontend and verify random data appears
4. This confirms the app works independently

### Test 2: With Arduino (Real Data)

1. **Connect Arduino** via USB
2. **Close Arduino IDE Serial Monitor** (important!)
3. Set correct COM port in server.js
4. Start backend:
```bash
node server.js
```

**Expected:**
```
Serial port opened successfully on COM3
Temperature: 25.50°C, Sound: 342
```

5. Verify dashboard shows real sensor data

### Test 3: Alert System

**Trigger Temperature Alert:**
1. Heat the DS18B20 sensor (hold it in your hand)
2. Wait until temperature > 30°C
3. Dashboard should show yellow alert banner

**Trigger Sound Alert:**
1. Make loud noise near sound sensor (clap, shout)
2. If sound level > 400, alert appears

### Test 4: Real-time Updates

1. Cover/uncover sound sensor
2. Observe immediate chart updates
3. Check timestamps update every 2 seconds

### Test 5: Multiple Browsers

1. Open dashboard in Chrome
2. Open dashboard in another browser/tab
3. Both should show synchronized data
4. Backend console shows multiple clients connected

---

## Troubleshooting

### Issue 1: "Error opening serial port"

**Symptoms:**
```
Error opening serial port: Port not found
```

**Solutions:**
```bash
# 1. Check Arduino is connected
# Windows:
mode

# macOS/Linux:
ls /dev/tty* | grep -i usb

# 2. Close Arduino IDE Serial Monitor (it locks the port)

# 3. Try different COM port in server.js
const SERIAL_PORT = 'COM4'; // Try COM4, COM5, etc.

# 4. Windows: Install Arduino drivers
# Download from arduino.cc/en/software

# 5. Linux: Fix permissions
sudo chmod 666 /dev/ttyUSB0
sudo usermod -a -G dialout $USER
# Then logout and login
```

### Issue 2: "Cannot find module 'serialport'"

**Solution:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Issue 3: Frontend shows "Disconnected"

**Solutions:**
```bash
# 1. Check backend is running
# Terminal should show "Server running on http://localhost:5000"

# 2. Check firewall
# Windows: Allow Node.js in Windows Defender Firewall
# macOS: System Preferences → Security → Firewall → Allow Node

# 3. Clear browser cache and refresh
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (macOS)

# 4. Check browser console (F12) for errors
```

### Issue 4: Charts not displaying

**Solutions:**
```bash
# 1. Clear frontend cache
cd frontend
rm -rf node_modules package-lock.json
npm install

# 2. Check browser console (F12) for errors

# 3. Verify Chart.js is installed
npm list chart.js
# Should show: chart.js@4.4.0
```

### Issue 5: Arduino sends garbled data

**Solutions:**
```
1. Open Arduino Serial Monitor
2. Verify baud rate is 9600
3. Check output format is: 25.50,342
4. Re-upload Arduino code
5. Check sensor connections
```

### Issue 6: Temperature shows -127.00

**Solution:**
```
DS18B20 not detected!

Check:
1. 4.7kΩ pull-up resistor connected between DATA and VCC
2. Correct wiring (GND, VCC, DATA)
3. Sensor not damaged
4. Try different digital pin (update Arduino code accordingly)
```

### Issue 7: Sound sensor always shows 0 or 1023

**Solutions:**
```
1. Adjust sensor potentiometer (small screw on module)
2. Check wiring to A0 pin
3. Test with multimeter (should read 0-5V on A0)
4. Replace sensor if damaged
```

### Issue 8: "EADDRINUSE: Port 5000 already in use"

**Solution:**
```bash
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# macOS/Linux:
lsof -ti:5000 | xargs kill -9

# Or change port in server.js:
const PORT = 5001; // Use different port
```

### Issue 9: High CPU usage

**Solutions:**
```
1. Close unused browser tabs
2. Reduce MAX_DATA_POINTS in App.js:
   const MAX_DATA_POINTS = 10; // Was 20

3. Increase Arduino delay:
   delay(5000); // Send data every 5 seconds instead of 2
```

### Issue 10: npm install fails

**Solutions:**
```bash
# 1. Clear npm cache
npm cache clean --force

# 2. Delete lock file and node_modules
rm -rf node_modules package-lock.json
npm install

# 3. Update npm
npm install -g npm@latest

# 4. Use administrator/sudo
# Windows: Run terminal as Administrator
# macOS/Linux: sudo npm install (not recommended, prefer fixing permissions)
```

---

## Customization Guide

### Change Temperature Threshold

Edit `backend/server.js`:
```javascript
const TEMP_THRESHOLD = 35; // Change from 30 to 35°C
```

### Change Sound Threshold

Edit `backend/server.js`:
```javascript
const SOUND_THRESHOLD = 500; // Change from 400 to 500
```

### Change Update Frequency

Edit `ARDUINO_CODE.ino`:
```cpp
delay(5000); // Send data every 5 seconds instead of 2
```

### Change Chart Colors

Edit `frontend/src/App.js`:
```javascript
// Temperature chart - change from red to orange
<ChartCard
  color="rgb(255, 165, 0)" // Orange
  // ...
/>

// Sound chart - change from blue to green
<ChartCard
  color="rgb(75, 192, 75)" // Green
  // ...
/>
```

### Change Number of Chart Points

Edit `frontend/src/App.js`:
```javascript
const MAX_DATA_POINTS = 30; // Show last 30 points instead of 20
```

### Change Background Theme

Edit `frontend/src/App.css`:
```css
body {
  /* Change gradient colors */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

---

## Quick Reference

### Start Application (Development)
```bash
# Terminal 1 - Backend
cd predictive-maintenance/backend
node server.js

# Terminal 2 - Frontend
cd predictive-maintenance/frontend
npm start
```

### Start Application (Production)
```bash
# Build frontend first (one time)
cd predictive-maintenance/frontend
npm run build

# Run backend
cd ../backend
node server.js

# Open: http://localhost:5000
```

### Find Arduino Port
```bash
# Windows
mode

# macOS
ls /dev/cu.*

# Linux
ls /dev/tty* | grep -i usb
```

### Stop Servers
```
Ctrl+C in each terminal
```

---

## Additional Resources

### Documentation:
- [Node.js Docs](https://nodejs.org/docs/)
- [React Docs](https://react.dev/)
- [Socket.io Docs](https://socket.io/docs/)
- [Chart.js Docs](https://www.chartjs.org/docs/)
- [Arduino Reference](https://www.arduino.cc/reference/)

### Libraries:
- [SerialPort (Node.js)](https://serialport.io/docs/)
- [OneWire Library](https://www.pjrc.com/teensy/td_libs_OneWire.html)
- [DallasTemperature](https://github.com/milesburton/Arduino-Temperature-Control-Library)

### Hardware Datasheets:
- [DS18B20 Datasheet](https://datasheets.maximintegrated.com/en/ds/DS18B20.pdf)
- [Arduino Uno Pinout](https://docs.arduino.cc/hardware/uno-rev3)

---

## Support

If you encounter issues not covered here:

1. Check the main README.md
2. Review error messages carefully
3. Check browser console (F12)
4. Check backend terminal output
5. Verify all connections and configurations
6. Test in simulation mode first
7. Try restarting everything

---

## Next Steps

After successful installation:

1. **Calibrate Sensors:**
   - Compare temperature with known thermometer
   - Test sound sensor sensitivity

2. **Customize Thresholds:**
   - Set appropriate values for your use case

3. **Add Features:**
   - Data logging to CSV/database
   - Email/SMS alerts
   - Historical data analysis
   - Additional sensors

4. **Deploy:**
   - Set up on dedicated device (Raspberry Pi)
   - Run as system service
   - Access remotely

---

**Installation complete! Your Predictive Maintenance System is ready to use.**
