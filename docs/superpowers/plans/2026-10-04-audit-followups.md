# Audit Follow-up Patch (v1.8.2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the five remaining findings from the 2026-10-04 audits — admin guard wording drift, E2E title precision, workflow over-permission, lockfile PID-reuse wedging, and app/admin shared-helper drift — as release v1.8.2.

**Architecture:** The admin `init()` guard learns to distinguish a missing rules script (`shared/item-rules.js`) from missing bank data (`bank/admin-bank.js`). A new `shared/ui.js` exposes the identical `esc`/label constants both pages duplicate today (killing the drift class at its root). `canRetire` gains a PID-reuse fallback: a lock whose mtime is far older than its live-pid claim is retired. The generate workflow is split into a read-only generation job and a write-only PR job.

**Tech Stack:** Browser classic scripts (`shared/*.js`, `app.js`, `admin.js`), Node ESM selftests, Playwright E2E (`tests/e2e/`), GitHub Actions YAML.

**Spec:** The 2026-10-04 audit findings (conversation): admin guard `!R` wording mismatch (`admin.js:931`); E2E title "absentes" vs present-but-empty (`tests/e2e/app.spec.mjs:52`); `generate-test-bank.yml:16-18` workflow-level write permissions; `lockfile.mjs:51-54` `canRetire` never retires a live-pid holder (PID reuse wedges); app/admin drift (`esc` null semantics `app.js:14` vs `admin.js:27`, unknown-stimulus marker `app.js:29` vs `admin.js:57`, duplicated label maps).

## Global Constraints

- No new npm dependencies; runtime stays zero-dep and 100% offline (classic scripts only, `file://` must keep working).
- All user-facing messages in French, matching the existing tone; `role="alert"` on error panels.
- Selftests follow the existing pattern (plain `.mjs`, `throw new Error(...)` on failure, `console.log("... self-test passed ...")`); E2E specs live in `tests/e2e/`.
- `npm test` must pass at the end of every task; `npx playwright test` must pass at the end of tasks touching HTML/app/admin behavior.
- Never edit the generated `bank/*.js` files by hand; hand-written regions only.
- Work on branch `fix/audit-followups-v1.8.2` created from `main` (@ `e9126e2`).

## Review Focus

- A live process legitimately holding the lock (admin save in progress) must NOT be stealable just because mtime ages — the PID-reuse threshold must sit far above any real operation duration (pins: Task 3 selftest with a live `process.pid` holder whose mtime is fresh vs old).
- The admin guard must show the rules-script message only when `R` is missing and the bank-data message only when the bank data is missing — not the other way round (pins: Task 1 E2E tests, one per failure cause).
- The shared `esc` must render `null`/`undefined` as `""` (not `"null"`) while numbers and 0 still render (`pins`: Task 2 selftest-ui).
- The app page must show a visible marker for an unknown stimulus type, consistent with admin (`pins`: Task 2 selftest-ui on the app's `stimulusHtml`).
- The split workflow must keep producing the PR from the generated artifact — `generated/latest.txt` must ride along in the artifact or the PR job breaks (pins: Task 4, manual `workflow_dispatch` verification note + YAML review).

---

### Task 1: Admin guard distinguishes failure causes; E2E title precision

**Files:**
- Modify: `admin.js` (`init()`, lines 930-934)
- Modify: `tests/e2e/app.spec.mjs` (admin-guard test, lines 52-58)

**Spec:**
1. In `init()`, branch the guard:
   - `!R` (rules script missing) → `<h1>Règles de validation indisponibles</h1>` + `<p>Vérifiez que <code>shared/item-rules.js</code> est présent, puis rechargez la page.</p>`
   - `!SCHEMA.allOf` (bank data missing/empty) → the existing message verbatim (« Données d'administration indisponibles … présent, non vide et à jour … »).
   Both panels keep `role="alert"` and `return` before any wiring.
2. Rename the E2E test title from "les données d'administration absentes affichent une erreur explicite" to "des données d'administration présentes mais vides affichent une erreur explicite" (it fulfills an empty body).
3. New E2E test "des règles de validation absentes affichent une erreur explicite": route `**/shared/item-rules.js` to an empty body, goto `/admin.html`, expect the alert to contain « Règles de validation indisponibles » and NOT « Données d'administration ».

- [ ] **Step 1: Write the failing E2E tests** (new rules-script test + renamed title; the rules test fails until the branch exists).
- [ ] **Step 2: Run `npx playwright test tests/e2e/app.spec.mjs`** — expect FAIL on the new test, PASS on the renamed one.
- [ ] **Step 3: Implement** the two-branch guard in `admin.js`.
- [ ] **Step 4: Run** `npx playwright test` (all specs PASS) and `npm test` (PASS).
- [ ] **Step 5: Commit** — `fix: admin guard distinguishes missing rules script from missing bank data`

### Task 2: Shared UI helpers (`shared/ui.js`) — esc + labels single-source

**Files:**
- Create: `shared/ui.js`
- Modify: `app.js` (lines 3-5 labels, line 14 esc, line 29 unknown-stimulus)
- Modify: `admin.js` (lines 12-14 labels, line 27 esc)
- Modify: `eag-a1-academy.html` (script tag before `app.js`), `admin.html` (before `admin.js`), `scripts/admin-server.mjs` (STATIC map: `/shared/ui.js`)
- Modify: `scripts/selftest-ui.mjs`
- Test: `scripts/selftest-ui.mjs`

**Spec:**
1. `shared/ui.js` exposes `globalThis.EagUI = { esc, CAT_LABEL, SKILL_LABEL, RATING_LABEL }`:
   - `esc = (v) => String(v ?? "").replace(/[&<>"']/g, c => ({...}[c]))` — the admin semantics (null/undefined → `""`).
   - `CAT_LABEL`/`SKILL_LABEL`/`RATING_LABEL` copied once (the current admin.js:12-14 content, which is identical to app.js:3-5's maps).
2. `app.js` and `admin.js` drop their local definitions and alias: `const esc = globalThis.EagUI.esc; const SKILL_LABEL = globalThis.EagUI.SKILL_LABEL;` etc. (app keeps `modules` — it is app-specific). admin keeps `CATS`.
3. Align the unknown-stimulus marker: app.js's final `return "";` becomes a visible marker in the app's established style: `<div class="stimulus text">Stimulus de type inconnu — passez cette question.</div>` (admin keeps its `.msg.error` variant; both pages now visibly mark the case).
4. Wire: `<script src="shared/ui.js"></script>` before `app.js` / `admin.js` in both HTML files; add `"/shared/ui.js": "text/javascript; charset=utf-8"` to the STATIC map in `admin-server.mjs`.
5. `selftest-ui.mjs` additions: load `shared/ui.js` via the existing vm loader; assert `EagUI.esc(null) === ""`, `esc(undefined) === ""`, `esc(0) === "0"`, `esc("<b>") === "&lt;b&gt;"`, `esc("deja") === "deja"`; assert `SKILL_LABEL` covers every skill referenced by the compiled bank (iterate `globalThis.EAG_BANK` categories, each `item.skill` must be a key or throw), and `CAT_LABEL`/`RATING_LABEL` shapes (5 categories, 4 ratings).

- [ ] **Step 1: Write the failing tests** in `selftest-ui.mjs` (esc semantics + bank-wide label coverage).
- [ ] **Step 2: Run `node scripts/selftest-ui.mjs`** — expect FAIL (`EagUI` undefined).
- [ ] **Step 3: Implement** per spec 1-4.
- [ ] **Step 4: Run** `node scripts/selftest-ui.mjs` (PASS), `npm test` (PASS — includes `build:bank --check`), `npx playwright test` (PASS — proves both pages still render).
- [ ] **Step 5: Commit** — `refactor: single-source esc and label maps in shared/ui.js, align unknown-stimulus handling`

### Task 3: Lockfile PID-reuse retirement

**Files:**
- Modify: `scripts/lib/lockfile.mjs` (`canRetire`, lines 51-54)
- Test: `scripts/selftest-transaction.mjs` (lock section)

**Spec:**
1. New constant `PID_REUSE_MS = 30 * 60 * 1000` with comment: « Les verrous vivent quelques secondes ; un verrou prétendument vivant mais vieux de 30 min est presque sûr le signe d'un pid recyclé. »
2. `canRetire` becomes: `alive === false || (alive === null && age > staleMs) || (alive === true && age > PID_REUSE_MS)`.
3. Update the hung-holder comment: a live-but-hung holder is now retired after `PID_REUSE_MS` instead of never (documented behavior change from PR #19).
4. New tests in `selftest-transaction.mjs`:
   - Live pid, fresh mtime → `withLock` still blocks (French message) — guard against over-stealing.
   - Live pid (`process.pid` as holder), mtime faked 31 min old → `withLock` steals and runs.
   Run within the existing `{ attempts: 3, delayMs: 10 }` budget style.

- [ ] **Step 1: Write the failing tests** in the lock section of `selftest-transaction.mjs`.
- [ ] **Step 2: Run `node scripts/selftest-transaction.mjs`** — expect FAIL (live holder never retired).
- [ ] **Step 3: Implement** per spec 1-3.
- [ ] **Step 4: Run** selftest (PASS) + `npm test` (PASS — includes the 16×10 takeover stress).
- [ ] **Step 5: Commit** — `fix: retire locks whose live pid is almost certainly reused`

### Task 4: Split generate workflow — read-only generation, write-only PR

**Files:**
- Modify: `.github/workflows/generate-test-bank.yml`

**Spec:**
1. Workflow-level `permissions: contents: read`.
2. Job 1 `generate` (read-only implicit): checkout, setup-node, npm ci, config check, generate, blind review, deterministic validation, npm test, upload artifact — artifact path `generated/*.json` **plus `generated/latest.txt`** (the PR job needs it and it is not a `.json` file).
3. Job 2 `open-pr` (`needs: generate`, `permissions: { contents: write, pull-requests: write }`): checkout (with PUSH_TOKEN), setup-node + `npm ci` (for `gh`? no — `gh` is preinstalled; only checkout needed), download artifact into `generated/`, then the existing PR-creation steps verbatim (git config bot identity, branch, `git add -f "$file" "$review"`, commit, push, `gh pr create`).
4. Keep the BOT_TOKEN comment and env var names unchanged. Keep the pinned action SHAs; add `actions/download-artifact@<sha> # v7` — resolve the SHA via `git ls-remote https://github.com/actions/upload-artifact v7`-style lookup for the download repo at implementation time.
5. Note in the job body: the write-scoped job only touches `generated/` content produced by job 1's artifact.

- [ ] **Step 1: Rewrite the workflow** per spec 1-4 (actionscript is config; no unit test exists — verification is the YAML review below plus the next workflow_dispatch run by the maintainer).
- [ ] **Step 2: Verify** `git ls-remote` SHA for download-artifact matches its release tag; YAML parses (`node -e "yaml"` not available — use `python3 -c "import yaml,sys;yaml.safe_load(open('.github/workflows/generate-test-bank.yml'))"` or a `node --experimental-yaml` equivalent; at minimum, actionlint if available, else careful manual read).
- [ ] **Step 3: Run `npm test`** (PASS — workflow change must not affect it).
- [ ] **Step 4: Commit** — `ci: split generation (read-only) from PR creation (write-scoped)`
- [ ] **Step 5: Ledger note** — `Ruling: workflow_dispatch-only workflow cannot be exercised by CI; verification = SHA check + maintainer's next manual run.`

### Task 5: Version v1.8.2, docs, tag, final verification

**Files:**
- Modify: `package.json` + `package-lock.json` (version → 1.8.2), `CITATION.cff` (version 1.8.2, `date-released` = merge date)
- Modify: `docs/ARCHITECTURE.md` (tree: add `shared/ui.js` next to the other shared entries)

**Steps:**
- [ ] **Step 1:** Bump versions (`npm version 1.8.2 --no-git-tag-version`, then align CITATION.cff), add the `shared/ui.js` tree line.
- [ ] **Step 2:** Full verification: `npm test` (exit 0), `npx playwright test` (all pass), `git status` clean.
- [ ] **Step 3:** Commit — `chore: release v1.8.2`.
- [ ] **Step 4:** Merge to `main` per the finishing-a-development-branch decision (user chose local merge previously — confirm again), then `git tag -a v1.8.2 -m "EAG A1 Académie v1.8.2"` on the merge commit.
