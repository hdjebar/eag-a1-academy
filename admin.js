"use strict";
/* Admin UI for EAG A1 Académie.
 * Works in two modes:
 *  - offline: admin.html opened from disk; data from bank/admin-bank.js; results downloaded as a ZIP;
 *  - server: started with `npm run admin`; reads/writes the repository through a local API.
 * All item text is escaped before display: candidate files are untrusted data. */
/* Schéma, banque complète et consignes compilés par npm run build:bank dans bank/admin-bank.js. */
const { schema: SCHEMA, approved: APPROVED_EMBEDDED, prompts: PROMPTS } = globalThis.EAG_ADMIN_DATA || { schema: {}, approved: {}, prompts: {} };

const R = globalThis.EagRules;
const CATS = ["abstract", "verbal", "numeric", "planning", "situational"];
/* Libellés et échappement partagés : shared/ui.js (une seule définition pour app et admin). */
const CAT_LABEL = globalThis.EagUI.CAT_LABEL;
const SKILL_LABEL = globalThis.EagUI.SKILL_LABEL;
const RATING_LABEL = globalThis.EagUI.RATING_LABEL;
const TFCS = { fr: ["Vrai", "Faux", "On ne peut pas savoir"], de: ["Richtig", "Falsch", "Nicht zu entscheiden"] };
const STORE_KEY = "eag-admin-session-v1";

const S = {
  mode: "offline", token: null, aiConfigured: false, workspaceRevision: null, approvedBaseHash: null,
  approved: {}, approvedOrig: {}, removed: new Set(),
  cands: [], files: {}, log: [], exportedLogCount: 0,
  sel: { queue: null, bank: null }, bankDraft: null, bankSel: new Set(), tab: "queue", busy: false, refreshing: false,
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = globalThis.EagUI.esc;
const clone = (x) => JSON.parse(JSON.stringify(x));
const nowIso = () => new Date().toISOString();
const reviewer = () => $("#reviewer").value.trim();
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 2600); }
function store(key, val) { try { if (val === undefined) localStorage.removeItem(key); else localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* storage unavailable */ } }
function load(key) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch (e) { return null; } }

/* ---------- Schema-derived rules per category ---------- */
function catRules(cat) {
  const branch = (SCHEMA.allOf || []).find((b) => b.if?.properties?.category?.const === cat);
  const p = branch?.then?.properties || {};
  const fmt = p.itemFormat?.const ? [p.itemFormat.const] : p.itemFormat?.enum || ["single_best"];
  return { skills: p.skill?.enum || [], formats: fmt };
}
function checks(item) { return R.checkItem(SCHEMA, item); }
function allApproved() { return CATS.flatMap((c) => S.approved[c] || []); }
function reviewCurrent(item, review) { return Boolean(review?.candidateHash && review.candidateHash === R.contentHash({ candidate: item })); }

/* ---------- Rendering helpers ---------- */
function stimulusHtml(s) {
  if (s == null) return "";
  if (typeof s === "string") return `<div class="stimulus text">${esc(s)}</div>`;
  if (s.type === "shapes") return `<div class="stimulus"><div class="shapes" role="img" aria-label="Série de figures">${esc(s.text)}</div></div>`;
  if (s.type === "table") {
    const head = `<tr>${(s.headers || []).map((h) => `<th scope="col">${esc(h)}</th>`).join("")}</tr>`;
    const body = (s.rows || []).map((r) => `<tr>${(r || []).map((c, i) => (i === 0 ? `<th scope="row">${esc(c)}</th>` : `<td>${esc(typeof c === "number" ? c.toLocaleString("fr-FR") : c)}</td>`)).join("")}</tr>`).join("");
    return `<div class="stimulus"><table class="data">${s.caption ? `<caption>${esc(s.caption)}</caption>` : ""}<thead>${head}</thead><tbody>${body}</tbody></table>${s.note ? `<p><small>${esc(s.note)}</small></p>` : ""}</div>`;
  }
  if (s.type === "chart") return globalThis.EagChart ? `<div class="stimulus">${EagChart.html(s, esc)}</div>` : `<div class="msg error">Graphique non affichable : shared/chart.js n'est pas chargé.</div>`;
  return `<div class="msg error">Stimulus de type inconnu</div>`;
}
function aiChip(c) {
  if (!c.ai) return `<span class="chip">IA : absente</span>`;
  if (c.aiStale) return `<span class="chip warn">IA : obsolète</span>`;
  const cls = c.ai.decision === "pass" ? "ok" : c.ai.decision === "reject" ? "ko" : "warn";
  return `<span class="chip ${cls}">IA : ${esc(c.ai.decision)}</span>`;
}
function decisionChip(c) {
  if (c.decision === "approved") return `<span class="chip ok">Approuvé</span>`;
  if (c.decision === "rejected") return `<span class="chip ko">Rejeté</span>`;
  return `<span class="chip info">À traiter</span>`;
}
function checkChip(item) {
  const r = checks(item);
  if (r.errors.length) return `<span class="chip ko">${r.errors.length} erreur(s)</span>`;
  if (r.warnings.length) return `<span class="chip warn">${r.warnings.length} alerte(s)</span>`;
  return `<span class="chip ok">Valide</span>`;
}
function msgList(r, extra = []) {
  const rows = [...r.errors.map((m) => `<div class="msg error">${esc(m)}</div>`), ...r.warnings.map((m) => `<div class="msg warning">${esc(m)}</div>`), ...extra];
  return rows.length ? rows.join("") : `<div class="msg good">Aucune erreur : conforme au schéma et aux règles du projet.</div>`;
}
function duplicates(item, exceptId) {
  const text = R.itemText(item);
  const pool = [...allApproved().map((x) => ["banque", x]), ...S.cands.filter((c) => c.decision !== "approved").map((c) => ["candidat", c.item])];
  return pool.filter(([, x]) => x.id !== exceptId && x !== item).map(([where, x]) => ({ where, id: x.id, sim: R.similarity(text, R.itemText(x)) })).filter((d) => d.sim >= 0.55).sort((a, b) => b.sim - a.sim).slice(0, 5);
}
function dupMsgs(item, exceptId) {
  return duplicates(item, exceptId).map((d) => `<div class="msg warning">Proche de ${esc(d.id)} (${d.where}, similarité ${Math.round(d.sim * 100)} %)</div>`);
}

/* ---------- Loading ---------- */
function setApproved(bank) {
  S.approved = {}; S.approvedOrig = {}; S.removed = new Set();
  for (const c of CATS) { S.approved[c] = clone(bank[c] || []); S.approvedOrig[c] = JSON.stringify(bank[c] || []); }
  S.approvedBaseHash = R.contentHash({ approved: bank });
}
function addCandidates(fileName, items, review, isNew = false) {
  if (!Array.isArray(items)) throw new Error("tableau JSON attendu");
  const reviews = new Map((review?.reviews || []).map((r) => [r.id, r]));
  S.files[fileName] = S.files[fileName] || { ids: [], hasReview: false, isNew };
  if (review) S.files[fileName].hasReview = true;
  let added = 0;
  for (const raw of items) {
    if (!raw || typeof raw !== "object") continue;
    const key = `${fileName}::${raw.id}`;
    if (S.cands.some((c) => c.key === key)) continue;
    const ai = reviews.get(raw.id) || null;
    S.cands.push({ key, file: fileName, item: raw, orig: JSON.stringify(raw), ai, aiStale: Boolean(ai && !reviewCurrent(raw, ai)), decision: null, reason: "", blind: null });
    S.files[fileName].ids.push(raw.id);
    added++;
  }
  return added;
}
function attachReview(review) {
  let n = 0;
  for (const r of review.reviews || []) {
    for (const c of S.cands.filter((c) => c.item.id === r.id && reviewCurrent(c.item, r))) { c.ai = r; c.aiStale = false; S.files[c.file].hasReview = true; n++; }
  }
  return n;
}
async function readFiles(fileList) {
  const msgs = [];
  const parsed = [];
  for (const f of fileList) {
    try { parsed.push({ name: f.name, data: JSON.parse(await f.text()) }); }
    catch (e) { msgs.push(`<div class="msg error">${esc(f.name)} : JSON illisible (${esc(e.message)})</div>`); }
  }
  // Candidate arrays first, then reviews so they can attach to items.
  for (const p of parsed.filter((p) => Array.isArray(p.data))) {
    const clash = p.data.filter((x) => allApproved().some((a) => a.id === x?.id)).map((x) => x.id);
    try {
      const n = addCandidates(p.name, p.data, null);
      msgs.push(`<div class="msg good">${esc(p.name)} : ${n} item(s) chargé(s)</div>`);
      if (clash.length) msgs.push(`<div class="msg warning">${esc(p.name)} : identifiant(s) déjà dans la banque : ${esc(clash.join(", "))}</div>`);
    } catch (e) { msgs.push(`<div class="msg error">${esc(p.name)} : ${esc(e.message)}</div>`); }
  }
  for (const p of parsed.filter((p) => !Array.isArray(p.data))) {
    if (Array.isArray(p.data?.reviews)) msgs.push(`<div class="msg good">${esc(p.name)} : revue IA rattachée à ${attachReview(p.data)} item(s)</div>`);
    else msgs.push(`<div class="msg error">${esc(p.name)} : ni tableau de candidats, ni fichier de revue</div>`);
  }
  $("#loadmsgs").innerHTML = msgs.join("");
  if (!S.sel.queue && S.cands.length) S.sel.queue = S.cands[0].key;
  persist(); renderAll();
}

/* ---------- Server mode ---------- */
async function api(path, body) {
  const res = await fetch(path, { method: body ? "POST" : "GET", headers: { "x-admin-token": S.token, ...(body ? { "content-type": "application/json" } : {}) }, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}
async function detectServer() {
  if (!location.protocol.startsWith("http")) return false;
  const m = location.hash.match(/token=([\w-]+)/);
  let token = m ? m[1] : null;
  try { if (token) sessionStorage.setItem("eag-admin-token", token); else token = sessionStorage.getItem("eag-admin-token"); } catch (e) { /* ignore */ }
  if (m) history.replaceState(null, "", location.pathname);
  if (!token) return false;
  S.token = token;
  try { await reloadFromServer(); return true; } catch (e) { $("#loadmsgs").innerHTML = `<div class="msg error">Serveur d'administration injoignable : ${esc(e.message)}</div>`; return false; }
}
async function reloadFromServer() {
  const st = await api("/api/state");
  S.mode = "server"; S.aiConfigured = st.aiConfigured; S.workspaceRevision = st.workspaceRevision;
  setApproved(st.approved);
  S.cands = []; S.files = {};
  for (const f of st.candidates) addCandidates(f.file, f.items, f.review);
  if (S.sel.queue && !S.cands.some((c) => c.key === S.sel.queue)) S.sel.queue = null;
  if (!S.sel.queue && S.cands.length) S.sel.queue = S.cands[0].key;
}

/** After a task: add new candidate files and fresh reviews without touching unsaved work. */
async function mergeFromServer() {
  const st = await api("/api/state");
  // If the approved bank changed on disk while we hold unsaved edits, stop here: refreshing
  // the revision would let the next save silently overwrite the concurrent change (the
  // per-item decision checks would catch it later, but the stale revision fails fast).
  const dirty = CATS.some((c) => JSON.stringify(S.approved[c] || []) !== S.approvedOrig[c]);
  const serverChanged = CATS.some((c) => JSON.stringify(st.approved?.[c] || []) !== S.approvedOrig[c]);
  if (dirty && serverChanged) {
    toast("La banque approuvée a changé sur le disque : rechargez-la avant d'enregistrer.");
    return [];
  }
  if (serverChanged) setApproved(st.approved);
  S.aiConfigured = st.aiConfigured; S.workspaceRevision = st.workspaceRevision;
  const added = [];
  for (const f of st.candidates) {
    if (!S.files[f.file]) { addCandidates(f.file, f.items, f.review); added.push(f.file); }
    else if (f.review) attachReview(f.review);
  }
  return added;
}

async function refreshServerView() {
  if (S.mode !== "server" || S.busy || S.refreshing) return;
  S.refreshing = true;
  try { await mergeFromServer(); renderAll(); }
  catch (e) { toast(`Actualisation impossible : ${e.message}`); }
  finally { S.refreshing = false; }
}

/* ---------- Offline session persistence ---------- */
function persist() {
  if (S.mode !== "offline") return;
  store(STORE_KEY, { savedAt: nowIso(), baseHash: S.approvedBaseHash, cands: S.cands, files: S.files, approved: S.approved, removed: [...S.removed], log: S.log, exportedLogCount: S.exportedLogCount });
}
function restore(saved) {
  if (!saved.baseHash || saved.baseHash !== S.approvedBaseHash) {
    toast("Session incompatible avec la banque actuelle : rechargez les candidats sans restaurer cet ancien état.");
    return false;
  }
  S.cands = saved.cands || []; S.files = saved.files || {}; S.log = saved.log || [];
  S.exportedLogCount = Math.max(0, Math.min(Number.isInteger(saved.exportedLogCount) ? saved.exportedLogCount : 0, S.log.length));
  // Persisted sessions may predate content-bound AI reviews. Never trust the
  // serialized aiStale flag; derive it again from the current item and review.
  for (const c of S.cands) c.aiStale = Boolean(c.ai && !reviewCurrent(c.item, c.ai));
  for (const c of CATS) S.approved[c] = saved.approved?.[c] || S.approved[c];
  S.removed = new Set(saved.removed || []);
  S.sel.queue = S.cands[0]?.key || null;
  renderAll();
  return true;
}

/* ---------- Queue ---------- */
function filteredCands() {
  const cat = $("#qcat").value, st = $("#qstate").value, ai = $("#qai").value;
  return S.cands.filter((c) => {
    if (cat && c.item.category !== cat) return false;
    if (st === "todo" && c.decision) return false;
    if (st && st !== "todo" && st !== "errors" && c.decision !== st) return false;
    if (st === "errors" && !checks(c.item).errors.length) return false;
    if (ai === "none" && c.ai && !c.aiStale) return false;
    if (ai && ai !== "none" && (!c.ai || c.aiStale || c.ai.decision !== ai)) return false;
    return true;
  });
}
function renderQueue() {
  const list = filteredCands();
  $("#queuecount").textContent = S.cands.filter((c) => !c.decision).length;
  $("#queue").innerHTML = list.length ? list.map((c) => `<button class="row" data-key="${esc(c.key)}" aria-current="${c.key === S.sel.queue}">
    <span class="id">${esc(c.item.id || "(sans id)")}</span><span class="p">${esc(c.item.prompt || "")}</span>
    <span class="chips"><span class="chip">${esc(CAT_LABEL[c.item.category] || c.item.category)}</span>${c.item.revisionOf ? `<span class="chip warn">Révision</span>` : ""}${decisionChip(c)}${aiChip(c)}${checkChip(c.item)}</span></button>`).join("")
    : `<p class="empty">${S.cands.length ? "Aucun item pour ces filtres." : "Aucun candidat chargé."}</p>`;
}
function currentCand() { return S.cands.find((c) => c.key === S.sel.queue) || null; }

function previewHtml(item, { blind, mine, showKey }) {
  const figs = item.category === "abstract" ? " figs" : "";
  const opts = (item.options || []).map((o, i) => {
    const isKey = showKey && i === item.correctIndex;
    let meta = "";
    if (showKey && item.itemFormat === "rating" && item.ratings) meta += `<span class="chip ${item.ratings[i] === 4 ? "ok" : ""}">réf. ${esc(item.ratings[i])}</span>`;
    if (mine != null) {
      if (item.itemFormat === "rating" && Array.isArray(mine)) meta += `<span class="chip info">vous : ${esc(mine[i] ?? "—")}</span>`;
      else if (mine === i) meta += `<span class="chip info">votre choix</span>`;
    }
    if (showKey && isKey) meta += `<span class="chip ok">clé</span>`;
    const why = showKey && item.optionRationales?.[i] ? `<small>${esc(item.optionRationales[i])}</small>` : "";
    let control = "";
    if (blind) {
      control = item.itemFormat === "rating"
        ? `<span class="scale" role="radiogroup" aria-label="Note de l'option ${i + 1}">${[1, 2, 3, 4].map((v) => `<label title="${RATING_LABEL[v - 1]}"><input type="radio" name="b${i}" value="${v}">${v}</label>`).join("")}</span>`
        : `<input type="radio" name="bchoice" value="${i}" aria-label="Option ${i + 1}">`;
    }
    return `<div class="opt${figs}${isKey ? " key" : ""}${mine === i ? " mine" : ""}">${control}<div><span class="t">${esc(o)}</span>${why}</div><span class="meta">${meta}</span></div>`;
  }).join("");
  return `<p class="section-title">${esc(CAT_LABEL[item.category] || "")}${item.skill ? ` · ${esc(SKILL_LABEL[item.skill] || item.skill)}` : ""} · difficulté ${esc(item.difficulty)} · ${esc(item.estimatedSeconds)} s</p>
    <p class="qprompt">${esc(item.prompt)}</p>${stimulusHtml(item.stimulus)}<div class="opts">${opts}</div>
    ${showKey ? `<div class="msg note" style="margin-top:var(--s3)"><strong>Explication :</strong> ${esc(item.explanation)}</div>` : ""}`;
}

function renderDetail() {
  const c = currentCand();
  const box = $("#detail");
  if (!c) { box.innerHTML = `<p class="empty">${S.cands.length ? "Sélectionnez un item." : "Chargez un fichier de candidats ou créez une question, puis sélectionnez un item."}</p>`; return; }
  box.innerHTML = `<div class="detailhead"><div><div class="id mono">${esc(c.item.id)}</div><div class="chips" id="d-chips"></div><small class="mono">${esc(c.file)}</small></div><div id="d-actions" class="actions"></div></div>
    <div class="panel" style="margin-top:var(--s3)"><div class="actions" style="justify-content:space-between"><div class="section-title">Aperçu candidat</div><label class="actions" style="font-size:var(--sm)"><input type="checkbox" id="blindmode" ${c.blind ? "" : "checked"}> Résoudre à l'aveugle</label></div><div id="d-preview" class="preview"></div></div>
    ${c.item.revisionOf ? `<div class="panel"><div class="section-title">Modifications proposées par rapport à la version approuvée</div><div id="d-diff"></div></div>` : ""}
    <div class="panel"><div class="section-title">Revue IA aveugle</div><div id="d-ai" class="msgs"></div></div>
    <div class="panel"><div class="section-title">Contrôles automatiques</div><div id="d-checks" class="msgs"></div></div>
    <div class="panel"><details ${c.decision ? "" : "open"}><summary>Modifier la question</summary><div id="d-editor" style="margin-top:var(--s3)"></div></details></div>`;
  $("#blindmode").onchange = (e) => { if (!e.target.checked && !c.blind) c.blind = { skipped: true }; else if (e.target.checked) c.blind = null; refreshDetail(); };
  renderEditor($("#d-editor"), c.item, () => { if (c.ai) c.aiStale = !reviewCurrent(c.item, c.ai); c.blind = c.blind?.skipped ? c.blind : null; refreshDetail(); persist(); renderQueue(); }, { lockId: false });
  refreshDetail();
}
function refreshDetail() {
  const c = currentCand(); if (!c) return;
  const item = c.item;
  const r = checks(item);
  $("#d-chips").innerHTML = `${decisionChip(c)}${aiChip(c)}${checkChip(item)}`;

  // Preview (blind first, key revealed after answering)
  const blindActive = !c.blind && !c.decision;
  const mine = c.blind && !c.blind.skipped ? (c.blind.ratings || c.blind.choice) : null;
  $("#d-preview").innerHTML = previewHtml(item, { blind: blindActive, mine, showKey: !blindActive }) + (blindActive ? `<div class="actions" style="margin-top:var(--s3)"><button class="btn secondary" id="blindcheck">Vérifier ma réponse</button><span class="chip">La clé est masquée tant que vous n'avez pas répondu.</span></div>` : blindResult(c));
  const bc = $("#blindcheck");
  if (bc) bc.onclick = () => {
    if (item.itemFormat === "rating") {
      const vals = (item.options || []).map((_, i) => { const x = $(`input[name=b${i}]:checked`); return x ? Number(x.value) : null; });
      if (vals.includes(null)) return toast("Notez chaque réaction.");
      c.blind = { ratings: vals };
    } else {
      const x = $("input[name=bchoice]:checked");
      if (!x) return toast("Choisissez une option.");
      c.blind = { choice: Number(x.value) };
    }
    persist(); refreshDetail();
  };

  // AI review
  const a = c.ai;
  $("#d-ai").innerHTML = !a ? `<div class="msg note">Aucune revue IA pour cet item. Chargez le fichier <code>*.review.json</code>${S.mode === "server" ? " ou lancez la revue dans l'onglet Exporter" : ""}.</div>`
    : `${c.aiStale ? `<div class="msg warning">Item modifié depuis la revue : décision obsolète.</div>` : ""}
       <div class="msg ${a.decision === "pass" ? "good" : a.decision === "reject" ? "error" : "warning"}">Décision : <strong>${esc(a.decision)}</strong>${a.confidence ? ` · confiance ${esc(a.confidence)}` : ""}${a.chosenIndex != null ? ` · réponse trouvée : option ${Number(a.chosenIndex) + 1} (clé : ${item.correctIndex + 1})` : ""}${Array.isArray(a.ratings) ? ` · notes ${esc(a.ratings.join(", "))}` : ""}</div>
       ${(a.issues || []).map((i) => `<div class="msg warning">${esc(i)}</div>`).join("")}`;

  // Checks
  $("#d-checks").innerHTML = msgList(r, dupMsgs(item, item.revisionOf || null));
  if ($("#d-diff")) $("#d-diff").innerHTML = diffHtml(c);

  // Decision actions
  const aiOk = a && a.decision === "pass" && !c.aiStale;
  const act = $("#d-actions");
  if (c.decision) {
    act.innerHTML = `<span class="chip ${c.decision === "approved" ? "ok" : "ko"}">${c.decision === "approved" ? "Approuvé" : `Rejeté : ${esc(c.reason)}`}</span><button class="btn secondary" id="undo">Remettre en attente</button>`;
    $("#undo").onclick = () => undoDecision(c);
  } else {
    act.innerHTML = `${aiOk ? "" : `<label class="actions" style="font-size:var(--xs)"><input type="checkbox" id="override"> J'ai vérifié la réponse moi-même (revue IA non « pass »)</label>`}
      <button class="btn" id="approve" ${r.errors.length ? "disabled title=\"Corrigez les erreurs avant d'approuver\"" : ""}>Approuver</button>
      <input type="text" id="reason" placeholder="Motif du rejet" aria-label="Motif du rejet" style="width:12rem"><button class="btn danger" id="reject">Rejeter</button>`;
    $("#approve").onclick = () => approve(c);
    $("#reject").onclick = () => reject(c, $("#reason").value.trim());
  }
}
function blindResult(c) {
  const item = c.item;
  if (!c.blind || c.blind.skipped || c.decision) return "";
  setTimeout(() => { const b = $("#blindagain"); if (b) b.onclick = () => { c.blind = null; refreshDetail(); }; });
  if (item.itemFormat === "rating") {
    const gap = c.blind.ratings.reduce((s, v, i) => s + Math.abs(v - item.ratings[i]), 0) / c.blind.ratings.length;
    const top = c.blind.ratings.indexOf(Math.max(...c.blind.ratings));
    const ok = top === item.correctIndex && gap <= 1;
    return `<div class="msg ${ok ? "good" : "warning"}" style="margin-top:var(--s3)">${ok ? "Vos notes concordent avec la clé" : "Vos notes divergent de la clé"} (écart moyen ${gap.toFixed(2)}). <button class="btn ghost" id="blindagain">Recommencer</button></div>`;
  }
  const ok = c.blind.choice === item.correctIndex;
  return `<div class="msg ${ok ? "good" : "warning"}" style="margin-top:var(--s3)">${ok ? "Vous avez trouvé la même réponse que la clé." : "Votre réponse diffère de la clé : vérifiez l'item avant d'approuver."} <button class="btn ghost" id="blindagain">Recommencer</button></div>`;
}

/* ---------- Revision diff ---------- */
function showValue(v) {
  if (v == null) return "—";
  if (typeof v === "string") return v;
  if (v.type === "shapes") return v.text;
  if (v.type === "table") return [v.caption, tableToText(v), v.note].filter(Boolean).join("\n");
  if (v.type === "chart") {
    const labels = Array.isArray(v.labels) ? v.labels : [], series = (Array.isArray(v.series) ? v.series : []).filter((x) => x && typeof x === "object");
    return [`${v.caption ?? ""} (${v.kind ?? "?"})`, ["", ...labels].join(" | "), ...series.map((x) => [x.name, ...(Array.isArray(x.values) ? x.values : [])].join(" | ")), v.note].filter(Boolean).join("\n");
  }
  return JSON.stringify(v);
}
function diffHtml(c) {
  const after = c.item;
  const before = c.replaced || allApproved().find((x) => x.id === after.revisionOf);
  if (!before) return `<div class="msg warning">Question d'origine introuvable dans la banque.</div>`;
  const rows = [];
  const add = (label, a, b) => { if (JSON.stringify(a) !== JSON.stringify(b)) rows.push(`<tr><th scope="row">${esc(label)}</th><td class="before">${esc(showValue(a))}</td><td class="after">${esc(showValue(b))}</td></tr>`); };
  add("Format", before.itemFormat, after.itemFormat);
  add("Compétence", before.skill, after.skill);
  add("Difficulté", before.difficulty, after.difficulty);
  add("Énoncé", before.prompt, after.prompt);
  add("Stimulus", before.stimulus, after.stimulus);
  const n = Math.max(before.options.length, after.options.length);
  for (let i = 0; i < n; i++) {
    const mark = (it) => (it.options[i] == null ? null : `${it.options[i]}${i === it.correctIndex ? "  ✓" : ""}${it.ratings ? `  [${it.ratings[i]}]` : ""}`);
    add(`Option ${i + 1}`, mark(before), mark(after));
    add(`Justification ${i + 1}`, before.optionRationales?.[i] ?? null, after.optionRationales?.[i] ?? null);
  }
  add("Explication", before.explanation, after.explanation);
  return rows.length ? `<p class="msg note">Version approuvée : v${esc(before.version)}. L'approbation remplace cette version (v${esc((before.version || 1) + 1)}).</p><table class="diff"><thead><tr><th></th><th>Avant</th><th>Après</th></tr></thead><tbody>${rows.join("")}</tbody></table>` : `<div class="msg note">Aucune différence avec la version approuvée.</div>`;
}

/* ---------- Decisions ---------- */
function approve(c) {
  const who = reviewer();
  if (who.length < 2) { $("#reviewer").focus(); return toast("Indiquez votre nom de relecteur."); }
  const r = checks(c.item);
  if (r.errors.length) return toast("Corrigez les erreurs avant d'approuver.");
  const aiOk = c.ai && c.ai.decision === "pass" && !c.aiStale;
  if (!aiOk && !$("#override")?.checked) return toast("Revue IA non « pass » : cochez la confirmation de vérification.");
  const cat = c.item.category;
  const revisionOf = c.item.revisionOf;
  const original = revisionOf ? (S.approved[cat] || []).find((x) => x.id === revisionOf) : null;
  if (revisionOf && !original) return toast("La question d'origine n'est plus dans la banque.");
  if (!revisionOf && allApproved().some((x) => x.id === c.item.id)) return toast("Cet identifiant existe déjà dans la banque : modifiez-le.");
  const item = { ...clone(c.item), reviewStatus: "approved", reviewer: who, reviewedAt: nowIso() };
  delete item.rejectionReason; delete item.revisionOf;
  if (original) item.version = (original.version || 1) + 1;
  const final = checks(item);
  if (final.errors.length) return toast(`Approbation impossible : ${final.errors[0]}`);
  if (original) { const list = S.approved[cat]; list[list.indexOf(original)] = item; c.replaced = original; }
  else S.approved[cat].push(item);
  c.decision = "approved"; c.reason = "";
  S.log.push({ id: item.id, decision: original ? "revised" : "approved", version: item.version, hash: R.contentHash(item), reviewer: who, at: item.reviewedAt, aiDecision: c.ai?.decision || null, aiOverride: !aiOk, blindMatch: blindMatch(c), file: c.file });
  toast(`${item.id} approuvé`); persist(); nextTodo(); renderAll();
}
function blindMatch(c) {
  if (!c.blind || c.blind.skipped) return null;
  if (Array.isArray(c.blind.ratings)) return c.blind.ratings.indexOf(Math.max(...c.blind.ratings)) === c.item.correctIndex;
  return c.blind.choice === c.item.correctIndex;
}
function reject(c, reason) {
  const who = reviewer();
  if (who.length < 2) { $("#reviewer").focus(); return toast("Indiquez votre nom de relecteur."); }
  if (reason.length < 3) { $("#reason").focus(); return toast("Indiquez un motif de rejet."); }
  c.decision = "rejected"; c.reason = reason;
  S.log.push({ id: c.item.id, decision: "rejected", reviewer: who, at: nowIso(), reason, aiDecision: c.ai?.decision || null, file: c.file });
  toast(`${c.item.id} rejeté`); persist(); nextTodo(); renderAll();
}
function undoDecision(c) {
  if (c.decision === "approved") {
    const cat = c.item.category;
    if (c.replaced) { const list = S.approved[cat]; const i = list.findIndex((x) => x.id === c.item.id); if (i !== -1) list[i] = c.replaced; c.replaced = null; }
    else S.approved[cat] = S.approved[cat].filter((x) => x.id !== c.item.id);
  }
  S.log.push({ id: c.item.id, decision: "undone", reviewer: reviewer(), at: nowIso(), file: c.file });
  c.decision = null; c.reason = "";
  persist(); renderAll();
}
function nextTodo() { const n = filteredCands().find((c) => !c.decision) || S.cands.find((c) => !c.decision); if (n) S.sel.queue = n.key; }

/* ---------- Editor (shared by candidates and approved items) ---------- */
function stimulusKind(s) { return s == null ? "none" : typeof s === "string" ? "text" : s.type; }
function tableToText(s) { return [(s.headers || []).join(" | "), ...(s.rows || []).map((r) => r.join(" | "))].join("\n"); }
function textToTable(t, base) {
  const lines = t.split("\n").map((l) => l.trim()).filter(Boolean);
  const cells = (l) => l.split("|").map((x) => x.trim());
  const num = (x) => (/^-?\d+(,\d+)?$/.test(x) ? Number(x.replace(",", ".")) : /^-?\d+\.\d+$/.test(x) ? Number(x) : x);
  const out = { type: "table", headers: lines[0] ? cells(lines[0]) : [], rows: lines.slice(1).map((l) => cells(l).map(num)) };
  if (base?.caption) out.caption = base.caption;
  if (base?.note) out.note = base.note;
  return out;
}
function renderEditor(box, item, onChange, { lockId }) {
  const rules = catRules(item.category);
  const kind = stimulusKind(item.stimulus);
  const isRating = item.itemFormat === "rating", isTfcs = item.itemFormat === "tfcs";
  box.innerHTML = `<div class="grid2">
      <label class="field"><span>Identifiant</span><input type="text" data-f="id" value="${esc(item.id)}" ${lockId ? "readonly" : ""}></label>
      <label class="field"><span>Format</span><select data-f="itemFormat">${rules.formats.map((f) => `<option ${f === item.itemFormat ? "selected" : ""}>${f}</option>`).join("")}</select></label>
      <label class="field"><span>Compétence</span><select data-f="skill">${rules.skills.map((s) => `<option value="${s}" ${s === item.skill ? "selected" : ""}>${esc(SKILL_LABEL[s] || s)}</option>`).join("")}${rules.skills.includes(item.skill) ? "" : `<option selected value="${esc(item.skill)}">${esc(item.skill)} (non autorisée)</option>`}</select></label>
      <label class="field"><span>Difficulté</span><select data-f="difficulty">${[1, 2, 3].map((d) => `<option ${d === item.difficulty ? "selected" : ""}>${d}</option>`).join("")}</select></label>
      <label class="field"><span>Durée estimée (s)</span><input type="number" min="20" max="300" data-f="estimatedSeconds" value="${esc(item.estimatedSeconds)}"></label>
      <label class="field"><span>Langue</span><select data-f="language">${["fr", "de"].map((l) => `<option ${l === item.language ? "selected" : ""}>${l}</option>`).join("")}</select></label>
    </div>
    <label class="field" style="margin-top:var(--s3)"><span>Énoncé</span><textarea data-f="prompt">${esc(item.prompt)}</textarea></label>
    <div class="field" style="margin-top:var(--s3)"><span>Stimulus</span>
      <select data-stim-kind>${[["none", "Aucun"], ["text", "Texte"], ["shapes", "Figures"], ["table", "Tableau"], ["chart", "Graphique"]].map(([v, l]) => `<option value="${v}" ${v === kind ? "selected" : ""}>${l}</option>`).join("")}</select>
      ${kind === "text" ? `<textarea data-stim="text">${esc(item.stimulus)}</textarea>` : ""}
      ${kind === "shapes" ? `<textarea data-stim="shapes" style="font:1.2rem/1.4 var(--sym)">${esc(item.stimulus.text)}</textarea><small>Une ligne par rangée de matrice. Symboles : ● ○ ■ □ ▲ △ ▼ ▽ ◀ ◁ ▶ ▷ ◆ ◇ ◰ ◱ ◲ ◳ ↑ → ↓ ←</small>` : ""}
      ${kind === "chart" ? `<textarea data-stim="chart" class="mono" style="min-height:9rem">${esc(JSON.stringify(item.stimulus, null, 2))}</textarea><small>JSON : { "type": "chart", "kind": "bar" ou "line", "caption", "unit", "labels": [...], "series": [{ "name", "values": [...] }], "note" }. L'aperçu s'actualise quand le JSON est valide.</small>` : ""}
      ${kind === "table" ? `<input type="text" data-stim="caption" placeholder="Titre du tableau" value="${esc(item.stimulus.caption || "")}"><textarea data-stim="table" class="mono" style="min-height:7rem">${esc(tableToText(item.stimulus))}</textarea><small>Première ligne : en-têtes. Colonnes séparées par « | ». Les nombres sont détectés automatiquement.</small><input type="text" data-stim="note" placeholder="Note sous le tableau (facultatif)" value="${esc(item.stimulus.note || "")}">` : ""}
    </div>
    <div class="field" style="margin-top:var(--s3)"><span>Options ${isRating ? "(note de 1 à 4 ; une seule note 4, sur la réaction de référence)" : "(cochez la bonne réponse)"}</span>
      ${(item.options || []).map((o, i) => `<div class="editopt">
        <input type="radio" name="ed-correct" value="${i}" ${i === item.correctIndex ? "checked" : ""} aria-label="Bonne réponse : option ${i + 1}">
        <div class="stack"><input type="text" data-opt="${i}" value="${esc(o)}" ${isTfcs ? "readonly" : ""} aria-label="Texte de l'option ${i + 1}">
          <input type="text" data-why="${i}" value="${esc(item.optionRationales?.[i] || "")}" placeholder="Justification de l'option" aria-label="Justification de l'option ${i + 1}"></div>
        <div class="stack">${isRating ? `<select data-rate="${i}" aria-label="Note de l'option ${i + 1}">${[1, 2, 3, 4].map((v) => `<option ${item.ratings?.[i] === v ? "selected" : ""}>${v}</option>`).join("")}</select>` : ""}
          ${!isTfcs && item.options.length > 3 && !isRating ? `<button class="btn ghost" data-delopt="${i}" aria-label="Supprimer l'option ${i + 1}">✕</button>` : ""}</div></div>`).join("")}
      ${!isTfcs && item.options.length < 4 ? `<button class="btn secondary" data-addopt>Ajouter une option</button>` : ""}
    </div>
    <label class="field" style="margin-top:var(--s3)"><span>Explication</span><textarea data-f="explanation">${esc(item.explanation)}</textarea></label>
    <label class="field" style="margin-top:var(--s3)"><span>Notes de relecture</span><textarea data-f="reviewNotes" placeholder="Facultatif, conservé dans l'item">${esc(item.reviewNotes || "")}</textarea></label>`;

  const changed = (rerender) => { if (rerender) renderEditor(box, item, onChange, { lockId }); onChange(); };
  box.oninput = (e) => {
    const t = e.target;
    if (t.dataset.f) {
      const f = t.dataset.f;
      if (f === "difficulty" || f === "estimatedSeconds") item[f] = Number(t.value);
      else if (f === "reviewNotes") { if (t.value.trim()) item.reviewNotes = t.value; else delete item.reviewNotes; }
      else item[f] = t.value;
      if (f === "itemFormat") return applyFormat(item, t.value, () => changed(true));
      if (f === "language" && item.itemFormat === "tfcs") { item.options = [...TFCS[item.language]]; return changed(true); }
      return changed(false);
    }
    if (t.dataset.opt !== undefined) { item.options[Number(t.dataset.opt)] = t.value; return changed(false); }
    if (t.dataset.why !== undefined) {
      item.optionRationales = item.optionRationales || item.options.map(() => "");
      item.optionRationales[Number(t.dataset.why)] = t.value;
      if (item.optionRationales.every((x) => !x.trim())) delete item.optionRationales;
      return changed(false);
    }
    if (t.dataset.rate !== undefined) { item.ratings[Number(t.dataset.rate)] = Number(t.value); return changed(false); }
    if (t.name === "ed-correct") { item.correctIndex = Number(t.value); return changed(false); }
    if (t.dataset.stimKind !== undefined) {
      const k = t.value;
      item.stimulus = k === "none" ? null : k === "text" ? (typeof item.stimulus === "string" ? item.stimulus : "") : k === "shapes" ? { type: "shapes", text: item.stimulus?.text || "" } : k === "chart" ? { type: "chart", kind: "bar", caption: "Titre du graphique", labels: ["A", "B"], series: [{ name: "Série", values: [0, 0] }] } : { type: "table", headers: ["", ""], rows: [["", ""]] };
      return changed(true);
    }
    if (t.dataset.stim === "text") { item.stimulus = t.value; return changed(false); }
    if (t.dataset.stim === "shapes") { item.stimulus = { type: "shapes", text: t.value }; return changed(false); }
    if (t.dataset.stim === "table") { item.stimulus = textToTable(t.value, item.stimulus); return changed(false); }
    if (t.dataset.stim === "chart") { try { const v = JSON.parse(t.value); if (v && typeof v === "object") { item.stimulus = v; t.classList.remove("bad"); return changed(false); } } catch { t.classList.add("bad"); } return; }
    if (t.dataset.stim === "caption" || t.dataset.stim === "note") {
      const k = t.dataset.stim; if (t.value.trim()) item.stimulus[k] = t.value; else delete item.stimulus[k];
      return changed(false);
    }
  };
  box.onclick = (e) => {
    const t = e.target;
    if (t.dataset.addopt !== undefined) { item.options.push(""); if (item.optionRationales) item.optionRationales.push(""); changed(true); }
    if (t.dataset.delopt !== undefined) {
      const i = Number(t.dataset.delopt);
      item.options.splice(i, 1); item.optionRationales?.splice(i, 1);
      if (item.correctIndex >= item.options.length || item.correctIndex === i) item.correctIndex = 0;
      else if (item.correctIndex > i) item.correctIndex--;
      changed(true);
    }
  };
}
function applyFormat(item, fmt, done) {
  item.itemFormat = fmt;
  if (fmt === "tfcs") { item.options = [...TFCS[item.language || "fr"]]; if (item.correctIndex > 2) item.correctIndex = 0; if (item.optionRationales) item.optionRationales = item.optionRationales.slice(0, 3); delete item.ratings; }
  else {
    while (item.options.length < 4) item.options.push("");
    if (fmt === "rating") item.ratings = item.options.map((_, i) => (i === item.correctIndex ? 4 : 1));
    else delete item.ratings;
  }
  done();
}

/* ---------- New item ---------- */
function newItem(cat) {
  const rules = catRules(cat);
  const stamp = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const existing = new Set([...allApproved(), ...S.cands.map((c) => c.item)].map((x) => x.id));
  let n = 1, id;
  do { id = `${cat}-man${stamp}-${String(n++).padStart(3, "0")}`; } while (existing.has(id));
  const fmt = rules.formats[0];
  const item = {
    id, version: 1, category: cat, itemFormat: fmt, skill: rules.skills[0], difficulty: 1, language: "fr", estimatedSeconds: 60,
    prompt: "", stimulus: cat === "abstract" ? { type: "shapes", text: "" } : "", options: fmt === "tfcs" ? [...TFCS.fr] : ["", "", "", ""],
    correctIndex: 0, explanation: "", sourceType: "original_human", reviewStatus: "candidate", createdAt: nowIso(),
  };
  if (fmt === "rating") item.ratings = [4, 1, 2, 3];
  const file = "(nouvelles questions)";
  addCandidates(file, [item], null);
  S.sel.queue = `${file}::${id}`;
  $("#qstate").value = ""; $("#qcat").value = "";
  persist(); renderAll();
}

/* ---------- Bank ---------- */
function renderStats() {
  const all = allApproved();
  const card = (n, l) => `<div class="stat"><strong>${n}</strong><span>${l}</span></div>`;
  let html = card(all.length, "questions approuvées");
  for (const c of CATS) {
    const items = S.approved[c] || [];
    const rules = catRules(c);
    const counts = rules.skills.map((s) => [s, items.filter((x) => x.skill === s).length]);
    const max = Math.max(1, ...counts.map((x) => x[1]));
    const diff = [1, 2, 3].map((d) => items.filter((x) => x.difficulty === d).length).join(" / ");
    const longest = items.filter((x) => x.itemFormat !== "tfcs" && x.options[x.correctIndex]?.length === Math.max(...x.options.map((o) => o.length))).length;
    const warn = items.reduce((n, x) => n + checks(x).warnings.length, 0);
    html += `<div class="stat"><strong>${items.length}</strong><span>${esc(CAT_LABEL[c])} · difficulté 1/2/3 : ${diff}</span>
      <div class="bars" style="margin-top:var(--s2)">${counts.map(([s, n]) => `<div class="bar ${n ? "" : "zero"}"><span>${esc(SKILL_LABEL[s] || s)}</span><i style="width:${(n / max) * 100}%"></i><span>${n}</span></div>`).join("")}</div>
      <span>Bonne réponse la plus longue : ${longest} · alertes : ${warn}</span></div>`;
  }
  const pairs = [];
  for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) {
    const sim = R.similarity(R.itemText(all[i]), R.itemText(all[j]));
    if (sim >= 0.55) pairs.push(`${all[i].id} ≈ ${all[j].id} (${Math.round(sim * 100)} %)`);
  }
  html += `<div class="stat"><strong>${pairs.length}</strong><span>paires de questions très proches</span>${pairs.slice(0, 6).map((p) => `<div class="msg warning" style="margin-top:4px">${esc(p)}</div>`).join("")}</div>`;
  $("#stats").innerHTML = html;
}
function renderBank() {
  const cat = $("#bcat").value, d = $("#bdiff").value, q = $("#bsearch").value.toLowerCase();
  const list = CATS.filter((c) => !cat || c === cat).flatMap((c) => S.approved[c] || []).filter((x) => (!d || String(x.difficulty) === d) && (!q || `${x.id} ${x.prompt} ${R.itemText(x)}`.toLowerCase().includes(q)));
  $("#bankcount").textContent = allApproved().length;
  S.bankVisible = list.map((x) => x.id);
  for (const id of [...S.bankSel]) if (!allApproved().some((x) => x.id === id)) S.bankSel.delete(id);
  $("#bank").innerHTML = list.length ? list.map((x) => `<div class="selrow"><input type="checkbox" data-sel="${esc(x.id)}" ${S.bankSel.has(x.id) ? "checked" : ""} aria-label="Sélectionner ${esc(x.id)}"><button class="row" data-bid="${esc(x.id)}" aria-current="${x.id === S.sel.bank}"><span class="id">${esc(x.id)} · v${esc(x.version)}</span><span class="p">${esc(x.prompt)}</span><span class="chips"><span class="chip">${esc(SKILL_LABEL[x.skill] || x.skill)}</span><span class="chip">diff. ${esc(x.difficulty)}</span>${pendingRevision(x.id) ? `<span class="chip info">révision en attente</span>` : ""}${isModified(x) ? `<span class="chip warn">modifié</span>` : ""}${checkChip(x)}</span></button></div>`).join("") : `<p class="empty">Aucune question pour ces filtres.</p>`;
  renderBulkBar();
  renderStats();
}
function pendingRevision(id) { return S.cands.some((c) => c.item.revisionOf === id && !c.decision); }
function visibleSelection() { return [...S.bankSel].filter((id) => (S.bankVisible || []).includes(id)); }
function renderBulkBar() {
  const n = visibleSelection().length, hidden = S.bankSel.size - n;
  $("#bulkbar").innerHTML = `<span class="chip ${n ? "info" : ""}">${n} sélectionnée(s)${hidden ? ` · ${hidden} masquée(s) par le filtre, non concernée(s)` : ""}</span>
    <button class="btn ghost" data-bulk="visible">Tout (filtre)</button><button class="btn ghost" data-bulk="warn">Avec alertes</button><button class="btn ghost" data-bulk="none" ${n ? "" : "disabled"}>Aucune</button>
    <button class="btn" data-bulk="regen" ${n ? "" : "disabled"}>Régénérer avec l'IA</button><button class="btn danger" data-bulk="remove" ${n ? "" : "disabled"}>Retirer</button>`;
}
function bulkAction(kind) {
  if (kind === "visible") (S.bankVisible || []).forEach((id) => S.bankSel.add(id));
  if (kind === "warn") allApproved().filter((x) => (S.bankVisible || []).includes(x.id) && checks(x).warnings.length).forEach((x) => S.bankSel.add(x.id));
  if (kind === "none") S.bankSel.clear();
  const ids = visibleSelection();
  if (kind === "regen") return openAi({ kind: "revise", ids });
  if (kind === "remove") {
    const who = reviewer();
    if (who.length < 2) { $("#reviewer").focus(); return toast("Indiquez votre nom de relecteur."); }
    if (!confirm(`Retirer ${ids.length} question(s) de la banque approuvée ?\n${ids.join(", ")}`)) return;
    for (const id of ids) {
      const x = allApproved().find((i) => i.id === id);
      if (!x) continue;
      S.approved[x.category] = S.approved[x.category].filter((i) => i.id !== id);
      S.removed.add(id);
      S.log.push({ id, decision: "removed", reviewer: who, at: nowIso() });
    }
    toast(`${ids.length} question(s) retirée(s)`); ids.forEach((id) => S.bankSel.delete(id)); S.sel.bank = null; S.bankDraft = null; persist(); renderAll(); return;
  }
  renderBank();
}
function isModified(x) { const orig = JSON.parse(S.approvedOrig[x.category] || "[]").find((o) => o.id === x.id); return !orig || JSON.stringify(orig) !== JSON.stringify(x); }
function renderBankDetail() {
  const box = $("#bdetail");
  const x = allApproved().find((i) => i.id === S.sel.bank);
  if (!x) { box.innerHTML = `<p class="empty">Sélectionnez une question approuvée pour la consulter ou la modifier.</p>`; S.bankDraft = null; return; }
  if (!S.bankDraft || S.bankDraft.id !== x.id) S.bankDraft = clone(x);
  const draft = S.bankDraft;
  const dirty = JSON.stringify(draft) !== JSON.stringify(x);
  box.innerHTML = `<div class="detailhead"><div><div class="mono">${esc(x.id)} · version ${esc(x.version)}</div><small>Approuvé par ${esc(x.reviewer)} le ${esc((x.reviewedAt || "").slice(0, 10))}</small></div>
      <div class="actions"><button class="btn" id="bsave" ${dirty ? "" : "disabled"}>Enregistrer la modification</button><button class="btn secondary" id="bcancel" ${dirty ? "" : "disabled"}>Annuler</button><button class="btn secondary" id="bregen">Régénérer avec l'IA</button><button class="btn danger" id="bremove">Retirer de la banque</button></div></div>
    <div class="panel" style="margin-top:var(--s3)"><div class="section-title">Aperçu</div><div id="b-preview" class="preview"></div></div>
    <div class="panel"><div class="section-title">Contrôles automatiques</div><div id="b-checks" class="msgs"></div></div>
    <div class="panel"><details><summary>Modifier la question</summary><div id="b-editor" style="margin-top:var(--s3)"></div></details></div>`;
  const refresh = () => {
    $("#b-preview").innerHTML = previewHtml(draft, { blind: false, mine: null, showKey: true });
    $("#b-checks").innerHTML = msgList(checks({ ...draft, reviewStatus: "approved", reviewer: draft.reviewer || "x", reviewedAt: draft.reviewedAt || nowIso() }), dupMsgs(draft, draft.id));
    const d = JSON.stringify(draft) !== JSON.stringify(x);
    $("#bsave").disabled = !d; $("#bcancel").disabled = !d;
  };
  renderEditor($("#b-editor"), draft, refresh, { lockId: true });
  refresh();
  $("#bcancel").onclick = () => { S.bankDraft = null; renderBankDetail(); };
  $("#bregen").onclick = () => openAi({ kind: "revise", ids: [x.id] });
  $("#bsave").onclick = () => {
    const who = reviewer();
    if (who.length < 2) { $("#reviewer").focus(); return toast("Indiquez votre nom de relecteur."); }
    const updated = { ...clone(draft), version: (x.version || 1) + 1, reviewStatus: "approved", reviewer: who, reviewedAt: nowIso() };
    const r = checks(updated);
    if (r.errors.length) return toast(`Enregistrement impossible : ${r.errors[0]}`);
    const list = S.approved[x.category];
    list[list.findIndex((i) => i.id === x.id)] = updated;
    S.log.push({ id: x.id, decision: "modified", reviewer: who, at: updated.reviewedAt, version: updated.version, hash: R.contentHash(updated) });
    S.bankDraft = null; toast(`${x.id} mis à jour (version ${updated.version})`); persist(); renderAll();
  };
  $("#bremove").onclick = () => {
    if (!confirm(`Retirer ${x.id} de la banque approuvée ?`)) return;
    const who = reviewer();
    if (who.length < 2) { $("#reviewer").focus(); return toast("Indiquez votre nom de relecteur."); }
    S.approved[x.category] = S.approved[x.category].filter((i) => i.id !== x.id);
    S.removed.add(x.id);
    S.log.push({ id: x.id, decision: "removed", reviewer: who, at: nowIso() });
    S.sel.bank = null; S.bankDraft = null; toast(`${x.id} retiré`); persist(); renderAll();
  };
}

/* ---------- Export ---------- */
function changes() {
  const cats = CATS.filter((c) => JSON.stringify(S.approved[c] || []) !== S.approvedOrig[c]);
  const files = Object.entries(S.files).map(([name, f]) => {
    const remaining = S.cands.filter((c) => c.file === name && !c.decision).map((c) => c.item);
    const decided = S.cands.filter((c) => c.file === name && c.decision).length;
    return { name, remaining, decided, hasReview: f.hasReview, isNew: f.isNew };
  }).filter((f) => f.decided || f.isNew || f.name === "(nouvelles questions)" || S.cands.some((c) => c.file === f.name && c.item !== undefined && c.orig !== JSON.stringify(c.item)));
  return { cats, files };
}
function stamp() { return new Date().toISOString().replace(/[:.]/g, "-").replace(/Z$/, ""); }
function pendingLog() {
  return S.log.slice(S.exportedLogCount);
}
function exportPlan() {
  const { cats, files } = changes();
  const out = [];
  for (const c of cats) out.push({ path: `data/approved/${c}.json`, content: JSON.stringify(S.approved[c], null, 2) + "\n" });
  const deletes = [];
  for (const f of files) {
    if (f.name === "(nouvelles questions)") {
      if (f.remaining.length) out.push({ path: `generated/manual-${stamp()}.json`, content: JSON.stringify(f.remaining, null, 2) + "\n" });
    } else if (f.remaining.length) out.push({ path: `generated/${f.name}`, content: JSON.stringify(f.remaining, null, 2) + "\n" });
    else if (!f.isNew) { deletes.push(`generated/${f.name}`); if (f.hasReview) deletes.push(`generated/${f.name.replace(/\.json$/, ".review.json")}`); }
  }
  const decisions = pendingLog();
  if (decisions.length) out.push({ path: `data/review-log/${stamp()}.json`, content: JSON.stringify({ reviewer: reviewer(), exportedAt: nowIso(), mode: S.mode, decisions }, null, 2) + "\n" });
  return { cats, files, out, deletes };
}
function renderExport() {
  const plan = exportPlan();
  const n = plan.cats.length + plan.deletes.length + plan.files.filter((f) => f.remaining.length).length;
  $("#changecount").textContent = plan.cats.length;
  const pending = pendingLog();
  const approvedN = pending.filter((l) => l.decision === "approved").length, rejectedN = pending.filter((l) => l.decision === "rejected").length;
  const server = S.mode === "server";
  $("#exportpanel").innerHTML = `
    <div class="notice">${server ? "Mode local (<code>npm run admin</code>) : les fichiers sont écrits directement dans le dépôt, puis les banques générées sont resynchronisées. Il ne vous reste qu'à committer." : "Mode hors ligne : téléchargez l'archive, décompressez-la à la racine du dépôt (elle remplace les fichiers concernés), supprimez les fichiers candidats traités, puis lancez <code>npm run build:bank &amp;&amp; npm test</code> et committez."}</div>
    <div class="stats">
      <div class="stat"><strong>${approvedN}</strong><span>item(s) approuvé(s)</span></div>
      <div class="stat"><strong>${rejectedN}</strong><span>item(s) rejeté(s)</span></div>
      <div class="stat"><strong>${pending.filter((l) => l.decision === "modified").length}</strong><span>question(s) modifiée(s)</span></div>
      <div class="stat"><strong>${S.removed.size}</strong><span>question(s) retirée(s)</span></div>
    </div>
    <h2 style="margin:var(--s4) 0 var(--s2)">Fichiers concernés</h2>
    <div class="files">${plan.out.map((f) => `<div class="file"><code>${esc(f.path)}</code><span class="actions"><span class="chip info">${f.path.startsWith("data/approved") ? "remplacé" : "écrit"}</span>${server ? "" : `<button class="btn ghost" data-dl="${esc(f.path)}">Télécharger</button>`}</span></div>`).join("")}
      ${plan.deletes.map((p) => `<div class="file"><code>${esc(p)}</code><span class="chip ko">${server ? "supprimé" : "à supprimer"}</span></div>`).join("")}
      ${n || pending.length ? "" : `<p class="empty">Aucune modification pour l'instant.</p>`}</div>
    <div class="actions" style="margin-top:var(--s4)">
      ${server ? `<button class="btn" id="save" ${n || pending.length ? "" : "disabled"}>Enregistrer dans le dépôt</button><button class="btn secondary" id="reloadsrv">Recharger depuis le disque</button>` : `<button class="btn" id="zip" ${plan.out.length ? "" : "disabled"}>Télécharger l'archive (.zip)</button><button class="btn secondary" id="clearsession">Effacer la session locale</button>`}
    </div>
    ${server ? "" : `<pre class="cmd">${esc([...plan.deletes.map((p) => `git rm -q --ignore-unmatch ${p}`), "npm run build:bank && npm test", 'git add data bank/app-bank.js bank/admin-bank.js && git commit -m "feat: review question bank"'].join("\n"))}</pre>`}
    ${server ? tasksHtml() : ""}`;
  $$("[data-dl]").forEach((b) => (b.onclick = () => { const f = plan.out.find((x) => x.path === b.dataset.dl); download(f.path.split("/").pop(), new Blob([f.content], { type: "application/json" })); }));
  if ($("#zip")) $("#zip").onclick = () => {
    download(`eag-banque-${stamp()}.zip`, zip(plan.out));
    // Keep the audit history locally, but subsequent exports include only decisions
    // made after this archive. Re-exporting changed bank files is harmless because
    // their earlier decisions already live in the first archive.
    S.exportedLogCount = S.log.length;
    persist(); renderAll(); toast("Archive téléchargée");
  };
  if ($("#clearsession")) $("#clearsession").onclick = () => { if (confirm("Effacer la session locale (candidats chargés et décisions non exportées) ?")) { store(STORE_KEY); location.reload(); } };
  if ($("#save")) $("#save").onclick = () => saveToServer(plan);
  if ($("#reloadsrv")) $("#reloadsrv").onclick = async () => { await reloadFromServer(); S.log = []; S.exportedLogCount = 0; renderAll(); toast("Données rechargées"); };
  if (server) bindTasks();
}
function download(name, blob) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = name; document.body.append(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}

/* Minimal ZIP writer (store, no compression). */
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
  return new Blob([...parts, ...central, e], { type: "application/zip" });
}

/* ---------- Server-only: save and tasks ---------- */
async function saveToServer(plan) {
  if (reviewer().length < 2) { $("#reviewer").focus(); return toast("Indiquez votre nom de relecteur."); }
  const { files } = changes();
  const candidates = {};
  for (const f of files) {
    if (f.name === "(nouvelles questions)") continue;
    if (f.isNew && !f.remaining.length) continue;
    candidates[f.name] = f.remaining.length ? f.remaining : null;
  }
  const manual = files.find((f) => f.name === "(nouvelles questions)")?.remaining || [];
  const approved = Object.fromEntries(plan.cats.map((c) => [c, S.approved[c]]));
  try {
    $("#save").disabled = true;
    const res = await api("/api/save", { workspaceRevision: S.workspaceRevision, approved, candidates, manual, log: { reviewer: reviewer(), decisions: S.log } });
    toast(`Enregistré : ${res.written.length} fichier(s) écrit(s), ${res.deleted.length} supprimé(s)`);
    S.log = []; S.exportedLogCount = 0;
    await reloadFromServer(); renderAll();
    taskOutput(`✅ Enregistré.\nÉcrits : ${res.written.join(", ") || "—"}\nSupprimés : ${res.deleted.join(", ") || "—"}\n${res.build}`);
  } catch (e) { toast("Échec de l'enregistrement"); taskOutput(`❌ ${e.message}`); $("#save").disabled = false; }
}
function tasksHtml() {
  const files = Object.keys(S.files).filter((f) => f !== "(nouvelles questions)");
  return `<h2 style="margin:var(--s4) 0 var(--s2)">Tâches</h2>
    <div class="grid2">
      <div class="panel"><div class="section-title">Générer des candidats</div>
        ${S.aiConfigured ? "" : `<div class="msg warning">AI_API_URL / AI_API_KEY / AI_MODEL absents du fichier <code>.env</code>.</div>`}
        <div class="actions" style="margin-top:var(--s2)"><button class="btn" data-ai="generate">Générer de nouvelles questions…</button><button class="btn secondary" data-ai="rebuild">Reconstruire une catégorie…</button></div></div>
      <div class="panel"><div class="section-title">Revue IA aveugle</div>
        <div class="actions"><select id="rfile">${files.map((f) => `<option>${esc(f)}</option>`).join("") || "<option value=''>Aucun fichier</option>"}</select><button class="btn" data-task="review" ${S.aiConfigured && files.length ? "" : "disabled data-off"}>Lancer la revue</button></div></div>
      <div class="panel"><div class="section-title">Contrôles</div>
        <div class="actions"><button class="btn secondary" data-task="test">npm test</button><button class="btn secondary" data-task="git">État Git</button></div></div>
    </div>
    <pre class="cmd" id="taskout" aria-live="polite">Résultat des tâches…</pre>`;
}
function taskOutput(t) { const o = $("#taskout"); if (o) o.textContent = t; }
function bindTasks() {
  $$("[data-ai]").forEach((b) => (b.onclick = () => openAi({ kind: b.dataset.ai })));
  $$("[data-task]").forEach((b) => (b.onclick = async () => {
    if (S.busy) return toast("Une tâche est déjà en cours.");
    const task = b.dataset.task;
    const body = { task };
    if (task === "review") body.file = $("#rfile").value;
    S.busy = true; $$("[data-task]").forEach((x) => (x.disabled = true));
    taskOutput(`⏳ ${task}…`);
    try {
      const r = await api("/api/run", body);
      taskOutput(`${r.code === 0 ? "✅" : "❌"} ${task} (code ${r.code})\n\n${r.output}`);
      if (task === "review") { await mergeFromServer(); renderAll(); taskOutput(`${r.code === 0 ? "✅" : "❌"} ${task} (code ${r.code})\n\n${r.output}`); }
    } catch (e) { taskOutput(`❌ ${e.message}`); }
    S.busy = false; $$("[data-task]:not([data-off])").forEach((x) => (x.disabled = false));
  }));
}

/* ---------- AI dialog: regenerate one / a selection, generate, rebuild a category ---------- */
const PRESETS = [
  "Corriger les problèmes signalés et lever toute ambiguïté.",
  "Équilibrer la longueur des options pour que la bonne réponse ne se remarque pas.",
  "Rendre la question plus difficile (une étape de raisonnement en plus).",
  "Rendre la question plus accessible, sans la rendre évidente.",
  "Ajouter une justification claire pour chaque option.",
];
const REBUILD_NOTE = "Lot de remplacement complet pour cette catégorie : couvrez toutes les compétences autorisées de manière équilibrée et répartissez les difficultés ; n'imitez pas les questions existantes listées.";
function aiPrompt(o) {
  const instruction = o.instruction || "";
  if (o.kind === "revise") {
    const originals = o.ids.map((id) => allApproved().find((x) => x.id === id)).filter(Boolean);
    return R.fillTemplate(PROMPTS.revise, {
      INSTRUCTION: instruction || "Corriger les problèmes signalés et améliorer la clarté, sans changer ce qui fonctionne.",
      SCHEMA_JSON: JSON.stringify(SCHEMA),
      ITEMS_JSON: JSON.stringify(originals.map((x) => R.revisionContext(SCHEMA, x)), null, 1),
    });
  }
  const now = nowIso();
  return R.fillTemplate(PROMPTS.generate, {
    CATEGORY: o.category, COUNT: String(o.count), SKILLS: catRules(o.category).skills.join(", "), DIFFICULTY_MIX: "", LANGUAGE: "fr",
    ID_PREFIX: `${o.category}-chat${now.slice(2, 10).replace(/-/g, "")}${now.slice(11, 13)}${now.slice(14, 16)}`, NOW_ISO: now,
    EXTRA_INSTRUCTIONS: [o.kind === "rebuild" ? REBUILD_NOTE : "", instruction].filter(Boolean).join(" ") || "(aucune)",
    EXISTING_TOPICS: (S.approved[o.category] || []).map((x) => `- ${x.prompt}`).join("\n") || "(aucun)",
    SCHEMA_JSON: JSON.stringify(SCHEMA),
  });
}
function openAi(o) {
  const dlg = $("#aidlg");
  const kind = o.kind;
  const server = S.mode === "server" && S.aiConfigured;
  const title = kind === "revise" ? `Régénérer ${o.ids.length} question(s) avec l'IA` : kind === "rebuild" ? "Reconstruire une catégorie avec l'IA" : "Générer de nouvelles questions avec l'IA";
  const intro = kind === "revise"
    ? "Chaque question est renvoyée au modèle avec les problèmes détectés et votre consigne. Les versions proposées arrivent dans la file de relecture comme <strong>révisions</strong> : rien ne change dans la banque tant que vous ne les approuvez pas."
    : kind === "rebuild"
      ? "Le modèle produit un nouveau lot complet pour la catégorie. Approuvez les questions que vous gardez dans la file de relecture, puis retirez les anciennes dans la banque (sélection puis « Retirer »)."
      : "Le modèle produit de nouveaux candidats, qui arrivent dans la file de relecture.";
  dlg.innerHTML = `<form method="dialog" class="dlg">
    <div class="detailhead"><h2>${esc(title)}</h2><button class="btn ghost" value="close" aria-label="Fermer">✕</button></div>
    <p class="msg note">${intro}</p>
    ${kind === "revise" ? `<p class="mono" style="margin:var(--s2) 0">${esc(o.ids.join(", "))}</p>` : `<div class="actions" style="margin:var(--s3) 0"><label class="field"><span>Catégorie</span><select id="ai-cat">${CATS.map((c) => `<option value="${c}" ${c === (o.category || $("#bcat").value) ? "selected" : ""}>${esc(CAT_LABEL[c])}</option>`).join("")}</select></label><label class="field"><span>Nombre</span><input type="number" id="ai-count" min="1" max="50" value="${kind === "rebuild" ? 10 : 5}" style="width:6rem"></label></div>`}
    <label class="field"><span>Consigne pour le modèle (facultative)</span><textarea id="ai-instr" placeholder="Ex. : rendre les distracteurs plus plausibles"></textarea></label>
    <div class="chips" style="margin:var(--s2) 0">${PRESETS.map((p, i) => `<button type="button" class="chip info" data-preset="${i}">${esc(p)}</button>`).join("")}</div>
    ${server ? `<div class="actions" style="margin:var(--s3) 0"><button type="button" class="btn" id="ai-run">Lancer avec l'IA</button><span class="chip">Revue IA aveugle lancée automatiquement ensuite</span></div><pre class="cmd" id="ai-out" hidden></pre>`
      : `<div class="msg ${S.mode === "server" ? "warning" : "note"}">${S.mode === "server" ? "Aucune API configurée dans <code>.env</code> : utilisez le copier-coller ci-dessous." : "Mode hors ligne : copiez le prompt dans votre chat IA (ChatGPT, Claude, Gemini, Le Chat…), puis collez sa réponse JSON."}</div>`}
    <details ${server ? "" : "open"} style="margin-top:var(--s3)"><summary>Copier-coller avec un chat IA</summary>
      <div class="actions" style="margin:var(--s2) 0"><button type="button" class="btn secondary" id="ai-copy">Copier le prompt</button><small id="ai-size"></small></div>
      <textarea id="ai-prompt" readonly class="mono" style="min-height:6rem"></textarea>
      <label class="field" style="margin-top:var(--s3)"><span>Réponse JSON du chat</span><textarea id="ai-answer" class="mono" placeholder="[ { ... } ]" style="min-height:6rem"></textarea></label>
      <div class="actions" style="margin-top:var(--s2)"><button type="button" class="btn" id="ai-import">Importer dans la file de relecture</button></div>
      <div id="ai-msgs" class="msgs" style="margin-top:var(--s2)"></div>
    </details>
  </form>`;
  const params = () => ({ ...o, instruction: $("#ai-instr").value.trim(), category: $("#ai-cat")?.value || o.category, count: Math.min(50, Math.max(1, Number($("#ai-count")?.value) || 5)) });
  const refreshPrompt = () => { const t = aiPrompt(params()); $("#ai-prompt").value = t; $("#ai-size").textContent = `${Math.round(t.length / 1000)} k caractères`; };
  dlg.oninput = (e) => { if (["ai-instr", "ai-cat", "ai-count"].includes(e.target.id)) refreshPrompt(); };
  dlg.onchange = dlg.oninput;
  $$("[data-preset]", dlg).forEach((b) => (b.onclick = () => { const t = $("#ai-instr"); t.value = [t.value.trim(), PRESETS[Number(b.dataset.preset)]].filter(Boolean).join(" "); refreshPrompt(); }));
  $("#ai-copy").onclick = async () => {
    const t = $("#ai-prompt");
    try { await navigator.clipboard.writeText(t.value); } catch (e) { t.select(); document.execCommand("copy"); }
    toast("Prompt copié");
  };
  $("#ai-import").onclick = () => importAiAnswer(params());
  if ($("#ai-run")) $("#ai-run").onclick = () => runAi(params());
  refreshPrompt();
  if (!dlg.open) dlg.showModal();
}
function importAiAnswer(o) {
  const msgs = $("#ai-msgs");
  let data;
  try { data = R.extractJson($("#ai-answer").value); } catch (e) { msgs.innerHTML = `<div class="msg error">JSON illisible : ${esc(e.message)}</div>`; return; }
  const originals = o.kind === "revise" ? o.ids.map((id) => allApproved().find((x) => x.id === id)).filter(Boolean) : [];
  const { items, problems } = R.prepareCandidates(data, { mode: o.kind === "revise" ? "revise" : "new", originals, now: nowIso(), language: "fr" });
  if (!items.length) { msgs.innerHTML = problems.map((p) => `<div class="msg error">${esc(p)}</div>`).join("") || `<div class="msg error">Aucun item exploitable.</div>`; return; }
  if (o.kind === "revise") S.bankSel.clear();
  const file = `chat-${o.kind === "revise" ? "revise" : o.category}-${stamp()}.json`;
  addCandidates(file, items, null, true);
  const bad = items.filter((x) => checks(x).errors.length).length;
  S.sel.queue = `${file}::${items[0].id}`;
  persist(); renderAll(); setTab("queue");
  $("#aidlg").close();
  toast(`${items.length} item(s) importé(s)${bad ? `, dont ${bad} avec erreurs à corriger` : ""}${problems.length ? ` · ${problems.length} avertissement(s)` : ""}`);
}
async function runAi(o) {
  if (S.busy) return toast("Une tâche est déjà en cours.");
  const out = $("#ai-out");
  const body = o.kind === "revise" ? { task: "revise", ids: o.ids, instruction: o.instruction } : { task: o.kind, category: o.category, count: o.count, instruction: o.instruction };
  S.busy = true; $("#ai-run").disabled = true; out.hidden = false; out.textContent = "⏳ Appel du modèle puis revue aveugle… (cela peut prendre une minute)";
  try {
    const r = await api("/api/run", body);
    out.textContent = `${r.code === 0 ? "✅" : "❌"} code ${r.code}\n\n${r.output}`;
    if (r.code === 0) {
      const fresh = (await mergeFromServer())[0];
      if (fresh) { const first = S.cands.find((c) => c.file === fresh); if (first) S.sel.queue = first.key; }
      if (o.kind === "revise") S.bankSel.clear();
      renderAll(); setTab("queue"); $("#aidlg").close();
      toast("Nouveaux candidats dans la file de relecture");
    }
  } catch (e) { out.textContent = `❌ ${e.message}`; }
  S.busy = false; if ($("#ai-run")) $("#ai-run").disabled = false;
}

/* ---------- Shell ---------- */
function renderAll() {
  renderQueue(); renderDetail(); renderBank(); renderBankDetail(); renderExport();
  $("#queuecount").textContent = S.cands.filter((c) => !c.decision).length;
}
function setTab(t) {
  S.tab = t;
  $$("[data-tab]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.tab === t)));
  $$(".view").forEach((v) => v.classList.toggle("active", v.id === `v-${t}`));
}
async function init() {
  if (!R || !SCHEMA.allOf) {
    // R comes from shared/item-rules.js, the bank data from bank/admin-bank.js:
    // name the actual missing piece instead of a generic message.
    const missing = !R
      ? { title: "Règles de validation indisponibles", hint: `Vérifiez que <code>shared/item-rules.js</code> est présent, puis rechargez la page.` }
      : { title: "Données d'administration indisponibles", hint: `Vérifiez que <code>bank/admin-bank.js</code> est présent, non vide et à jour, puis lancez <code>npm run build:bank</code> si nécessaire.` };
    document.body.innerHTML = `<main class="empty" role="alert"><h1>${missing.title}</h1><p>${missing.hint}</p></main>`;
    return;
  }
  const catOpts = CATS.map((c) => `<option value="${c}">${esc(CAT_LABEL[c])}</option>`).join("");
  $("#qcat").insertAdjacentHTML("beforeend", catOpts); $("#bcat").insertAdjacentHTML("beforeend", catOpts); $("#newcat").innerHTML = catOpts;
  $("#reviewer").value = load("eag-admin-reviewer") || "";
  $("#reviewer").oninput = (e) => store("eag-admin-reviewer", e.target.value.trim());
  const dark = load("eag-admin-dark") ?? matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  $("#theme").onclick = () => { const d = document.documentElement.dataset.theme !== "dark"; document.documentElement.dataset.theme = d ? "dark" : "light"; store("eag-admin-dark", d); };
  $$("[data-tab]").forEach((b) => (b.onclick = () => setTab(b.dataset.tab)));
  $("#queue").onclick = (e) => { const b = e.target.closest("[data-key]"); if (b) { S.sel.queue = b.dataset.key; renderQueue(); renderDetail(); } };
  $("#bank").onclick = (e) => {
    const sel = e.target.closest("[data-sel]");
    if (sel) { if (sel.checked) S.bankSel.add(sel.dataset.sel); else S.bankSel.delete(sel.dataset.sel); renderBulkBar(); return; }
    const b = e.target.closest("[data-bid]"); if (b) { S.sel.bank = b.dataset.bid; S.bankDraft = null; renderBank(); renderBankDetail(); }
  };
  $("#bulkbar").onclick = (e) => { const b = e.target.closest("[data-bulk]"); if (b) bulkAction(b.dataset.bulk); };
  $("#aigen").onclick = () => openAi({ kind: "generate" });
  $("#airebuild").onclick = () => openAi({ kind: "rebuild" });
  ["#qcat", "#qstate", "#qai"].forEach((s) => ($(s).onchange = renderQueue));
  ["#bcat", "#bdiff"].forEach((s) => ($(s).onchange = renderBank));
  $("#bsearch").oninput = renderBank;
  $("#newitem").onclick = () => newItem($("#newcat").value);
  $("#files").onchange = (e) => { readFiles([...e.target.files]); e.target.value = ""; };
  const drop = $("#drop");
  drop.ondragover = (e) => { e.preventDefault(); drop.classList.add("over"); };
  drop.ondragleave = () => drop.classList.remove("over");
  drop.ondrop = (e) => { e.preventDefault(); drop.classList.remove("over"); readFiles([...e.dataTransfer.files]); };

  setApproved(APPROVED_EMBEDDED);
  if (await detectServer()) {
    $(".brand small").textContent = "Mode local (npm run admin) · lecture et écriture dans le dépôt";
    $("#drop").innerHTML = `<strong>Candidats chargés depuis <code>generated/</code></strong><span>Utilisez l'onglet Exporter pour générer ou relire de nouveaux lots.</span>`;
    window.addEventListener("focus", refreshServerView);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) refreshServerView(); });
  } else {
    const saved = load(STORE_KEY);
    if (saved && (saved.cands?.length || saved.log?.length)) {
      const b = $("#restore");
      b.hidden = false; b.textContent = `Reprendre la session du ${new Date(saved.savedAt).toLocaleString("fr-FR")}`;
      b.onclick = () => { if (restore(saved)) { b.hidden = true; toast("Session restaurée"); } };
    }
  }
  renderAll();
}
init();
