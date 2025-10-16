import React from 'react';
import './SensorCard.css';

function SensorCard({ title, value, unit, alert, alertMessage, icon }) {
  return (
    <div className={`sensor-card ${alert ? 'alert' : ''}`}>
      <div className="sensor-card-header">
        <span className="sensor-icon">{icon}</span>
        <h3>{title}</h3>
      </div>

      <div className="sensor-value">
        <span className="value">{value}</span>
        <span className="unit">{unit}</span>
      </div>

      {alert && (
        <div className="alert-banner">
          <span className="alert-icon">⚠️</span>
          {alertMessage}
        </div>
      )}
    </div>
  );
}

export default SensorCard;
