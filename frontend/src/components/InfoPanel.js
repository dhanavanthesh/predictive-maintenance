import React, { useState } from 'react';
import './InfoPanel.css';

function InfoPanel() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`info-panel ${isExpanded ? 'expanded' : ''}`}>
      <button
        className="info-toggle-btn"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label="Toggle information panel"
      >
        <span className="info-icon">ℹ️</span>
        <span className="info-text">About Predictive Maintenance</span>
        <span className={`arrow ${isExpanded ? 'up' : 'down'}`}>▼</span>
      </button>

      {isExpanded && (
        <div className="info-content">
          <div className="info-grid">
            <div className="info-section">
              <div className="section-title">
                <span className="title-icon">🎯</span>
                <h3>What is Predictive Maintenance?</h3>
              </div>
              <p>
                Predictive Maintenance is a proactive maintenance strategy that monitors equipment
                in real-time to predict failures <strong>BEFORE they occur</strong>. Unlike reactive
                maintenance (fixing after breakdown) or preventive maintenance (fixed schedules),
                this system uses sensor data to detect early warning signs of equipment degradation.
              </p>
            </div>

            <div className="info-section">
              <div className="section-title">
                <span className="title-icon">🔧</span>
                <h3>How Does This System Work?</h3>
              </div>
              <p>
                Our IoT-based system continuously monitors three critical parameters using Arduino
                and low-cost sensors:
              </p>
              <ul>
                <li><strong>🔊 Sound Level (LM393):</strong> Detects abnormal noise indicating bearing failure, grinding, or mechanical imbalance</li>
                <li><strong>🌡️ Temperature (DS18B20):</strong> Monitors heat levels to prevent motor burnout and electrical failures</li>
                <li><strong>📳 Vibration (SW-420):</strong> Identifies excessive shaking caused by loose parts, misalignment, or structural issues</li>
              </ul>
            </div>

            <div className="info-section">
              <div className="section-title">
                <span className="title-icon">💡</span>
                <h3>Why Predictive Maintenance?</h3>
              </div>
              <div className="benefits-grid">
                <div className="benefit-card">
                  <span className="benefit-icon">📉</span>
                  <strong>Reduce Downtime</strong>
                  <p>Prevent unexpected breakdowns</p>
                </div>
                <div className="benefit-card">
                  <span className="benefit-icon">💰</span>
                  <strong>Lower Costs</strong>
                  <p>Avoid expensive emergency repairs</p>
                </div>
                <div className="benefit-card">
                  <span className="benefit-icon">⚡</span>
                  <strong>Improve Efficiency</strong>
                  <p>Maintain only when needed</p>
                </div>
                <div className="benefit-card">
                  <span className="benefit-icon">🛡️</span>
                  <strong>Enhance Safety</strong>
                  <p>Early warnings prevent accidents</p>
                </div>
              </div>
            </div>

            <div className="info-section highlight">
              <div className="section-title">
                <span className="title-icon">🎓</span>
                <h3>Project Objective</h3>
              </div>
              <p>
                This system demonstrates an <strong>affordable, accessible IoT solution</strong> for
                small-to-medium industries that cannot afford expensive industrial monitoring systems.
                Using Arduino Uno and sensors costing under ₹1,200, we provide real-time monitoring,
                instant alerts (voice, visual, browser notifications), and historical data visualization
                to enable condition-based maintenance decisions.
              </p>
              <div className="tech-stack">
                <span className="tech-badge">Arduino Uno</span>
                <span className="tech-badge">Node.js + Express</span>
                <span className="tech-badge">React.js</span>
                <span className="tech-badge">Socket.IO</span>
                <span className="tech-badge">Chart.js</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InfoPanel;
