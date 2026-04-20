import React from 'react';
import './ErrorMessage.css';

export function ErrorMessage({ message, onDismiss }) {
  return (
    <div className="error-box">
      <span className="error-icon">⚠️</span>
      <span className="error-text">{message}</span>
      <button className="error-dismiss" onClick={onDismiss}>✕</button>
    </div>
  );
}
