import React, { useState, useEffect } from 'react';
import './LoadingSkeleton.css';

const LOADING_LINES = [
  'Reading your portfolio...',
  'Cringing internally...',
  'Consulting the senior devs...',
  'Finding the right words...',
  'Almost ready to destroy you...',
];

export function LoadingSkeleton() {
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLineIndex(i => (i + 1) % LOADING_LINES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="skeleton-container">
      <div className="skeleton-status">
        <span className="skeleton-dot" />
        <span className="skeleton-line-text">{LOADING_LINES[lineIndex]}</span>
      </div>

      <div className="skeleton-blocks">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton-block" style={{ animationDelay: `${i * 0.15}s` }}>
            <div className="skeleton-block-header">
              <div className="skeleton-bar short" />
            </div>
            <div className="skeleton-block-body">
              <div className="skeleton-bar" style={{ width: '95%' }} />
              <div className="skeleton-bar" style={{ width: '80%' }} />
              <div className="skeleton-bar" style={{ width: '88%' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
