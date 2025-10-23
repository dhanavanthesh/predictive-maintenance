import React, { useState } from 'react';
import './InfoPanel.css';

function InfoPanel() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="info-panel-container">
      <div className="info-panel-wrapper">
        <button
          className="info-toggle-simple"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label="Toggle information panel"
        >
          <span className="info-icon-simple">ℹ️</span>
          <span className="info-text-simple">What is Predictive Maintenance?</span>
          <span className={`arrow-simple ${isExpanded ? 'rotated' : ''}`}>▼</span>
        </button>

        {isExpanded && (
          <div className="info-box">
            <div className="info-main-content">
              <h3>About This System</h3>
              <p className="info-description">
                <strong>Predictive Maintenance</strong> monitors equipment in real-time to predict failures
                <strong> BEFORE they happen</strong>. This system uses low-cost IoT sensors (Arduino + Sensors under ₹1,200)
                to continuously track machine health and alert when anomalies are detected.
              </p>

              <div className="sensors-simple">
                <div className="sensor-item">
                  <span className="sensor-icon-simple">🔊</span>
                  <div>
                    <strong>Sound Sensor</strong>
                    <p>Detects abnormal noise (bearing failure, grinding)</p>
                  </div>
                </div>
                <div className="sensor-item">
                  <span className="sensor-icon-simple">🌡️</span>
                  <div>
                    <strong>Temperature Sensor</strong>
                    <p>Monitors heat (motor burnout, overheating)</p>
                  </div>
                </div>
                <div className="sensor-item">
                  <span className="sensor-icon-simple">📳</span>
                  <div>
                    <strong>Vibration Sensor</strong>
                    <p>Identifies shaking (loose parts, misalignment)</p>
                  </div>
                </div>
              </div>

              <div className="benefits-simple">
                <h4>Benefits:</h4>
                <ul>
                  <li>✓ Reduce downtime and prevent breakdowns</li>
                  <li>✓ Lower maintenance costs</li>
                  <li>✓ Improve equipment efficiency</li>
                  <li>✓ Enhance worker safety</li>
                </ul>
              </div>

              <div className="tech-simple">
                <strong>Technology:</strong> Arduino Uno • Node.js • React • Socket.IO • Chart.js
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InfoPanel;
