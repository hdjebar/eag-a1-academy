/*
 * EAG A1 Académie — helpers d'interface partagés entre app.js et admin.js.
 * Une seule définition de esc() et des libellés : la dérive entre les deux
 * pages (sémantique de null, libellés manquants) est ainsi impossible.
 * Script classique exposant globalThis.EagUI ; aucun eval, aucune dépendance.
 */
(function (g) {
  "use strict";

  /* Tout texte d'item est échappé : le contenu des questions est une donnée,
   * jamais du markup. null/undefined rendent une chaîne vide, pas "null". */
  function esc(v) {
    return String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  const CAT_LABEL = { abstract: "Raisonnement abstrait", verbal: "Raisonnement verbal", numeric: "Raisonnement numérique", planning: "Planification", situational: "Jugement situationnel" };
  const SKILL_LABEL = { "suite-logique": "suite logique", matrice: "matrice", rotation: "rotation", transformation: "transformation", comprehension: "compréhension", inference: "inférence", "application-consigne": "application de consigne", "vrai-faux-indetermine": "vrai / faux / indéterminé", synthese: "synthèse", pourcentage: "pourcentage", variation: "variation", "ratio-proportion": "ratio et proportion", moyenne: "moyenne", "lecture-tableau": "lecture de tableau", "lecture-graphique": "lecture de graphique", "operations-simples": "opérations simples", "agenda-contraintes": "agenda et contraintes", priorisation: "priorisation", dependances: "dépendances", disponibilites: "disponibilités", conflits: "conflits d'agenda", "servir-client-usager": "servir le client-usager", conseiller: "conseiller" };
  const RATING_LABEL = ["Très inapproprié", "Plutôt inapproprié", "Plutôt approprié", "Très approprié"];

  /* ---------- Minimal ZIP writer (store, no compression) ---------- */
  /* Pure: returns a Uint8Array; the caller wraps it in a Blob for download. */
  const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  function crc32(b) { let c = 0xffffffff; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
  function zip(files) {
    const enc = new TextEncoder(), parts = [], central = [];
    let offset = 0;
    const d = new Date(), time = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1), date = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
    for (const f of files) {
      const name = enc.encode(f.path), data = enc.encode(f.content), crc = crc32(data);
      const h = new DataView(new ArrayBuffer(30));
      h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint16(8, 0, true);
      h.setUint16(10, time, true); h.setUint16(12, date, true); h.setUint32(14, crc, true); h.setUint32(18, data.length, true); h.setUint32(22, data.length, true);
      h.setUint16(26, name.length, true); h.setUint16(28, 0, true);
      parts.push(h, name, data);
      const c = new DataView(new ArrayBuffer(46));
      c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true); c.setUint16(10, 0, true);
      c.setUint16(12, time, true); c.setUint16(14, date, true); c.setUint32(16, crc, true); c.setUint32(20, data.length, true); c.setUint32(24, data.length, true);
      c.setUint16(28, name.length, true); c.setUint32(42, offset, true);
      central.push(c, name);
      offset += 30 + name.length + data.length;
    }
    const size = central.reduce((n, p) => n + p.byteLength, 0);
    const e = new DataView(new ArrayBuffer(22));
    e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true); e.setUint32(12, size, true); e.setUint32(16, offset, true);
    const all = [...parts, ...central, e];
    const out = new Uint8Array(all.reduce((n, p) => n + p.byteLength, 0));
    let at = 0;
    for (const p of all) { out.set(new Uint8Array(p.buffer, p.byteOffset, p.byteLength), at); at += p.byteLength; }
    return out;
  }

  g.EagUI = { esc, CAT_LABEL, SKILL_LABEL, RATING_LABEL, crc32, zip };
})(typeof globalThis !== "undefined" ? globalThis : this);
