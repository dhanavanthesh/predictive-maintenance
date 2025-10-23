const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Serve React app in production
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Configuration
const PORT = 5000;
const SERIAL_PORT = 'COM4'; // Change this to your Arduino port (COM3, COM4, etc. on Windows)
const BAUD_RATE = 9600;

// Thresholds for alerts
const SOUND_THRESHOLD = 400;
const TEMP_THRESHOLD = 30; // Temperature threshold in Celsius
const VIBRATION_THRESHOLD = 1; // Vibration detected (1 = vibration, 0 = no vibration)

// Store latest data
let latestData = {
  soundLevel: 0,
  temperature: 0,
  vibration: 0,
  timestamp: new Date().toISOString()
};

// Initialize Serial Port
let serialPort;
let parser;

function initSerialPort() {
  try {
    serialPort = new SerialPort({
      path: SERIAL_PORT,
      baudRate: BAUD_RATE,
      autoOpen: false
    });

    parser = serialPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));

    serialPort.open((err) => {
      if (err) {
        console.error('Error opening serial port:', err.message);
        console.log('Please check:');
        console.log('1. Arduino is connected via USB');
        console.log('2. Correct COM port is set (current: ' + SERIAL_PORT + ')');
        console.log('3. No other program is using the serial port');
        console.log('\nServer will continue running without serial connection.\n');
      } else {
        console.log('Serial port opened successfully on ' + SERIAL_PORT);
      }
    });

    // Read data from Arduino
    parser.on('data', (line) => {
      try {
        const trimmedLine = line.trim();

        // Skip header line or empty lines
        if (trimmedLine.includes('soundLevel') || trimmedLine.includes('temperature') || trimmedLine.includes('vibration') || trimmedLine === '') {
          return;
        }

        // Parse CSV format: soundLevel,temperature,vibration
        const values = trimmedLine.split(',');
        const soundLevel = parseFloat(values[0]);
        const temperature = parseFloat(values[1]);
        const vibration = parseInt(values[2]);

        if (!isNaN(soundLevel) && !isNaN(temperature) && !isNaN(vibration)) {
          latestData = {
            soundLevel: soundLevel,
            temperature: temperature,
            vibration: vibration,
            timestamp: new Date().toISOString(),
            soundAlert: soundLevel > SOUND_THRESHOLD,
            tempAlert: temperature > TEMP_THRESHOLD,
            vibrationAlert: vibration >= VIBRATION_THRESHOLD
          };

          console.log(`[ARDUINO DATA] Sound Level: ${soundLevel}, Temperature: ${temperature}°C, Vibration: ${vibration}`);

          // Emit to all connected clients
          io.emit('sensorData', latestData);
        } else {
          console.log(`[PARSE ERROR] Invalid data received: "${trimmedLine}"`);
        }
      } catch (error) {
        console.error('Error parsing data:', error.message);
      }
    });

    serialPort.on('error', (err) => {
      console.error('Serial port error:', err.message);
    });

  } catch (error) {
    console.error('Failed to initialize serial port:', error.message);
  }
}

// Socket.io connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send latest data immediately on connection
  socket.emit('sensorData', latestData);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// API endpoint to get latest data
app.get('/api/data', (req, res) => {
  res.json(latestData);
});

// API endpoint to get thresholds
app.get('/api/thresholds', (req, res) => {
  res.json({
    sound: SOUND_THRESHOLD,
    temperature: TEMP_THRESHOLD,
    vibration: VIBRATION_THRESHOLD
  });
});

// Serve React app for any other route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// Start server
server.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`========================================\n`);

  // Try to connect to Arduino
  initSerialPort();
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nClosing serial port...');
  if (serialPort && serialPort.isOpen) {
    serialPort.close(() => {
      console.log('Serial port closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});
