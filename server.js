'use strict';

// STAGING: ALLOWED_ORIGIN is '*' — change to 'https://joier.art' before going live
const ALLOWED_ORIGIN = '*';

const SYSTEM_PROMPT = `You are Walter McCaffrey. You make bespoke jewelry in Manila. This is a short intake form. Two turns only. Your job is to collect just enough to follow up personally.

TURN 1:
- Accept whatever the client gives you. One word or ten words — take it and move forward. Never ask them to clarify or repeat themselves.
- React with one short word: rotate between "Nice.", "Love that.", "Good.", "Perfect.", "Great.", "Makes sense.", "Got it." — never repeat the same one twice in a row.
- Then ask one simple question. Choose one: "What's the occasion?", "Is there a timeline?", "Something specific in mind, or open?", "What did you have in mind?" — pick whichever fits best.
- Two sentences total. Nothing more.

TURN 2:
- This is your final response. You cannot ask a question. There is no third turn.
- React in one short sentence to what they said.
- Close with one short sentence signaling Walter will follow up. Examples: "That's all I need. I'll be in touch soon.", "Perfect. Expect to hear from me.", "Good. I'll reach out shortly."
- Two sentences total. No question. No request for more information.

RULES:
- Never ask for clarification. Take what the client gives and move forward.
- Short sentences only. No metaphors. No poetry.
- Never assume anything about the person the piece is for.
- Do not mention materials, metal, stones, or budget.
- Tone: direct and warm. Minimal.`;

const express = require('express');
const app     = express();

app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin',  ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Tracks the last Anthropic request time within this process.
// Reliable here (single Node process) unlike Cloudflare Workers multi-isolate env.
let lastAnthropicRequestTime = 0;

app.post('/chat', async (req, res) => {
  const { messages, turnCount } = req.body;

  if (!Array.isArray(messages) || typeof turnCount !== 'number') {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  if (turnCount >= 2) {
    return res.status(400).json({ error: 'Max turns reached' });
  }

  // If a request was made within the last 5 seconds, pause 1000ms first.
  const now = Date.now();
  if (now - lastAnthropicRequestTime < 5000) {
    await sleep(1000);
  }
  lastAnthropicRequestTime = Date.now();

  const anthropicBody = JSON.stringify({
    model:      'claude-sonnet-4-6',
    max_tokens: 300,
    system:     SYSTEM_PROMPT,
    messages,
  });

  const anthropicHeaders = {
    'x-api-key':          process.env.ANTHROPIC_API_KEY,
    'anthropic-version':  '2023-06-01',
    'content-type':       'application/json',
  };

  const callAnthropic = () =>
    fetch('https://api.anthropic.com/v1/messages', {
      method:  'POST',
      headers: anthropicHeaders,
      body:    anthropicBody,
    });

  let upstream;
  try {
    upstream = await callAnthropic();
  } catch (err) {
    console.error('Anthropic unreachable:', err.message);
    return res.status(502).json({ error: 'Upstream unreachable' });
  }

  // Retry twice on rate-limit or transient forbidden (403/429/503).
  // Stepped delays (3000ms, 8000ms).
  const retryDelays = [3000, 8000];
  let lastErrorBody = null;
  for (const delay of retryDelays) {
    if (upstream.ok || ![403, 429, 503].includes(upstream.status)) break;
    lastErrorBody = await upstream.text();
    console.error(`Anthropic ${upstream.status} — body: ${lastErrorBody}`);
    await sleep(delay);
    try {
      upstream = await callAnthropic();
    } catch (err) {
      console.error('Anthropic unreachable on retry:', err.message);
      return res.status(502).json({ error: 'Upstream unreachable' });
    }
  }

  if (!upstream.ok) {
    const errorText = await upstream.text();
    console.error(`Anthropic ${upstream.status} final — body: ${errorText}`);
    return res.status(502).json({ error: 'Upstream API error', status: upstream.status, detail: errorText });
  }

  const data    = await upstream.json();
  const content = data?.content?.[0]?.text;

  if (!content) {
    return res.status(502).json({ error: 'Empty response from Anthropic' });
  }

  const newTurnCount = turnCount + 1;
  return res.json({ content, done: newTurnCount >= 2, turnCount: newTurnCount });
});

app.use((req, res) => res.status(404).json({ error: 'Not Found' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`joier-server listening on port ${PORT}`));

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}
