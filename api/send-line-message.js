const LINE_PUSH_URL = 'https://api.line.me/v2/bot/message/push';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'LINE_CHANNEL_ACCESS_TOKEN is not configured' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const to = String(body?.to || '').trim();
    const text = String(body?.text || '').trim();

    if (!to || !text) {
      return res.status(400).json({ error: 'Both "to" and "text" are required' });
    }

    const lineRes = await fetch(LINE_PUSH_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        messages: [{ type: 'text', text: text.slice(0, 5000) }],
      }),
    });

    if (!lineRes.ok) {
      const detail = await lineRes.text();
      return res.status(lineRes.status).json({ error: detail || 'LINE push failed' });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'LINE push failed' });
  }
}
