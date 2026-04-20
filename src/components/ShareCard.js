import React, { useRef } from 'react';
import './ShareCard.css';

export function ShareCard({ score, verdict }) {
  const cardRef = useRef(null);

  const handleCopy = () => {
    const text = `🔥 I got roasted by AI!\n\n${verdict}\n\n${score ? `Score: ${score}` : ''}\n\nGet roasted at: roast-my-portfolio.vercel.app`;
    navigator.clipboard.writeText(text);
  };

  if (!verdict) return null;

  return (
    <div className="share-section">
      <p className="share-label">SHARE YOUR SHAME</p>
      <div className="share-card" ref={cardRef}>
        <div className="share-card-header">
          <span className="share-card-logo">🔥 ROAST MY PORTFOLIO</span>
          <span className="share-card-badge">AI ROASTED</span>
        </div>
        <p className="share-card-verdict">{verdict}</p>
        {score && <p className="share-card-score">{score}</p>}
        <p className="share-card-url">roast-my-portfolio.vercel.app</p>
      </div>
      <div className="share-buttons">
        <button className="share-btn" onClick={handleCopy}>
          📋 Copy to Share
        </button>
        <a
          className="share-btn twitter"
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`🔥 My portfolio just got absolutely destroyed by AI\n\n${verdict?.slice(0, 100)}...\n\nGet roasted:`)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          𝕏 Share on X
        </a>
      </div>
    </div>
  );
}
