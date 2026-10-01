/** Minimal OpenAI-compatible chat client shared by generate-bank and review-bank. */
export function requireAiEnv() {
  for (const key of ["AI_API_URL", "AI_API_KEY", "AI_MODEL"]) {
    if (!process.env[key]) throw new Error(`${key} manquant (voir docs/AI-QUESTION-BANKS.md)`);
  }
}

export async function chat(messages, { temperature = 0 } = {}) {
  const response = await fetch(process.env.AI_API_URL, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${process.env.AI_API_KEY}` },
    body: JSON.stringify({ model: process.env.AI_MODEL, temperature, messages }),
  });
  if (!response.ok) throw new Error(`AI API ${response.status}: ${await response.text()}`);
  const payload = await response.json();
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
