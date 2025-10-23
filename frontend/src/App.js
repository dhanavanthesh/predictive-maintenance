import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import SensorCard from './components/SensorCard';
import ChartCard from './components/ChartCard';
import Settings from './components/Settings';
import AlertPopup from './components/AlertPopup';
import InfoPanel from './components/InfoPanel';
import './App.css';

const SOCKET_URL = 'http://localhost:5000';
const MAX_DATA_POINTS = 20;

function App() {
  const [sensorData, setSensorData] = useState({
    soundLevel: 0,
    temperature: 0,
    vibration: 0,
    soundAlert: false,
    tempAlert: false,
    vibrationAlert: false,
    timestamp: new Date().toISOString()
  });

  const [soundHistory, setSoundHistory] = useState([]);
  const [temperatureHistory, setTemperatureHistory] = useState([]);
  const [vibrationHistory, setVibrationHistory] = useState([]);
  const [connected, setConnected] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [soundThreshold, setSoundThreshold] = useState(400);
  const [tempThreshold, setTempThreshold] = useState(30);
  const [vibrationThreshold, setVibrationThreshold] = useState(1);
  const [lastAlertState, setLastAlertState] = useState(false);
  const [showAlertPopup, setShowAlertPopup] = useState(false);

  // Create audio element for alert sound
  const alertSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSl+zPLTgjMGHmW77OihUhELTKXh8bllHAU2jdXxz3wxBSh+zPLTgjMGHmW77OihUhELTKXh8bllHAU2jdXxz3wxBSh+zPLTgjMGHmW77OihUhELTKXh8bllHAU2jdXxz3wxBSh+zPLTgjMGHmW77OihUhELTKXh8bllHAU2jdXxz3wxBSh+zPLTgjMGHmW77OihUhELTKXh8bllHAU2jdXxz3wxBSh+zPLTgjMGHmW77OihUhELTKXh8bllHAU2jdXxz3wxBSh+zPLTgjMGHmW77OihUhELTKXh8bllHAU2jdXxz3wxBSh+zPLTgjMGHmW77OihUhELTKXh8bllHAU2jdXxz3wxBSh+zPLTgjMGHmW77OihUhELTKXh8bllHAU2jdXxz3wxBSh+zPLTgjMGHmW77OihUhELTKXh8bllHAU2jdXxz3wxBSh+zPLTgjMGHmW77OihUhELTKXh8bllHAU2jdXxz3w=');

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    socket.on('sensorData', (data) => {
      console.log('[FRONTEND] Received data:', data);

      // Check if thresholds are exceeded
      const soundAlert = data.soundLevel > soundThreshold;
      const tempAlert = data.temperature > tempThreshold;
      const vibrationAlert = data.vibration >= vibrationThreshold;
      const anyAlert = soundAlert || tempAlert || vibrationAlert;

      setSensorData({
        ...data,
        soundAlert: soundAlert,
        tempAlert: tempAlert,
        vibrationAlert: vibrationAlert
      });

      // Play alert sound and show popup when threshold is exceeded (only on new alert)
      if (anyAlert && !lastAlertState) {
        console.log('[ALERT] Threshold exceeded! Triggering alerts...');

        // Play beep sound
        alertSound.play().catch(err => {
          console.log('[ALERT] Audio play failed (user interaction may be required):', err.message);
        });

        // Show popup with voice alert
        setShowAlertPopup(true);

        // Show browser notification if permitted
        if ('Notification' in window && Notification.permission === 'granted') {
          let alertMessages = [];
          if (soundAlert) alertMessages.push(`Sound: ${data.soundLevel} (>${soundThreshold})`);
          if (tempAlert) alertMessages.push(`Temp: ${data.temperature}°C (>${tempThreshold}°C)`);
          if (vibrationAlert) alertMessages.push(`Vibration detected!`);

          const alertMessage = alertMessages.join(' | ');

          new Notification('⚠️ Sensor Alert!', {
            body: alertMessage,
            icon: '🔊'
          });
        }
      }

      setLastAlertState(anyAlert);

      // Update sound history
      setSoundHistory(prev => {
        const newHistory = [...prev, {
          time: new Date(data.timestamp).toLocaleTimeString(),
          value: data.soundLevel
        }];
        return newHistory.slice(-MAX_DATA_POINTS);
      });

      // Update temperature history
      setTemperatureHistory(prev => {
        const newHistory = [...prev, {
          time: new Date(data.timestamp).toLocaleTimeString(),
          value: data.temperature
        }];
        return newHistory.slice(-MAX_DATA_POINTS);
      });

      // Update vibration history
      setVibrationHistory(prev => {
        const newHistory = [...prev, {
          time: new Date(data.timestamp).toLocaleTimeString(),
          value: data.vibration
        }];
        return newHistory.slice(-MAX_DATA_POINTS);
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [soundThreshold, tempThreshold, vibrationThreshold]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('[NOTIFICATIONS] Permission:', permission);
      });
    }
  }, []);

  const handleSaveSettings = (newSoundThreshold, newTempThreshold, newVibrationThreshold) => {
    setSoundThreshold(newSoundThreshold);
    setTempThreshold(newTempThreshold);
    setVibrationThreshold(newVibrationThreshold);
    console.log('[SETTINGS] New sound threshold:', newSoundThreshold);
    console.log('[SETTINGS] New temperature threshold:', newTempThreshold);
    console.log('[SETTINGS] New vibration threshold:', newVibrationThreshold);
    // Reset alert state when threshold changes
    setLastAlertState(false);
  };

  return (
    <div className="App">
      <header className="header">
        <h1>Predictive Maintenance System</h1>
        <div className="header-right">
          <div className={`status ${connected ? 'connected' : 'disconnected'}`}>
            <span className="status-dot"></span>
            {connected ? 'Connected' : 'Disconnected'}
          </div>
          <button className="settings-btn" onClick={() => setShowSettings(true)}>
            ⚙️ Settings
          </button>
        </div>
      </header>

      <InfoPanel />

      {(sensorData.soundAlert || sensorData.tempAlert || sensorData.vibrationAlert) && (
        <div className="global-alert-banner">
          <div className="alert-content">
            <span className="alert-icon-large">🚨</span>
            <div className="alert-text">
              <strong>ALERT: Threshold Exceeded!</strong>
              <p>
                {sensorData.soundAlert && `Sound: ${sensorData.soundLevel} dB (>${soundThreshold} dB)`}
                {(sensorData.soundAlert && (sensorData.tempAlert || sensorData.vibrationAlert)) && ' | '}
                {sensorData.tempAlert && `Temperature: ${sensorData.temperature.toFixed(1)}°C (>${tempThreshold}°C)`}
                {(sensorData.tempAlert && sensorData.vibrationAlert) && ' | '}
                {sensorData.vibrationAlert && `Vibration Detected!`}
              </p>
            </div>
            <span className="alert-icon-large">🚨</span>
          </div>
        </div>
      )}

      <div className="container">
        <div className="cards-row">
          <SensorCard
            title="Sound Level"
            value={sensorData.soundLevel}
            unit=""
            alert={sensorData.soundAlert}
            alertMessage="Sound level exceeds threshold!"
            icon="🔊"
          />
          <SensorCard
            title="Temperature"
            value={sensorData.temperature.toFixed(1)}
            unit="°C"
            alert={sensorData.tempAlert}
            alertMessage="Temperature exceeds threshold!"
            icon="🌡️"
          />
          <SensorCard
            title="Vibration"
            value={sensorData.vibration === 1 ? "DETECTED" : "Normal"}
            unit=""
            alert={sensorData.vibrationAlert}
            alertMessage="Vibration detected!"
            icon="📳"
          />
        </div>

        <div className="charts-row">
          <ChartCard
            title="Sound Level History"
            data={soundHistory}
            label="Sound Level"
            color="rgb(54, 162, 235)"
            threshold={soundThreshold}
          />
          <ChartCard
            title="Temperature History"
            data={temperatureHistory}
            label="Temperature (°C)"
            color="rgb(255, 99, 132)"
            threshold={tempThreshold}
          />
          <ChartCard
            title="Vibration History"
            data={vibrationHistory}
            label="Vibration"
            color="rgb(75, 192, 192)"
            threshold={vibrationThreshold}
          />
        </div>

        <footer className="footer">
          <p>Last updated: {new Date(sensorData.timestamp).toLocaleString()}</p>
        </footer>
      </div>

      {showSettings && (
        <Settings
          onClose={() => setShowSettings(false)}
          currentSoundThreshold={soundThreshold}
          currentTempThreshold={tempThreshold}
          currentVibrationThreshold={vibrationThreshold}
          onSave={handleSaveSettings}
        />
      )}

      {showAlertPopup && (
        <AlertPopup
          message={
            [sensorData.soundAlert, sensorData.tempAlert, sensorData.vibrationAlert].filter(Boolean).length > 1
              ? "Multiple sensor thresholds exceeded!"
              : sensorData.soundAlert
              ? "Sound level has exceeded the configured threshold!"
              : sensorData.tempAlert
              ? "Temperature has exceeded the configured threshold!"
              : "Vibration has been detected!"
          }
          soundValue={sensorData.soundLevel}
          tempValue={sensorData.temperature}
          vibrationValue={sensorData.vibration}
          soundThreshold={soundThreshold}
          tempThreshold={tempThreshold}
          vibrationThreshold={vibrationThreshold}
          soundAlert={sensorData.soundAlert}
          tempAlert={sensorData.tempAlert}
          vibrationAlert={sensorData.vibrationAlert}
          onClose={() => setShowAlertPopup(false)}
          autoCloseDelay={8000}
        />
      )}
    </div>
  );
}

export default App;
