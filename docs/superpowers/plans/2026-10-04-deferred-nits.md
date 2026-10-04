# Deferred-minor Sweep (v1.8.3) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the four deferred minors from the v1.8.2 review as release v1.8.3: dead alias, missing trailing newline, imprecise selftest diagnostic, and the offline admin ZIP-export E2E gap.

**Architecture:** Two cleanups (dead alias, newline) are mechanical. The ZIP writer moves from `admin.js` into `shared/ui.js` (pure, DOM-free) so its output format becomes unit-testable; the new offline-admin E2E drives `/admin.html` without a token hash (offline mode), edits an approved item, and asserts the ZIP download fires.

**Tech Stack:** Browser classic scripts, Playwright E2E (`tests/e2e/admin.spec.mjs`), Node selftests.

**Spec:** v1.8.2 final-review deferred minors: (1) `app.js:6` dead `CAT_LABEL` alias; (2) `shared/ui.js` missing trailing newline; (3) `selftest-ui.mjs:35` diagnostic prints `undefined` for a skill-less item; (4) no E2E for the offline admin ZIP-export path (`admin.js:699-734`).

## Global Constraints

- No new dependencies; offline/file:// behavior unchanged; French UI text matching existing tone.
- `npm test` green at the end of every task; `npx playwright test` green after tasks 2-3.
- Branch `fix/deferred-nits-v1.8.3` from `main` (@ `73ba723`). `main` is protected: integration goes through a PR.

## Review Focus

- The ZIP writer move must not change the bytes admin.js produces today (same `crc32`, same header layout) — pinned by the new structural test against the real export list (Task 2).
- The offline E2E must not depend on the server mode at all (no `#token`, no `/api` calls) — it exercises the exact `file://` workflow a maintainer uses (Task 3).
- Removing `CAT_LABEL` from app.js must leave zero dangling references (grep-verified, Task 1).

---

### Task 1: Mechanical cleanups

**Files:**
- Modify: `app.js:6` (drop `CAT_LABEL` from the alias line), `shared/ui.js` (trailing newline)
- Modify: `scripts/selftest-ui.mjs:35` (diagnostic split)

**Spec:**
1. `app.js:6` becomes `const esc=globalThis.EagUI.esc;` (grep `CAT_LABEL` in app.js → 0 hits afterwards).
2. `shared/ui.js` ends with a single `\n`.
3. selftest-ui skill coverage: items without a `skill` field are reported as « items sans compétence » (distinct failure), missing labels only checked on items that have a skill — and the missing-skill list prints real ids, never `undefined`.

- [ ] **Step 1:** Apply 1-2; verify `grep -c CAT_LABEL app.js` → 0 and `tail -c 1 shared/ui.js | od -c` shows `\n`.
- [ ] **Step 2:** Apply 3 in selftest-ui; run `node scripts/selftest-ui.mjs` → PASS (same 591-item coverage line).
- [ ] **Step 3:** `npm test` → PASS. Commit — `chore: drop dead CAT_LABEL alias, ui.js newline, precise skill diagnostic`
- [ ] **Ledger ruling:** the diagnostic change is test-code-only (error-path text inside a selftest) — not TDD-able without artificial contortions; verified by inspection + green suite.

### Task 2: ZIP writer into shared/ui.js + structural test

**Files:**
- Modify: `shared/ui.js` (add `crc32`, `zip` from `admin.js:737-…`; expose on `EagUI`)
- Modify: `admin.js` (delete local `CRC`/`crc32`/`zip`; alias `const zip = globalThis.EagUI.zip;`)
- Test: `scripts/selftest-ui.mjs`

**Spec:**
1. Move the code verbatim (byte-identical output); `EagUI = { esc, CAT_LABEL, SKILL_LABEL, RATING_LABEL, crc32, zip }`.
2. New selftest assertions: `zip([{path:"a/b.json",content:"{\"x\":1}"},{path:"c.txt",content:"hello"}])` returns a Uint8Array/Buffer that (a) starts with `PK\x03\x04`, (b) ends with the EOCD signature `PK\x05\x06`, (c) contains both entry names as bytes, (d) EOCD's entry count bytes equal 2, (e) `crc32(TextEncoder("hello"))` matches the value embedded for `c.txt` (recompute via `EagUI.crc32` and find it in the central directory bytes).

- [ ] **Step 1: Write the failing test** in selftest-ui (EagUI.zip undefined → FAIL).
- [ ] **Step 2: Run `node scripts/selftest-ui.mjs`** — FAIL (zip absent).
- [ ] **Step 3: Implement** the move; admin.js aliases; `npm run build:bank -- --check` unaffected (admin.js hand-written region).
- [ ] **Step 4:** `node scripts/selftest-ui.mjs` PASS, `npm test` PASS, `npx playwright test` PASS (admin flows still work).
- [ ] **Step 5: Commit** — `refactor: move the ZIP writer into shared/ui.js and pin its output format`

### Task 3: Offline admin E2E — ZIP export flow

**Files:**
- Test: `tests/e2e/admin.spec.mjs` (new test; reuse existing helpers/selectors for editing an approved item)

**Spec:**
1. New test "mode hors ligne : modification approuvée exportée en archive .zip":
   - `page.goto("/admin.html")` — **no** `#token` (offline mode; assert the offline notice text « Mode hors ligne » is visible in the Export tab).
   - Set the reviewer field; go to the Banque tab; edit the first approved item (reuse the exact edit flow/selectors the server-mode test uses for "modified"); confirm the decision chip shows the modification.
   - Go to the Export tab; `const dl = page.waitForEvent("download")`; click `#zip`; assert `dl.suggestedFilename()` matches `/^eag-banque-.*\.zip$/`, save to a temp path, assert file size > 0.
   - Assert no server API was hit: block `**/api/**` routes with abort and expect no errors.
2. Coverage test of existing behavior — expected green immediately (ledgered as such; it pins the flow so a future regression fails).

- [ ] **Step 1: Write the test**; run `npx playwright test tests/e2e/admin.spec.mjs` → new test PASSES (existing-behavior coverage; ledger ruling).
- [ ] **Step 2:** Full `npx playwright test` + `npm test` → PASS.
- [ ] **Step 3: Commit** — `test: cover the offline admin ZIP export end to end`

### Task 4: Release v1.8.3

- [ ] **Step 1:** `npm version 1.8.3 --no-git-tag-version`; CITATION.cff version 1.8.3 (date-released = merge date). Commit — `chore: release v1.8.3`.
- [ ] **Step 2:** Full verification (`npm test`, `npx playwright test`, clean tree).
- [ ] **Step 3:** Push branch, `gh pr create` (main is protected), wait for checks, `gh pr merge`, pull, `git tag -a v1.8.3` on the merge commit, push tag.