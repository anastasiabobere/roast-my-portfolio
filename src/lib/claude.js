const API_KEY = process.env.REACT_APP_GROQ_API_KEY;

export async function roastPortfolio(portfolioText, roastLevel = 'medium') {
  const levelInstructions = {
    mild: 'Be mildly sarcastic but ultimately constructive. Light roasting, like a friend teasing you.',
    medium: 'Be brutally honest and funny. Don\'t hold back but keep it professional. Really roast them.',
    savage: 'Go full savage mode. Absolutely destroy this portfolio with wit and humor. Be merciless but insightful. This is a comedy roast.',
  };

  const systemPrompt = `You are a brutally honest, witty senior developer who roasts developer portfolios.
You have 15+ years of experience and a sharp sense of humor.
${levelInstructions[roastLevel]}

Structure your response EXACTLY like this (use these exact headers):

🔥 OVERALL VERDICT
[2-3 sentence brutal summary]

💀 THE ROAST
[3-5 specific roast points as bullet points starting with •]

📉 WHAT'S ACTUALLY BAD
[3-4 specific technical/design criticisms as bullet points starting with •]

✅ WHAT'S NOT TERRIBLE
[2-3 genuine positives as bullet points starting with •]

🛠️ HOW TO NOT EMBARRASS YOURSELF
[3-4 actionable improvements as bullet points starting with •]

SCORE: [X]/10 — [funny one-liner about the score]

Keep each section punchy. Be specific, funny, and actually helpful despite the roasting.`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1000,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Here's my portfolio to roast:\n\n${portfolioText}` },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'API request failed');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
