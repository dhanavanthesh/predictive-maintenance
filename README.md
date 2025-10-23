# Predictive Maintenance System using Arduino and IoT

![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Arduino](https://img.shields.io/badge/Arduino-Uno-00979D.svg)

## 🎯 Abstract

Modern industries depend on machines running under tough conditions. This project presents a **simple and affordable predictive maintenance system** using Arduino and low-cost sensors to monitor equipment health in real-time and **predict failures BEFORE they happen**.

### Key Innovation
Instead of waiting for breakdowns (reactive) or servicing on fixed schedules (preventive), this system **continuously monitors machine health** and alerts when anomalies are detected, enabling **condition-based maintenance**.

### Sensors Used
- **SW-420** - Vibration detection
- **DS18B20** - Temperature monitoring  
- **LM393** - Sound level detection

### Alert System
- 🔊 Voice alerts (text-to-speech)
- 🚨 Visual popup notifications
- 📊 Real-time charts
- ⚙️ Configurable thresholds

```
                    Arduino Uno R3
                  ┌─────────────────┐
                  │                 │
    DS18B20       │  Digital Pin 8  │────── DATA (with 4.7kΩ to 5V)
    SW-420        │  Digital Pin 4  │────── D0 (Vibration)
                  │  5V             │────── VCC (all sensors)
                  │  GND            │────── GND (all sensors)
    Sound Sensor  │  Analog Pin A0  │────── A0
                  │                 │
                  └─────────────────┘
                          │
                          │ USB Cable
                          ↓
                      Computer
```

---

## 📋 Table of Contents
- [Problem Statement](#problem-statement)
- [How It Works - Predictive Maintenance](#how-it-works)
- [Hardware Components](#hardware-components)
- [Circuit Diagram](#circuit-diagram)
- [System Architecture](#system-architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Stakeholders](#stakeholders)
- [Future Enhancements](#future-enhancements)

---

## ⚠️ Problem Statement

**Small industries face frequent unexpected machine failures and high maintenance costs** because they:
- ❌ Rely on reactive maintenance (fix after breakdown)
- ❌ Use fixed-schedule preventive maintenance (waste resources)
- ❌ Lack affordable predictive monitoring systems

**This leads to:**
- Production downtime
- Wasted resources
- Safety risks
- Reduced productivity

---

## 🔮 How It Works - Predictive Maintenance

### What is Predictive Maintenance?
**Monitoring equipment continuously to PREDICT failures BEFORE they happen**

### Your System Does This:

1. **Sound Sensor (LM393)**
   - Normal motor: 20-200 dB (quiet hum)
   - **Alert at 400+ dB** = Abnormal noise
   - **Predicts:** Bearing failure, grinding, imbalance

2. **Temperature Sensor (DS18B20)**
   - Normal: 20-30°C
   - **Alert at 30°C+** = Overheating
   - **Predicts:** Motor burnout, electrical issues

3. **Vibration Sensor (SW-420)**
   - Normal: Steady operation
   - **Alert on vibration** = Excessive shaking
   - **Predicts:** Loose parts, misalignment, imbalance

### Comparison

| Method | When to Act | Cost | Downtime | Efficiency |
|--------|-------------|------|----------|------------|
| **Reactive** ❌ | After breakdown | High | Maximum | Poor |
| **Preventive** ⚠️ | Fixed schedule | Medium | Moderate | Wasteful |
| **PREDICTIVE** ✅ | When needed | Low | Minimum | Optimal |

---

## 🔧 Hardware Components

| Component | Model | Qty | Purpose | Price |
|-----------|-------|-----|---------|-------|
| Microcontroller | Arduino Uno R3 | 1 | Main processor | ₹500 |
| Temperature | DS18B20 | 1 | Monitor temp | ₹150 |
| Sound Sensor | LM393 | 1 | Detect noise | ₹80 |
| Vibration | SW-420 | 1 | Detect shaking | ₹100 |
| Resistor | 4.7kΩ | 1 | DS18B20 pullup | ₹5 |
| USB Cable | Type A-B | 1 | Serial comm | ₹100 |
| Breadboard | Full-size | 1 | Prototyping | ₹150 |
| Jumper Wires | M-M, M-F | 20+ | Connections | ₹50 |
| **TOTAL** | | | | **₹1,135** |

---

## 📐 Circuit Diagram

```
ARDUINO UNO R3                    SENSORS
┌───────────────────┐
│  DIGITAL PINS     │
│  ┌────┐           │
│  │ D4 │───────────┼─────────→ SW-420 DO (Vibration)
│  └────┘           │
│  ┌────┐           │         DS18B20 (Temperature)
│  │ D8 │───────────┼─────────→ Data Pin
│  └────┘           │             (+ 4.7kΩ to 5V)
│                   │
│  ANALOG PINS      │
│  ┌────┐           │
│  │ A0 │───────────┼─────────→ LM393 AO (Sound)
│  └────┘           │
│                   │
│  POWER            │
│  ┌────┐           │
│  │ 5V │───────────┼─────────→ All VCC pins
│  └────┘           │
│  ┌────┐           │
│  │GND │───────────┼─────────→ All GND pins
│  └────┘           │
└───────────────────┘
```

### Detailed Wiring

**DS18B20 (Temperature):**
```
Pin 1 (GND)  → Arduino GND
Pin 2 (Data) → Arduino D8 + 4.7kΩ resistor to 5V
Pin 3 (VCC)  → Arduino 5V
```

**LM393 (Sound):**
```
VCC → Arduino 5V
GND → Arduino GND
AO  → Arduino A0
DO  → Not connected
```

**SW-420 (Vibration) - 3 Pin Version:**
```
VCC/+ → Arduino 5V
GND/- → Arduino GND
D0    → Arduino D4 (outputs HIGH when vibration detected)
```

---

## 🏗️ System Architecture

```
┌──────────┐
│ SENSORS  │  SW-420, DS18B20, LM393
└─────┬────┘
      │ Read data
      ▼
┌──────────────┐
│ ARDUINO UNO  │  Process & format data
└──────┬───────┘
       │ USB Serial (9600 baud)
       ▼
┌─────────────────┐
│ NODE.JS BACKEND │  Parse data, detect anomalies
│  (Port 5000)    │  WebSocket broadcasting
└────────┬────────┘
         │ Socket.IO
         ▼
┌──────────────────┐
│ REACT FRONTEND   │  Display data, charts, alerts
│  (Port 3000)     │  Voice alerts, popups
└──────────────────┘
```

---

## 📦 Installation

### Step 1: Clone Repository
```bash
git clone <your-repo-url>
cd predictive-maintenance
```

### Step 2: Arduino Setup
1. Install Arduino IDE
2. Install libraries: `OneWire`, `DallasTemperature`
3. Wire sensors as per circuit diagram
4. Upload `ARDUINO_CODE/ARDUINO_CODE.ino`
5. Note your COM port (e.g., COM4)

### Step 3: Backend
```bash
cd backend
npm install
# Edit server.js line 26: const SERIAL_PORT = 'COM4';
node server.js
```

### Step 4: Frontend
```bash
cd frontend
npm install
npm start
```

Open: `http://localhost:3000`

---

## 🎮 Usage

1. **Access Dashboard**: Open browser to `localhost:3000`
2. **Configure Thresholds**: Click ⚙️ Settings
3. **Monitor Data**: View real-time charts
4. **Handle Alerts**: When threshold exceeded:
   - 🔊 Voice speaks warning
   - 🚨 Popup appears
   - 📢 Red banner shows
   - Click "Acknowledge" to dismiss

---

## ✨ Features

### Feature 1: Real-Time Monitoring
- Continuous sensor data streaming
- Live charts (last 20 readings)
- WebSocket for instant updates

### Feature 2: Multi-Channel Alerts
When anomalies detected:
- Voice alert (text-to-speech)
- Animated popup dialog
- Red banner notification
- Browser notification
- Card highlighting

### Feature 3: Configurable Thresholds
- Settings modal
- Slider + number input
- Sound level guide (0-1023)
- Save & apply instantly

---

## 👥 Stakeholders

**Industry Owners:**
- Reduced downtime & costs
- Better productivity
- Improved safety

**Students:**
- Hands-on IoT learning
- Full-stack skills
- Academic project

**Technicians:**
- Early warning system
- Clear actionable alerts
- Prevent emergencies

---

## 🚀 Future Enhancements

- [ ] Machine Learning for pattern recognition
- [ ] Database integration (MongoDB)
- [ ] Multi-machine fleet monitoring
- [ ] Mobile app (React Native)
- [ ] Cloud integration (AWS IoT)
- [ ] User authentication
- [ ] Historical analytics

---

## 📄 License
MIT License - See LICENSE file

---

## 🙏 Credits
Built with Arduino, Node.js, React, and Socket.IO

**Made with ❤️ for smarter industrial maintenance**
