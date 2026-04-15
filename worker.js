// STAGING: ALLOWED_ORIGIN is '*' — change to 'https://joier.art' before going live
const ALLOWED_ORIGIN = '*';

// Tracks the last Anthropic request time within this isolate instance.
// Cloudflare may run multiple isolates; this only throttles within a single instance.
let lastAnthropicRequestTime = 0;

const SYSTEM_PROMPT = `You are Walter McCaffrey. You make bespoke jewelry in Manila.

This is an intake form. You are collecting just enough to follow up with the client personally.

You have two turns. Use them to learn:
1. Who the piece is for, and their relationship to it.
2. What it should feel like — its weight, its meaning, its purpose. Not its design.

Rules:
- One short acknowledgment, then one question. That is the entire response.
- Short sentences only. No metaphors. No poetic language.
- Do not compliment what the client says.
- Do not suggest design directions or materials.
- Do not ask about metal, stones, budget, or occasion. That comes later.

On turn 2: this is your final response. Acknowledge what they told you in one sentence. End with one short sentence that signals you have what you need. Do not ask a question.

Tone: direct and warm. Minimal. Like a craftsman who respects your time.`;

const corsHeaders = () => ({
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Vary': 'Origin',
});

export default {
  async fetch(request, env) {
    const headers = corsHeaders();

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405, headers });
    }

    const url = new URL(request.url);

    if (url.pathname === '/chat') {
      return handleChat(request, env, headers);
    }

    return new Response('Not Found', { status: 404, headers });
  },
};

async function handleChat(request, env, headers) {
  const json = (body, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const { messages, turnCount } = body;

  if (!Array.isArray(messages) || typeof turnCount !== 'number') {
    return json({ error: 'Invalid payload' }, 400);
  }

  if (turnCount >= 2) {
    return json({ error: 'Max turns reached' }, 400);
  }

  const anthropicBody = JSON.stringify({
    model: 'claude-sonnet-4-6',
    max_tokens: 300,
    system: SYSTEM_PROMPT,
    messages,
  });

  const anthropicHeaders = {
    'x-api-key': env.ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01',
    'content-type': 'application/json',
  };

  const callAnthropic = () =>
    fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: anthropicHeaders,
      body: anthropicBody,
    });

  // If a request was made within the last 5 seconds in this isolate, pause 1000ms first.
  const now = Date.now();
  if (now - lastAnthropicRequestTime < 5000) {
    await new Promise(r => setTimeout(r, 1000));
  }
  lastAnthropicRequestTime = Date.now();

  let res;
  try {
    res = await callAnthropic();
  } catch {
    return json({ error: 'Upstream unreachable' }, 502);
  }

  // Retry twice on rate-limit or transient forbidden (403/429/503).
  // Stepped delays (3000ms, 8000ms) to clear Anthropic's rate-limit window.
  const retryDelays = [3000, 8000];
  let lastErrorBody = null;
  for (const delay of retryDelays) {
    if (res.ok || !(res.status === 429 || res.status === 403 || res.status === 503)) break;
    lastErrorBody = await res.text();
    console.error(`Anthropic ${res.status} — body: ${lastErrorBody}`);
    await new Promise(r => setTimeout(r, delay));
    try {
      res = await callAnthropic();
    } catch {
      return json({ error: 'Upstream unreachable' }, 502);
    }
  }

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`Anthropic ${res.status} final — body: ${errorText}`);
    return json({ error: 'Upstream API error', status: res.status, detail: errorText }, 502);
  }

  const data = await res.json();
  const content = data?.content?.[0]?.text;

  if (!content) {
    return json({ error: 'Empty response from Anthropic' }, 502);
  }

  const newTurnCount = turnCount + 1;

  return json({
    content,
    done: newTurnCount >= 2,
    turnCount: newTurnCount,
  });
}