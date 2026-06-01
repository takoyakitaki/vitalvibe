const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const DEFAULT_MODELS = ['gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-2.0-flash-lite'];

const FOOD_PROMPT = `
Analyze the food image and estimate nutrition for one visible serving.
Return strict JSON only, with this exact shape:
{"name":"Thai food name","calories":number,"protein":number,"note":"short Thai note"}

Rules:
- Use Thai for name and note.
- calories must be estimated kcal for the visible serving.
- protein must be estimated grams of protein.
- If there are multiple foods, name the main dish and include the rest in note.
- If the image is not food, return {"name":"","calories":0,"protein":0,"note":"ไม่พบอาหารในภาพ"}
`;

function extractInlineData(body) {
  const inlineData = body?.contents?.[0]?.parts?.find(part => part.inlineData)?.inlineData;
  if (inlineData) return inlineData;

  if (body?.mimeType && body?.image) {
    return { mimeType: body.mimeType, data: body.image };
  }

  return null;
}

function parseFood(text = '') {
  const clean = text
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();
  const jsonText = clean.match(/\{[\s\S]*\}/)?.[0] || clean;
  const parsed = JSON.parse(jsonText);

  return {
    name: String(parsed.name || '').trim(),
    calories: Math.max(0, Math.round(Number(parsed.calories) || 0)),
    protein: Math.max(0, Math.round(Number(parsed.protein) || 0)),
    note: String(parsed.note || '').trim(),
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const inlineData = extractInlineData(body);

    if (!inlineData?.mimeType?.startsWith('image/') || !inlineData?.data) {
      return res.status(400).json({ error: 'Image payload is required' });
    }

    if (inlineData.data.length > 8_000_000) {
      return res.status(413).json({ error: 'Image is too large' });
    }

    const requestBody = {
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
      contents: [{
        parts: [
          { inlineData },
          { text: FOOD_PROMPT },
        ],
      }],
    };
    const models = process.env.GEMINI_MODEL
      ? [process.env.GEMINI_MODEL, ...DEFAULT_MODELS.filter(model => model !== process.env.GEMINI_MODEL)]
      : DEFAULT_MODELS;

    let data = null;
    let lastError = null;
    let usedModel = null;

    for (const model of models) {
      const geminiRes = await fetch(`${GEMINI_API_BASE}/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      data = await geminiRes.json();
      if (geminiRes.ok) {
        usedModel = model;
        lastError = null;
        break;
      }

      lastError = {
        status: geminiRes.status,
        message: data.error?.message || `Gemini request failed for ${model}`,
      };

      if (geminiRes.status !== 404) break;
    }

    if (lastError) {
      return res.status(lastError.status).json({ error: lastError.message });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    return res.status(200).json({ food: parseFood(text), model: usedModel });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Analyze failed' });
  }
}
