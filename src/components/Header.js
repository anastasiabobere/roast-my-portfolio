import React from 'react';
import './Header.css';

export function Header() {
  return (
    <header className="header">
      <div className="header-badge">AI-POWERED HUMILIATION</div>
      <h1 className="header-title">
        <span className="title-roast">ROAST</span>
        <span className="title-divider"> MY </span>
        <span className="title-portfolio">PORTFOLIO</span>
      </h1>
      <p className="header-sub">
        Paste your portfolio. Get destroyed. Grow from it.
      </p>
      <div className="header-stats">
        <span>🔥 Brutally honest</span>
        <span>💀 Zero mercy</span>
        <span>✅ Actually helpful</span>
      </div>
    </header>
  );
}
