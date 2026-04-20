import React from 'react';
import { Header } from './components/Header';
import { RoastForm } from './components/RoastForm';
import { RoastResult } from './components/RoastResult';
import { ErrorMessage } from './components/ErrorMessage';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { useRoast } from './hooks/useRoast';
import './App.css';

function App() {
  const { roast, loading, error, getRoast, reset } = useRoast();

  return (
    <div className="app">
      <div className="bg-grid" />
      <div className="bg-glow" />

      <Header />

      <main className="main">
        {error && (
          <ErrorMessage message={error} onDismiss={reset} />
        )}

        {!roast && !loading && (
          <RoastForm onSubmit={getRoast} loading={loading} />
        )}

        {loading && <LoadingSkeleton />}

        {roast && !loading && (
          <RoastResult roast={roast} onReset={reset} />
        )}
      </main>

      <footer className="footer">
        <span>Built with React + Groq API</span>
        <span className="footer-dot">·</span>
        <span>No portfolios were spared</span>
      </footer>
    </div>
  );
}

export default App;
