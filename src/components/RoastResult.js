import React, { useEffect, useRef } from 'react';
import { ShareCard } from './ShareCard';
import './RoastResult.css';

function parseRoast(text) {
  const sections = [];
  const sectionRegex = /(🔥|💀|📉|✅|🛠️)[^\n]*/g;
  const parts = text.split(/((?:🔥|💀|📉|✅|🛠️)[^\n]*\n)/);

  let current = null;
  for (const part of parts) {
    const headerMatch = part.match(/^(🔥|💀|📉|✅|🛠️)\s*(.*)/);
    if (headerMatch) {
      if (current) sections.push(current);
      current = { emoji: headerMatch[1], title: headerMatch[2].trim(), content: '' };
    } else if (current) {
      current.content += part;
    }
  }
  if (current) sections.push(current);

  // Extract score
  const scoreMatch = text.match(/SCORE:\s*([^\n]+)/);
  const score = scoreMatch ? scoreMatch[1].trim() : null;

  return { sections, score };
}

export function RoastResult({ roast, onReset }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [roast]);

  const { sections, score } = parseRoast(roast);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roast);
  };

  return (
    <div className="result-container" ref={ref}>
      <div className="result-header">
        <span className="result-badge">ROAST COMPLETE</span>
        <div className="result-actions">
          <button className="action-btn" onClick={copyToClipboard}>Copy</button>
          <button className="action-btn primary" onClick={onReset}>Roast Again</button>
        </div>
      </div>

      {score && (
        <div className="score-banner">
          <span className="score-label">FINAL SCORE</span>
          <span className="score-value">{score}</span>
        </div>
      )}

      <div className="sections">
        {sections.map((section, i) => (
          <div
            key={i}
            className="section"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="section-header">
              <span className="section-emoji">{section.emoji}</span>
              <span className="section-title">{section.title}</span>
            </div>
            <div className="section-content">
              {section.content.trim().split('\n').filter(Boolean).map((line, j) => (
                <p key={j} className={line.startsWith('•') ? 'bullet' : 'text'}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {sections.length === 0 && (
        <div className="raw-result">
          <pre>{roast}</pre>
        </div>
      )}

      <ShareCard
        score={score}
        verdict={sections.find(s => s.emoji === '🔥')?.content?.trim().slice(0, 200)}
      />

      <div className="result-footer">
        <button className="reset-btn" onClick={onReset}>
          🔄 Try Another Portfolio
        </button>
      </div>
    </div>
  );
}
