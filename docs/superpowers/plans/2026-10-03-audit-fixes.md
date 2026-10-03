# Audit Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix every actionable finding from the 2026-10-03 audit (review-log gate logic, write durability/concurrency, admin UI XSS, timer/calculator, metadata & docs) while keeping `npm test` green after every task.

**Architecture:** The review gate (`scripts/check-review-log.mjs`) gets a pure, testable core (`checkReviewLogData`) plus parsed-instant ordering and `undone` lifecycle resets. Writes become atomic (temp file + rename in `scripts/lib/file-transaction.mjs`) and mutually exclusive (new `scripts/lib/lockfile.mjs`, used by the admin server save and `promote-candidate`). Admin UI gets the merge guard, XSS escapes, and aria sync. Metadata/docs get corrected and the version bumped to 1.7.0.

**Tech Stack:** Plain Node ESM (`.mjs`, no new dependencies), browser classic scripts (`app.js`, `admin.js`, `shared/*.js`), selftests in `scripts/selftest-*.mjs` (no framework), GitHub Actions YAML.

**Spec:** The audit findings (conversation of 2026-10-03); the authoritative finding list is reproduced per-task below.

## Global Constraints

- No new npm dependencies (runtime stays zero-dep; devDeps unchanged).
- All new user-facing error messages in French, matching the existing tone (`scripts/check-review-log.mjs` style).
- Selftests follow the existing pattern: plain `.mjs`, `throw new Error(...)` on failure, `console.log("... self-test passed ...")` on success; registered in the `test` script of `package.json` when a new file is created.
- Never edit the generated data blocks in `app.js`/`admin.js` (between `*_START`/`*_END` markers); hand-written regions only. If a task edits admin.js/app.js hand-written code, run `npm run build:bank -- --check` to confirm no drift.
- `npm test` must pass at the end of every task.
- Work directly on a branch `fix/audit-findings` created from `main` (no worktree needed; single implementer).

## Review Focus

- Mixed timezone formats (`+02:00` vs `Z` on the same day) must order by real instant, not string → pinned by selftest-review-log Task 1.
- An `undone` decision must reset the lifecycle so approve→undo→save does not fail CI with « disparu de la banque… » → pinned by selftest-review-log Task 1 and Task 4 (server accepts `undone` as removal authorization).
- Untrusted candidate content (e.g. `"ratings": ["<img src=x onerror=…>"]`) must never reach innerHTML unescaped → pinned by string-level assertion in selftest-admin Task 5.
- A concurrent writer (CLI promote while admin save runs) must not silently lose writes → pinned by lock self-test Task 3.
- A crash (not just a throw) must not leave truncated JSON → pinned by atomic-write test in selftest-transaction Task 2.

---

### Task 1: Review-log gate — parsed instants, `undone` reset, `reviewedAt` cross-check, testable core

**Files:**
- Modify: `scripts/check-review-log.mjs` (whole file, ~111 lines)
- Modify: `scripts/selftest-review-log.mjs`

**Interfaces:**
- Produces (consumed by Task 4's server and the selftests):
  - `checkReviewLogData(approvedItems: object[], logs: {file: string, log: object}[]) -> { errors: string[], checked: number, entries: number }` — pure core.
  - `checkReviewLog()` — unchanged public shape (now delegates to the core).
  - `approvingDecisionErrors(d)`, `removalDecisionErrors(d)`, `reviewLogErrors(log)` — unchanged signatures; `approvingDecisionErrors`/`removalDecisionErrors` additionally reject future timestamps (`Date.parse(d.at) > Date.now() + 60_000`).
  - New: `minorDecisionErrors(d) -> string[]` — for `undone`/`rejected` entries: valid `id` (ITEM_ID), reviewer ≥ 2 chars, parseable `at` (future check too); `rejected` additionally requires `reason` ≥ 3 chars.

**Behavior spec for `checkReviewLogData`:**
1. Iterate `logs` in array order; within each log, decisions in array order. Order by parsed instant: `t = Date.parse(d.at)`; keep entry when `!prev || t >= prev.t` (ties → later wins).
2. Structural validation: `APPROVING` → `approvingDecisionErrors`; `REMOVING` → `removalDecisionErrors`; `"undone"`/`"rejected"` → `minorDecisionErrors`. Invalid → error, skip entry.
3. Exact-duplicate diagnostic: an approving decision identical (same id, version, hash, at, reviewer) to one already seen → error « décision dupliquée » (revisions legitimately produce *different* approving decisions for the same id — only exact duplicates error).
4. `undone` resets lifecycle: delete `latest` and `lifecycle` entries for `d.id`.
5. Per approved item: existing version/hash/reviewer checks, PLUS: if `new Date(item.reviewedAt).getTime() !== Date.parse(d.at)` → error « date de relecture incohérente avec le journal » (verified safe: all 591 current items match exactly, including legacy baseline).
6. Lifecycle/desaparu check unchanged, except `undone` no longer leaves stale entries.

- [ ] **Step 1: Write failing tests in `scripts/selftest-review-log.mjs`** (extend the file, keeping the existing structural tests):
  - Mixed-timezone ordering: item approved twice — decision A `at: "2026-10-02T19:00:00Z"` (version 1) then decision B `at: "2026-10-02T20:00:00+02:00"` (= 18:00Z, version 2, different hash) for a bank item matching B's version/hash. Expect NO error (B is genuinely later) under parsed ordering; construct the mirror case where B is earlier in real time than A and expect the version mismatch error to reference A's version, proving B did not win.
  - `undone` reset: bank does NOT contain id X; logs contain approving decision then `undone` decision (both valid). Expect no « disparu » error and no other error for X.
  - Approve→undo→re-approve: logs approve(v1) → undone → approve(v2 matching bank item). Expect no errors.
  - `reviewedAt` cross-check: item whose `reviewedAt` differs from decision `at` → error containing « date de relecture incohérente ».
  - Future timestamp: approving decision with `at` = Date.now() + 1 h → `approvingDecisionErrors` non-empty.
  - Exact duplicate: two identical approving decisions → one error containing « dupliquée »; a v1 then v2 approving pair for the same id → no duplicate error.
  - `minorDecisionErrors`: `undone` without reviewer → error; valid `rejected` with reason → no error; `rejected` without reason → error.
  - Existing structural tests from the current file remain unchanged and passing.
  Test items need a real id matching ITEM_ID (e.g. `numeric-demo-001` as used today) and hashes matching `EagRules.contentHash(item)` (import `EagRules` from `./lib/rules.mjs`).
- [ ] **Step 2: Run `node scripts/selftest-review-log.mjs`** — expect FAIL (new tests fail against current code).
- [ ] **Step 3: Implement** per the behavior spec: extract the file-reading wrapper to load approved items and parsed logs, call `checkReviewLogData`, keep the CLI `isDirectRun` block and its messages unchanged.
- [ ] **Step 4: Run `node scripts/selftest-review-log.mjs`** — expect PASS; then `node scripts/check-review-log.mjs` — expect ✅ with 591 items (no regression on real data).
- [ ] **Step 5: Commit** `git add scripts/check-review-log.mjs scripts/selftest-review-log.mjs && git commit -m "fix: review-log gate compares parsed instants, resets on undone, cross-checks reviewedAt"`

### Task 2: Atomic writes (crash-safe temp-file + rename)

**Files:**
- Modify: `scripts/lib/file-transaction.mjs`
- Modify: `scripts/admin-server.mjs` (`writeJson` helper, line 39)
- Modify: `scripts/promote-candidate.mjs` (write phase, lines 157–164)
- Modify: `scripts/selftest-transaction.mjs`

**Interfaces:**
- Produces: `writeFileAtomic(file: string, data: string|Buffer): void` in `file-transaction.mjs` — mkdir -p dirname, write `${file}.tmp-${process.pid}-${counter++}` , `fs.renameSync(tmp, file)`, unlink tmp on failure.
- `withFileRollback` keeps its signature; its restore branch uses `writeFileAtomic`.

- [ ] **Step 1: Extend `scripts/selftest-transaction.mjs`**: after the existing rollback test, (a) call `writeFileAtomic(existing, "atomic")` and assert content; (b) assert no `*.tmp-*` files remain in the dir after both operations and after a rollback; (c) rollback restore of a previously-existing file works through the atomic path (already covered by (a)'s dir sweep).
- [ ] **Step 2: Run `node scripts/selftest-transaction.mjs`** — expect FAIL (`writeFileAtomic` not defined).
- [ ] **Step 3: Implement** `writeFileAtomic` and use it in the rollback restore branch, `writeJson`, and the four `fs.writeFileSync` calls in promote-candidate's write phase (banks, log file, remaining candidates).
- [ ] **Step 4: Run** `node scripts/selftest-transaction.mjs` (PASS), then `npm test` (PASS).
- [ ] **Step 5: Commit** — `fix: atomic multi-file writes via temp file + rename`

### Task 3: Writer lockfile (mutual exclusion across admin server, CLI, scripts)

**Files:**
- Create: `scripts/lib/lockfile.mjs`
- Modify: `scripts/admin-server.mjs` (save path, lines 271–274)
- Modify: `scripts/promote-candidate.mjs` (write phase)
- Modify: `scripts/selftest-transaction.mjs` (lock tests added here — keeps the `npm test` chain unchanged)

**Interfaces:**
- Produces: `withLock(name: string, action: () => Promise<T> | T): Promise<T>` in `lockfile.mjs`.
  - Lock file: `${os.tmpdir()}/eag-a1-academy-${sha256(repoRoot).slice(0, 12)}.lock` (no repo pollution; pass repoRoot via a second arg `withLock(name, repoRoot, action)` or derive from a constant in the module — implementer's choice, document in code).
  - Acquire: `fs.openSync(lock, "wx")`, write JSON `{pid, token: crypto.randomUUID(), since: ISO}`; on `EEXIST`, read mtime — if older than 5 min, steal (unlink + retry); else await 100 ms and retry, up to 300 attempts (30 s), then throw French error « Un autre processus modifie la banque (verrou …). Réessayez. »
  - Release: `finally` — read lock, unlink only if our token matches (don't delete someone else's stolen lock race).

- [ ] **Step 1: Write failing tests** in `selftest-transaction.mjs`: (a) `withLock("test", …)` runs the action and releases (second `withLock` succeeds); (b) concurrent case: acquire manually via the module's exported acquire helper OR simulate by creating the lock file with a fresh mtime → `withLock` with a short retry budget rejects (use injectable retry params or a short test: set the lock file's mtime to now via `fs.utimesSync` and assert the error is the French lock message within a small budget). Keep the API testable: export `acquire(repoRoot, name)` and `release(handle)` separately; `withLock` composes them. Assert a stale lock (> 5 min, mtime faked via `fs.utimesSync`) is stolen and the action runs.
- [ ] **Step 2: Run** — expect FAIL.
- [ ] **Step 3: Implement** the module; wire it:
  - `admin-server.mjs` `/api/save` handler: `if (running) return send(res, 409, …)` **stays**, then `return send(res, 200, await withLock("save", () => save(await readBody(req))))` — and move the `running` check to *after* `readBody` (Task 4 refines the handler; coordinate: final shape is `const body = await readBody(req); if (running) return send(res, 409, …); return send(res, 200, await withLock("save", () => save(body)))`).
  - `promote-candidate.mjs`: wrap the `withFileRollback(...)` write phase in `await withLock("promote", …)` (lock outside rollback; keep the rollback semantics identical).
- [ ] **Step 4: Run** selftest + `npm test` (PASS).
- [ ] **Step 5: Commit** — `fix: exclusive writer lock for bank mutations`

### Task 4: Admin server — version bumps, undone-removal, race fix, notes

**Files:**
- Modify: `scripts/admin-server.mjs` (save validation lines 146–165; handler lines 271–280; `run()` comment line 201)

**Spec:**
1. Version monotonicity (M5): in the modification loop, when `old` exists and content hash differs, additionally require `item.version === (old.version || 1) + 1`; error `${id} : la version doit passer de ${old.version || 1} à ${item.version} (incrément de 1 attendu)` otherwise.
2. Accept `undone` as removal authorization (completes Task 1's reset semantics): the removed-item check accepts `x.decision === "removed" || x.decision === "undone"`; run the decision through a shared validation (`removalDecisionErrors` for `removed`; reuse `minorDecisionErrors` from `check-review-log.mjs` — import it — for `undone`).
3. Race fix (M9): `/api/save` checks `running` after `await readBody(req)` (final handler shape given in Task 3).
4. Comment (L): above the `spawn` in `run()`: warn that `shell: true` on Windows is only safe because every interpolated value is an env var or validated literal — never append raw user input to `args`.

- [ ] **Step 1: Tests first** — extend `scripts/selftest-admin.mjs`? No: server logic is not vm-testable; add a small pure test instead: extract nothing; instead assert via grep-free import — reuse `check-review-log.mjs`'s `minorDecisionErrors` in a test added to `selftest-review-log.mjs` (already covers undone validation). For the version-bump rule, add a test file `scripts/selftest-server.mjs`? Prefer avoiding a new chain entry: implement the version check as an exported helper `versionBumpErrors(old, item) -> string[]` from `admin-server.mjs`… admin-server starts a server on import — NOT importable. Put `versionBumpErrors` in `scripts/lib/review-rules.mjs` (pure, already imported by both), tested in `selftest-review.mjs`: bump +1 ok; same version → error; +2 → error; old absent → no constraint.
- [ ] **Step 2: Run `node scripts/selftest-review.mjs`** — expect FAIL (helper missing).
- [ ] **Step 3: Implement** the helper in `review-rules.mjs`, call it from save's modification loop, apply the undone acceptance + handler reorder + comment.
- [ ] **Step 4: Run** `node scripts/selftest-review.mjs` (PASS) and `npm test` (PASS).
- [ ] **Step 5: Commit** — `fix: enforce version bumps on modification and accept undone removals`

### Task 5: Admin UI — merge guard, XSS escapes, aria sync

**Files:**
- Modify: `admin.js` — `mergeFromServer` (lines 175–184), `previewHtml` (line 235, 237), `stimulusHtml` shapes branch (line 53)
- Modify: `scripts/selftest-admin.mjs`

**Spec:**
1. M10 merge guard: at the top of `mergeFromServer`, after `const st = await api("/api/state")`:
   - `const dirty = CATS.some((c) => JSON.stringify(S.approved[c] || []) !== S.approvedOrig[c]);` (same pattern as line 648)
   - `const serverChanged = CATS.some((c) => JSON.stringify(st.approved?.[c] || []) !== S.approvedOrig[c]);`
   - If `dirty && serverChanged`: `toast("La banque approuvée a changé sur le disque : rechargez-la avant d'enregistrer.")` and `return []` WITHOUT refreshing `S.workspaceRevision` (a stale revision makes the next save 409, protecting the local work).
   - Otherwise proceed exactly as today.
2. M11 escapes in `previewHtml`: `réf. ${esc(item.ratings[i])}` and `vous : ${esc(mine[i] ?? "—")}`.
3. M12 aria sync: admin shapes branch becomes `<div class="stimulus"><div class="shapes" role="img" aria-label="Série de figures">${esc(s.text)}</div></div>` (matches app.js:21).
4. Extend `selftest-admin.mjs`: keep the existing vm-based extraction (broaden the regex to tolerate the new body: `/async function mergeFromServer\(\) \{[\s\S]*?\n\}/m`); add a second scenario context with `S.approvedOrig` set so that `dirty=true`, `st.approved` differing from orig (`serverChanged=true`), asserting: result `[]`, `added` empty, and `state.workspaceRevision` still `"old"`. Provide `CATS`, `toast` recorder, `addCandidates`, `attachReview` in the context. Also add a real-`attachReview` test: extract `function attachReview(review)` and `function reviewCurrent(item, review)` (line 47) plus provide `reviewCurrent`'s dependency `R = { contentHash: (o) => "h" + JSON.stringify(o.candidate) }`; assert a review whose `candidateHash` matches attaches (returns 1, sets `c.ai`, `aiStale=false`) and a stale one does not (returns 0).
- [ ] **Step 1: Write failing tests** (extended selftest-admin as above).
- [ ] **Step 2: Run `node scripts/selftest-admin.mjs`** — expect FAIL.
- [ ] **Step 3: Implement** admin.js changes 1–3.
- [ ] **Step 4: Run** selftest (PASS), `npm run build:bank -- --check` (no drift), `npm test` (PASS).
- [ ] **Step 5: Commit** — `fix: guard mergeFromServer against concurrent bank changes and escape admin preview`

### Task 6: Student runtime & shared modules — timer, guards, calculator, CSP

**Files:**
- Modify: `shared/timer.js` (performance.now)
- Modify: `app.js` (EagTimer fallback, line 33–37; escape `k` at line 45)
- Modify: `shared/calculator.js` (drop `x` as multiplication, length cap)
- Modify: `eag-a1-academy.html`, `admin.html`, `index.html` (CSP meta)
- Modify: `scripts/selftest-ui.mjs`

**Spec:**
1. `timer.js`: `const now = () => (g.performance && typeof g.performance.now === "function" ? g.performance.now() : Date.now());` — `deadline(seconds, now = now())`, `secondsLeft(end, now = now())`. Note: this makes timer values performance-clock-based; existing explicit-arg selftest calls still pass.
2. `app.js`: `startTimer` resolves the timer through a fallback: `const T = globalThis.EagTimer || { deadline: (s) => Date.now() + s * 1000, secondsLeft: (e) => Math.max(0, Math.ceil((e - Date.now()) / 1000)) };` (place near top of the hand-written region or inside `startTimer`); use `T.` in the function. Escape the reference rating: `Réf. : ${esc(k)}`.
3. `calculator.js`: `.replace(/[×]/g, "*")` (drop the letter `x` — `2x3` must now throw). Add `if (s.length > 100) throw new Error("Expression trop longue");` right after the replace chain. Add `maxlength="100"` to the `calc-input` in `html()`.
4. CSP meta added to the three HTML files right after the charset meta: `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; base-uri 'none'; form-action 'none'">`. For `index.html` use `connect-src 'none'`. Verify no inline `<script>` or inline event handlers exist in these files (none found: all scripts are external `src`).
5. `selftest-ui.mjs`: add `"2x3"` to the must-refuse list; keep existing expectations (no existing test uses letter `x`).
- [ ] **Step 1: Write failing test**: add `"2x3"` to the refuse list in `selftest-ui.mjs`; add a timer check that deadline/secondsLeft still work with explicit args (already present) and that `evaluate` throws for inputs > 100 chars.
- [ ] **Step 2: Run `node scripts/selftest-ui.mjs`** — expect FAIL.
- [ ] **Step 3: Implement** 1–4.
- [ ] **Step 4: Run** selftest-ui (PASS), `npm test` (PASS).
- [ ] **Step 5: Commit** — `fix: harden calculator and timer, guard EagTimer, add CSP metas`

### Task 7: Metadata, docs, workflows, version bump

**Files:**
- Modify: `CITATION.cff` (add `authors`, `date-released: 2026-10-03`, version 1.7.0)
- Modify: `package.json` (via `npm version 1.7.0 --no-git-tag-version`; add `description`, `license: "MIT"`, `repository`, `engines: { node: ">=22" }`)
- Modify: `package-lock.json` (updated by `npm version`)
- Modify: `.gitignore` (add `.DS_Store`)
- Modify: `README.md` line 109 (« ADR-0001 à ADR-0007 » → « ADR-0001 à ADR-0009 »)
- Modify: `docs/ARCHITECTURE.md` tree — add `shared/timer.js`, `scripts/lib/file-transaction.mjs`, `scripts/lib/review-rules.mjs`, `docs/research/`
- Modify: `docs/research/eag-2026-benchmark.md` lines 158–160 — « 500 validated items (100 per category) » → « 591 validated items (RA 110, RV 110, RN 145, PL 126, JS 100) »
- Modify: `.github/workflows/validate.yml`, `.github/workflows/generate-test-bank.yml` — pin `actions/checkout@v6`, `actions/setup-node@v6`, `actions/upload-artifact@v6` to full commit SHAs (obtain via `git ls-remote https://github.com/actions/checkout v6` etc., keep `# v6` comment)

**Notes:** `authors` for CITATION.cff comes from `git log -1 --format='%an <%ae>'` (use the repo owner's identity, keep type `authors: [{ name: … }]` — CFF prefers plain name + optional email key). Accepted-by-design findings are documented, not fixed: the unkeyed hash (already documented in `item-rules.js`) and deleted `.review.json` evidence — for the latter, add `candidateHash: decision?.candidateHash ?? null` to promote-candidate's log entries (line 108–112) so the AI-decision binding stays auditable after deletion; verify with `node scripts/check-review-log.mjs` (new field must not break the gate — the checker ignores unknown fields).

- [ ] **Step 1: Add `candidateHash` to promote log entries**; run `node scripts/check-review-log.mjs` (PASS).
- [ ] **Step 2: Update CITATION.cff, package.json/lock (npm version), .gitignore, README, ARCHITECTURE, benchmark doc.**
- [ ] **Step 3: Pin workflow actions** to fetched SHAs.
- [ ] **Step 4: Run `npm test`** (PASS) and `git diff --stat` sanity check.
- [ ] **Step 5: Commit** — `chore: metadata, docs accuracy and workflow pinning (v1.7.0)`

### Task 8: Final verification

- [ ] **Step 1:** `npm test` end-to-end (PASS, all 10 stages).
- [ ] **Step 2:** `npm run build:bank -- --check` (PASS), `node scripts/check-review-log.mjs` (PASS).
- [ ] **Step 3:** `git log --oneline main..HEAD` review — one commit per task, no stray files (`docs/superpowers/` plan stays untracked or is committed separately as `docs:` — implementer: commit the plan file in this final commit).
- [ ] **Step 4:** Tag `v1.7.0` on the final commit (`git tag v1.7.0`).
- [ ] **Step 5:** Report to the user: what was fixed, what was accepted-by-design (unkeyed hash — documented; manual 409 merge UX), and the one remaining known gap (atomic rename protects integrity per-file but multi-file atomicity across files is still best-effort under crash — CI catches inconsistency after the fact).
