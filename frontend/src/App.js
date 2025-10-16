import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import SensorCard from './components/SensorCard';
import ChartCard from './components/ChartCard';
import Settings from './components/Settings';
import AlertPopup from './components/AlertPopup';
import './App.css';

const SOCKET_URL = 'http://localhost:5000';
const MAX_DATA_POINTS = 20;

function App() {
  const [sensorData, setSensorData] = useState({
    soundLevel: 0,
    soundAlert: false,
    timestamp: new Date().toISOString()
  });

  const [soundHistory, setSoundHistory] = useState([]);
  const [connected, setConnected] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [soundThreshold, setSoundThreshold] = useState(400);
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

      // Check if sound level exceeds threshold
      const soundAlert = data.soundLevel > soundThreshold;

      setSensorData({
        ...data,
        soundAlert: soundAlert
      });

      // Play alert sound and show popup when threshold is exceeded (only on new alert)
      if (soundAlert && !lastAlertState) {
        console.log('[ALERT] Sound threshold exceeded! Triggering alerts...');

        // Play beep sound
        alertSound.play().catch(err => {
          console.log('[ALERT] Audio play failed (user interaction may be required):', err.message);
        });

        // Show popup with voice alert
        setShowAlertPopup(true);

        // Show browser notification if permitted
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('⚠️ Sound Alert!', {
            body: `Sound level ${data.soundLevel} exceeded threshold ${soundThreshold}`,
            icon: '🔊'
          });
        }
      }

      setLastAlertState(soundAlert);

      // Update sound history
      setSoundHistory(prev => {
        const newHistory = [...prev, {
          time: new Date(data.timestamp).toLocaleTimeString(),
          value: data.soundLevel
        }];
        return newHistory.slice(-MAX_DATA_POINTS);
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [soundThreshold]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('[NOTIFICATIONS] Permission:', permission);
      });
    }
  }, []);

  const handleSaveSettings = (newThreshold) => {
    setSoundThreshold(newThreshold);
    console.log('[SETTINGS] New sound threshold:', newThreshold);
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

      {sensorData.soundAlert && (
        <div className="global-alert-banner">
          <div className="alert-content">
            <span className="alert-icon-large">🚨</span>
            <div className="alert-text">
              <strong>ALERT: Sound Threshold Exceeded!</strong>
              <p>Current: {sensorData.soundLevel} dB | Threshold: {soundThreshold} dB</p>
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
        </div>

        <div className="charts-row">
          <ChartCard
            title="Sound Level History"
            data={soundHistory}
            label="Sound Level"
            color="rgb(54, 162, 235)"
            threshold={soundThreshold}
          />
        </div>

        <footer className="footer">
          <p>Last updated: {new Date(sensorData.timestamp).toLocaleString()}</p>
        </footer>
      </div>

      {showSettings && (
        <Settings
          onClose={() => setShowSettings(false)}
          currentThreshold={soundThreshold}
          onSave={handleSaveSettings}
        />
      )}

      {showAlertPopup && (
        <AlertPopup
          message="Sound level has exceeded the configured threshold!"
          currentValue={sensorData.soundLevel}
          threshold={soundThreshold}
          onClose={() => setShowAlertPopup(false)}
          autoCloseDelay={8000}
        />
      )}
    </div>
  );
}

export default App;
