import fs from "node:fs";
import crypto from "node:crypto";
import os from "node:os";
import path from "node:path";

/**
 * Exclusive writer lock for bank mutations (admin server save, CLI promotion).
 * The lock lives in the OS temp dir, keyed by a hash of the repo root, so two
 * checkouts never share a lock and the repo itself stays clean.
 */
const LOCK_DIR = os.tmpdir();
const STALE_MS = 5 * 60 * 1000;
const TAKEOVER_STALE_MS = 30 * 1000;
// Les verrous vivent quelques secondes : un verrou qui prétend être détenu par un
// processus vivant mais qui a plus de 30 min est presque sûrement le vestige d'un
// processus mort dont le pid a été recyclé. Un détenteur légitime suspendu est
// donc repris après ce délai au lieu de bloquer les écrivains pour toujours.
const PID_REUSE_MS = 30 * 60 * 1000;
const DEFAULT_ATTEMPTS = 300;
const DEFAULT_DELAY_MS = 100;

export function LOCK_PATH(repoRoot) {
  let canonical = path.resolve(repoRoot);
  try { canonical = fs.realpathSync.native(canonical); } catch { /* path may not exist yet */ }
  if (process.platform === "win32") canonical = canonical.toLowerCase();
  const key = crypto.createHash("sha256").update(canonical).digest("hex").slice(0, 12);
  return path.join(LOCK_DIR, `eag-a1-academy-${key}.lock`);
}

function holderIsAlive(holder) {
  if (!holder || !Number.isInteger(holder.pid) || holder.pid <= 0) return null;
  try { process.kill(holder.pid, 0); return true; }
  catch (e) { return e.code === "EPERM" ? true : e.code === "ESRCH" ? false : null; }
}

/** Atomically move the observed stale lock out of the lock pathname. */
function retireStaleLock(lock, token) {
  const retired = `${lock}.stale-${token}`;
  try {
    fs.renameSync(lock, retired);
    try { fs.rmSync(retired, { force: true }); } catch { /* harmless residue */ }
    return true;
  } catch (e) {
    if (e.code === "ENOENT" || e.code === "EEXIST" || e.code === "EPERM" || e.code === "EACCES") return false;
    throw e;
  }
}

function readLock(lock) {
  const stat = fs.statSync(lock);
  let holder = null;
  try { holder = JSON.parse(fs.readFileSync(lock, "utf8")); } catch { /* partial or legacy lock */ }
  return { stat, holder };
}

function canRetire(snapshot, staleMs = STALE_MS) {
  const alive = holderIsAlive(snapshot.holder);
  const age = Date.now() - snapshot.stat.mtimeMs;
  return alive === false
    || (alive === null && age > staleMs)
    || (alive === true && age > PID_REUSE_MS);
}

function sameLock(a, b) {
  if (a.stat.dev !== b.stat.dev || a.stat.ino !== b.stat.ino) return false;
  if (a.holder?.token || b.holder?.token) return a.holder?.token === b.holder?.token;
  return a.stat.mtimeMs === b.stat.mtimeMs && a.stat.size === b.stat.size;
}

function acquireTakeoverGuard(lock, name, token) {
  const guard = `${lock}.takeover`;
  try {
    const fd = fs.openSync(guard, "wx");
    try { fs.writeFileSync(fd, JSON.stringify({ pid: process.pid, name, token, since: new Date().toISOString() })); }
    finally { fs.closeSync(fd); }
    return { path: guard, token };
  } catch (e) {
    if (e.code !== "EEXIST") throw e;
    // The guard normally lives for only a few synchronous operations. Recover it
    // if its owner crashed, but never retire a live contender's guard.
    try {
      const observed = readLock(guard);
      if (canRetire(observed, TAKEOVER_STALE_MS)) {
        const current = readLock(guard);
        if (sameLock(observed, current)) retireStaleLock(guard, token);
      }
    } catch { /* another contender changed or removed the guard */ }
    return null;
  }
}

/**
 * Acquire the lock, waiting for a live holder and stealing a stale one.
 * @param {string} repoRoot
 * @param {string} name label for diagnostics
 * @param {{ attempts?: number, delayMs?: number }} [opts]
 * @returns {{ path: string, token: string }}
 */
export async function acquire(repoRoot, name, opts = {}) {
  const lock = LOCK_PATH(repoRoot);
  const token = crypto.randomUUID();
  const attempts = opts.attempts ?? DEFAULT_ATTEMPTS;
  const delayMs = opts.delayMs ?? DEFAULT_DELAY_MS;
  for (let i = 0; i < attempts; i++) {
    try {
      const fd = fs.openSync(lock, "wx");
      try { fs.writeFileSync(fd, JSON.stringify({ pid: process.pid, name, token, since: new Date().toISOString() })); }
      finally { fs.closeSync(fd); }
      return { path: lock, token };
    } catch (e) {
      if (e.code !== "EEXIST") throw e;
      // A dead holder can be replaced immediately. A separate takeover guard
      // serializes stale-lock retirement. Once the guard is held, re-check that
      // the pathname still names the owner we observed before moving anything.
      try {
        const observed = readLock(lock);
        if (canRetire(observed)) {
          const guard = acquireTakeoverGuard(lock, name, token);
          if (guard) {
            let retired = false;
            try {
              const current = readLock(lock);
              if (sameLock(observed, current) && canRetire(current)) retired = retireStaleLock(lock, token);
            } catch { /* lock vanished while the guard was acquired */ }
            finally { release(guard); }
            if (retired) continue;
          }
        }
      } catch { continue; } // vanished between open and stat: retry immediately
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw new Error(`Un autre processus modifie la banque (verrou ${lock}). Réessayez.`);
}

/** Release our own lock; never delete a lock a stolen/replaced holder now owns. */
export function release(handle) {
  if (!handle) return;
  try {
    const holder = JSON.parse(fs.readFileSync(handle.path, "utf8"));
    if (holder.token !== handle.token) return;
  } catch { return; /* lock gone or unreadable: never remove what we cannot identify */ }
  fs.rmSync(handle.path, { force: true });
}

/**
 * Run the action under the exclusive writer lock.
 * @template T
 * @param {string} repoRoot
 * @param {string} name
 * @param {() => Promise<T>|T} action
 * @param {{ attempts?: number, delayMs?: number }} [opts]
 * @returns {Promise<T>}
 */
export async function withLock(repoRoot, name, action, opts) {
  const handle = await acquire(repoRoot, name, opts);
  try { return await action(); }
  finally { release(handle); }
}
