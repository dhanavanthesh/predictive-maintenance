import React, { useEffect, useState } from 'react';
import './AlertPopup.css';

function AlertPopup({ message, soundValue, tempValue, vibrationValue, soundThreshold, tempThreshold, vibrationThreshold, soundAlert, tempAlert, vibrationAlert, onClose, autoCloseDelay = 8000 }) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Speak the alert message using Text-to-Speech
    const speakAlert = () => {
      if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        // Build clear, professional alert message
        let alertMessage = 'Alert! Predictive Maintenance System Warning. ';
        const alerts = [];

        if (soundAlert) {
          alerts.push(`Abnormal sound detected at ${soundValue} decibels`);
        }
        if (tempAlert) {
          alerts.push(`High temperature detected at ${tempValue.toFixed(1)} degrees celsius`);
        }
        if (vibrationAlert) {
          alerts.push('Excessive vibration detected');
        }

        alertMessage += alerts.join(', ') + '. Please inspect the equipment immediately.';

        const utterance = new SpeechSynthesisUtterance(alertMessage);

        // Improved voice settings for clarity
        utterance.rate = 0.9; // Slightly slower for clarity
        utterance.pitch = 1.1; // Professional tone
        utterance.volume = 1.0; // Maximum volume
        utterance.lang = 'en-US';

        // Wait for voices to load and select best voice
        const setVoice = () => {
          const voices = window.speechSynthesis.getVoices();
          // Try to find a clear English voice
          const preferredVoice = voices.find(voice =>
            voice.lang.startsWith('en') && (voice.name.includes('Google') || voice.name.includes('Microsoft'))
          ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];

          if (preferredVoice) {
            utterance.voice = preferredVoice;
          }
        };

        if (window.speechSynthesis.getVoices().length > 0) {
          setVoice();
        } else {
          window.speechSynthesis.onvoiceschanged = setVoice;
        }

        console.log('[VOICE ALERT] Speaking alert message...');
        window.speechSynthesis.speak(utterance);
      }
    };

    speakAlert();

    // Progress bar animation
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - (100 / (autoCloseDelay / 100));
        if (newProgress <= 0) {
          clearInterval(interval);
          onClose();
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => {
      clearInterval(interval);
      // Stop speech when component unmounts
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [soundValue, tempValue, vibrationValue, soundThreshold, tempThreshold, vibrationThreshold, soundAlert, tempAlert, vibrationAlert, autoCloseDelay, onClose]);

  return (
    <div className="alert-popup-overlay">
      <div className="alert-popup">
        <div className="alert-popup-header">
          <div className="alert-icon-animated">🚨</div>
          <h2>SYSTEM ALERT</h2>
          <button className="close-popup-btn" onClick={onClose}>×</button>
        </div>

        <div className="alert-popup-body">
          <div className="alert-message">
            <span className="speaker-icon">🔊</span>
            <p className="message-text">{message}</p>
          </div>

          <div className="alert-values-grid">
            {soundAlert && (
              <div className="sensor-alert-box">
                <div className="sensor-icon">🔊</div>
                <div className="sensor-info">
                  <div className="sensor-name">Sound Level</div>
                  <div className="sensor-values">
                    <span className="current-value">{soundValue}</span>
                    <span className="separator">/</span>
                    <span className="threshold-value">{soundThreshold}</span>
                    <span className="unit">dB</span>
                  </div>
                  <div className="status-badge exceeded">Exceeded!</div>
                </div>
              </div>
            )}

            {tempAlert && (
              <div className="sensor-alert-box">
                <div className="sensor-icon">🌡️</div>
                <div className="sensor-info">
                  <div className="sensor-name">Temperature</div>
                  <div className="sensor-values">
                    <span className="current-value">{tempValue.toFixed(1)}</span>
                    <span className="separator">/</span>
                    <span className="threshold-value">{tempThreshold}</span>
                    <span className="unit">°C</span>
                  </div>
                  <div className="status-badge exceeded">Exceeded!</div>
                </div>
              </div>
            )}

            {vibrationAlert && (
              <div className="sensor-alert-box">
                <div className="sensor-icon">📳</div>
                <div className="sensor-info">
                  <div className="sensor-name">Vibration</div>
                  <div className="sensor-values">
                    <span className="current-value">DETECTED</span>
                  </div>
                  <div className="status-badge detected">Active!</div>
                </div>
              </div>
            )}
          </div>

          <div className="alert-actions">
            <div className="action-item">
              <span className="action-icon">👁️</span>
              <span>Check equipment immediately</span>
            </div>
            <div className="action-item">
              <span className="action-icon">🔧</span>
              <span>Inspect for anomalies</span>
            </div>
            <div className="action-item">
              <span className="action-icon">📝</span>
              <span>Log this incident</span>
            </div>
          </div>
        </div>

        <div className="alert-popup-footer">
          <div className="auto-close-info">
            <span>Auto-closing in...</span>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <button className="acknowledge-btn" onClick={onClose}>
            ✓ Acknowledge Alert
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlertPopup;
