import React, { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import './RoastForm.css';

// Use local worker to avoid CDN issues
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const LEVELS = [
  { id: 'mild', emoji: '😏', label: 'Mild', desc: 'Friendly nudge' },
  { id: 'medium', emoji: '🔥', label: 'Medium', desc: 'Brutally honest' },
  { id: 'savage', emoji: '💀', label: 'Savage', desc: 'No survivors' },
];

const PLACEHOLDER = `Paste anything here:
• Your portfolio URL description
• Your About Me / bio section  
• Your skills and projects list
• Or just copy-paste your entire README

The more you give us, the more we have to work with. 😈`;

export function RoastForm({ onSubmit, loading }) {
  const [text, setText] = useState('');
  const [level, setLevel] = useState('medium');
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfParsing, setPdfParsing] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const [inputMode, setInputMode] = useState('text'); // 'text' | 'pdf'
  const fileInputRef = useRef(null);

  const handleSubmit = () => {
    onSubmit(text, level);
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setPdfError('Only PDF files are supported.');
      return;
    }

    setPdfFile(file);
    setPdfParsing(true);
    setPdfError(null);
    setText('');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
      }

      if (fullText.trim().length < 20) {
        setPdfError('Couldn\'t extract text from this PDF. Try a text-based PDF or paste manually.');
        setPdfFile(null);
      } else {
        setText(fullText.trim());
      }
    } catch (err) {
      setPdfError('Failed to read PDF. Try pasting the content manually instead.');
      setPdfFile(null);
    } finally {
      setPdfParsing(false);
    }
  };

  const removePdf = () => {
    setPdfFile(null);
    setText('');
    setPdfError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const charCount = text.length;
  const isReady = charCount > 20 && !pdfParsing;

  return (
    <div className="form-container">
      <div className="level-selector">
        <span className="level-label">ROAST INTENSITY</span>
        <div className="level-buttons">
          {LEVELS.map(l => (
            <button
              key={l.id}
              className={`level-btn ${level === l.id ? 'active' : ''}`}
              onClick={() => setLevel(l.id)}
            >
              <span className="level-emoji">{l.emoji}</span>
              <span className="level-name">{l.label}</span>
              <span className="level-desc">{l.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input mode toggle */}
      <div className="input-mode-toggle">
        <button
          className={`mode-btn ${inputMode === 'text' ? 'active' : ''}`}
          onClick={() => { setInputMode('text'); removePdf(); }}
        >
          ✏️ Paste Text
        </button>
        <button
          className={`mode-btn ${inputMode === 'pdf' ? 'active' : ''}`}
          onClick={() => setInputMode('pdf')}
        >
          📄 Upload PDF
        </button>
      </div>

      {inputMode === 'text' && (
        <div className="textarea-wrapper">
          <textarea
            className="portfolio-input"
            placeholder={PLACEHOLDER}
            value={text}
            onChange={e => setText(e.target.value)}
            rows={10}
          />
          <div className="textarea-footer">
            <span className={`char-count ${charCount > 3000 ? 'warn' : ''}`}>
              {charCount} chars
            </span>
            {charCount > 3000 && (
              <span className="char-warn">Getting long — trim if needed</span>
            )}
          </div>
        </div>
      )}

      {inputMode === 'pdf' && (
        <div className="pdf-zone">
          {!pdfFile && !pdfParsing && (
            <div
              className="pdf-dropzone"
              onClick={() => fileInputRef.current?.click()}
            >
              <span className="pdf-icon">📄</span>
              <span className="pdf-drop-text">Click to upload your CV or portfolio PDF</span>
              <span className="pdf-drop-sub">Text-based PDFs only · Max ~10 pages</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handlePdfUpload}
                style={{ display: 'none' }}
              />
            </div>
          )}

          {pdfParsing && (
            <div className="pdf-parsing">
              <span className="btn-spinner" />
              <span>Reading your PDF...</span>
            </div>
          )}

          {pdfFile && !pdfParsing && text && (
            <div className="pdf-success">
              <div className="pdf-success-info">
                <span className="pdf-success-icon">✅</span>
                <div>
                  <p className="pdf-filename">{pdfFile.name}</p>
                  <p className="pdf-chars">{charCount} characters extracted</p>
                </div>
              </div>
              <button className="pdf-remove" onClick={removePdf}>✕ Remove</button>
            </div>
          )}

          {pdfError && (
            <div className="pdf-error">
              <span>⚠️ {pdfError}</span>
              <button onClick={() => { setPdfError(null); fileInputRef.current?.click(); }}>
                Try again
              </button>
            </div>
          )}
        </div>
      )}

      <button
        className={`roast-btn ${loading ? 'loading' : ''} ${!isReady ? 'disabled' : ''}`}
        onClick={handleSubmit}
        disabled={loading || !isReady}
      >
        {loading ? (
          <>
            <span className="btn-spinner" />
            GETTING ROASTED...
          </>
        ) : (
          <>🔥 ROAST ME</>
        )}
      </button>

      {!isReady && (text.length > 0 || pdfFile) && !pdfParsing && (
        <p className="form-hint">Give us a bit more to work with...</p>
      )}
    </div>
  );
}
