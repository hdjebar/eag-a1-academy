/** Minimal OpenAI-compatible chat client shared by generate-bank and review-bank. */
export function requireAiEnv() {
  for (const key of ["AI_API_URL", "AI_API_KEY", "AI_MODEL"]) {
    if (!process.env[key]) throw new Error(`${key} manquant (voir docs/AI-QUESTION-BANKS.md)`);
  }
}

const boundedNumber = (value, fallback, min, max) => {
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.trunc(n))) : fallback;
};
export async function readLimitedResponse(response, maxBytes = 5 * 1024 * 1024) {
  const declared = Number(response.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > maxBytes) throw new Error(`Réponse IA trop volumineuse (${declared} octets)`);
  if (!response.body) {
    const text = await response.text();
    if (Buffer.byteLength(text) > maxBytes) throw new Error("Réponse IA trop volumineuse");
    return text;
  }
  const reader = response.body.getReader(), chunks = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) { await reader.cancel(); throw new Error("Réponse IA trop volumineuse"); }
    chunks.push(Buffer.from(value));
  }
  return Buffer.concat(chunks).toString("utf8");
}

export async function chat(messages, { temperature = 0 } = {}) {
  const timeout = boundedNumber(process.env.AI_TIMEOUT_MS, 120_000, 1_000, 600_000);
  const maxBytes = boundedNumber(process.env.AI_MAX_RESPONSE_BYTES, 5 * 1024 * 1024, 1_024, 20 * 1024 * 1024);
  let response;
  try {
    response = await fetch(process.env.AI_API_URL, {
      method: "POST", signal: AbortSignal.timeout(timeout),
      headers: { "content-type": "application/json", authorization: `Bearer ${process.env.AI_API_KEY}` },
      body: JSON.stringify({ model: process.env.AI_MODEL, temperature, messages }),
    });
  } catch (e) {
    if (e.name === "TimeoutError" || e.name === "AbortError") throw new Error(`Délai de l'API IA dépassé (${timeout} ms)`);
    throw e;
  }
  const raw = await readLimitedResponse(response, maxBytes);
  if (!response.ok) throw new Error(`AI API ${response.status}: ${raw.slice(0, 2000)}`);
  let payload;
  try { payload = JSON.parse(raw); } catch (e) { throw new Error(`Réponse API IA non JSON : ${e.message}`); }
  const content = payload.choices?.[0]?.message?.content ?? payload.output_text;
  if (!content) throw new Error("Réponse IA vide ou format de fournisseur incompatible");
  return content;
}

/** Parses a JSON answer, tolerating a surrounding ```json fence. */
export function parseJson(text) {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    throw new Error(`Réponse IA non JSON : ${e.message}\n--- début de la réponse ---\n${cleaned.slice(0, 500)}`);
  }
}
