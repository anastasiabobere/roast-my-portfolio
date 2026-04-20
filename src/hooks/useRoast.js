import { useState } from 'react';
import { roastPortfolio } from '../lib/claude';

export function useRoast() {
  const [roast, setRoast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getRoast = async (portfolioText, roastLevel) => {
    if (!portfolioText.trim()) {
      setError('Paste something first. We can\'t roast thin air.');
      return;
    }

    setLoading(true);
    setError(null);
    setRoast(null);

    try {
      const result = await roastPortfolio(portfolioText, roastLevel);
      setRoast(result);
    } catch (err) {
      if (err.message.includes('401') || err.message.includes('invalid')) {
        setError('Invalid API key. Check your .env file.');
      } else if (err.message.includes('429')) {
        setError('Rate limited. Slow down, your portfolio will still be bad in a minute.');
      } else {
        setError(err.message || 'Something went wrong. Even the AI couldn\'t handle this portfolio.');
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setRoast(null);
    setError(null);
  };

  return { roast, loading, error, getRoast, reset };
}
