import React, { useState, useEffect } from 'react';
import './Settings.css';

function Settings({ onClose, currentThreshold, onSave }) {
  const [soundThreshold, setSoundThreshold] = useState(currentThreshold || 400);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(soundThreshold);
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

          <div className="info-box">
            <div className="info-icon">ℹ️</div>
            <div className="info-text">
              <strong>Sound Level Guide:</strong>
              <ul>
                <li>0-200: Very quiet (normal operation)</li>
                <li>200-400: Moderate noise</li>
                <li>400-600: Loud (potential issue)</li>
                <li>600+: Very loud (immediate attention needed)</li>
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
