import React, { useEffect, useState } from 'react';
import './AlertPopup.css';

function AlertPopup({ message, currentValue, threshold, onClose, autoCloseDelay = 8000 }) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Speak the alert message using Text-to-Speech
    const speakAlert = () => {
      if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(
          `Warning! Alert! Sound level is ${currentValue} decibels, which exceeds the threshold of ${threshold} decibels. Immediate attention required!`
        );

        utterance.rate = 1.0; // Normal speed
        utterance.pitch = 1.2; // Slightly higher pitch for urgency
        utterance.volume = 1.0; // Maximum volume
        utterance.lang = 'en-US';

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
  }, [currentValue, threshold, autoCloseDelay, onClose]);

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

          <div className="alert-values">
            <div className="value-box current">
              <span className="value-label">Current Value</span>
              <span className="value-number">{currentValue}</span>
              <span className="value-unit">dB</span>
            </div>

            <div className="value-arrow">➜</div>

            <div className="value-box threshold">
              <span className="value-label">Threshold</span>
              <span className="value-number">{threshold}</span>
              <span className="value-unit">dB</span>
            </div>
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
