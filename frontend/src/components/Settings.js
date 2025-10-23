import React, { useState, useEffect } from 'react';
import './Settings.css';

function Settings({ onClose, currentSoundThreshold, currentTempThreshold, currentVibrationThreshold, onSave }) {
  const [soundThreshold, setSoundThreshold] = useState(currentSoundThreshold || 400);
  const [tempThreshold, setTempThreshold] = useState(currentTempThreshold || 30);
  const [vibrationThreshold, setVibrationThreshold] = useState(currentVibrationThreshold || 1);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(soundThreshold, tempThreshold, vibrationThreshold);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        <div className="settings-header">
          <h2>System Settings</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="settings-content">
          <div className="setting-section">
            <div className="section-header">
              <span className="section-icon">🔊</span>
              <h3>Sound Alert Threshold</h3>
            </div>

            <div className="threshold-control">
              <label htmlFor="sound-threshold">
                Alert when sound level exceeds:
              </label>
              <div className="input-group">
                <input
                  id="sound-threshold"
                  type="number"
                  min="0"
                  max="1023"
                  value={soundThreshold}
                  onChange={(e) => setSoundThreshold(Number(e.target.value))}
                  className="threshold-input"
                />
                <span className="input-unit">dB</span>
              </div>

              <input
                type="range"
                min="0"
                max="1023"
                value={soundThreshold}
                onChange={(e) => setSoundThreshold(Number(e.target.value))}
                className="threshold-slider"
              />

              <div className="threshold-info">
                <span className="info-label">Current value:</span>
                <span className="info-value">{soundThreshold} dB</span>
              </div>
            </div>
          </div>

          <div className="setting-section">
            <div className="section-header">
              <span className="section-icon">🌡️</span>
              <h3>Temperature Alert Threshold</h3>
            </div>

            <div className="threshold-control">
              <label htmlFor="temp-threshold">
                Alert when temperature exceeds:
              </label>
              <div className="input-group">
                <input
                  id="temp-threshold"
                  type="number"
                  min="0"
                  max="100"
                  value={tempThreshold}
                  onChange={(e) => setTempThreshold(Number(e.target.value))}
                  className="threshold-input"
                />
                <span className="input-unit">°C</span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={tempThreshold}
                onChange={(e) => setTempThreshold(Number(e.target.value))}
                className="threshold-slider"
              />

              <div className="threshold-info">
                <span className="info-label">Current value:</span>
                <span className="info-value">{tempThreshold}°C</span>
              </div>
            </div>
          </div>

          <div className="setting-section">
            <div className="section-header">
              <span className="section-icon">📳</span>
              <h3>Vibration Alert Threshold</h3>
            </div>

            <div className="threshold-control">
              <label htmlFor="vibration-threshold">
                Alert when vibration detected:
              </label>
              <div className="input-group">
                <select
                  id="vibration-threshold"
                  value={vibrationThreshold}
                  onChange={(e) => setVibrationThreshold(Number(e.target.value))}
                  className="threshold-input"
                >
                  <option value={0}>Disabled (Off)</option>
                  <option value={1}>Enabled (On)</option>
                </select>
              </div>

              <div className="threshold-info">
                <span className="info-label">Current setting:</span>
                <span className="info-value">{vibrationThreshold === 1 ? "Enabled" : "Disabled"}</span>
              </div>
            </div>
          </div>

          <div className="info-box">
            <div className="info-icon">ℹ️</div>
            <div className="info-text">
              <strong>Sensor Guides:</strong>
              <ul>
                <li><strong>Sound:</strong> 0-200: Very quiet | 200-400: Moderate | 400-600: Loud | 600+: Very loud</li>
                <li><strong>Temperature:</strong> 0-25°C: Normal | 25-35°C: Warm | 35-50°C: Hot | 50+°C: Critical</li>
                <li><strong>Vibration:</strong> 0: No vibration | 1: Vibration detected (Enable alerts to monitor)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave}>
            {saved ? '✓ Saved!' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
