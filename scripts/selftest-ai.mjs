import { readLimitedResponse } from "./lib/ai.mjs";

const text = await readLimitedResponse(new Response("bonjour"), 16);
if (text !== "bonjour") throw new Error("Lecture bornée incorrecte");
let rejected = false;
try { await readLimitedResponse(new Response("réponse beaucoup trop longue"), 8); } catch { rejected = true; }
if (!rejected) throw new Error("Une réponse trop volumineuse a été acceptée");
console.log("AI client self-test passed (taille de réponse bornée)");
