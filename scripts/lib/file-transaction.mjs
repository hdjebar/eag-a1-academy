import fs from "node:fs";
import path from "node:path";

let tmpCounter = 0;
const RENAME_RETRY_CODES = new Set(["EACCES", "EBUSY", "EPERM"]);

function waitSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function renameWithRetry(from, to) {
  for (let attempt = 0; ; attempt++) {
    try { fs.renameSync(from, to); return; }
    catch (e) {
      if (!RENAME_RETRY_CODES.has(e.code) || attempt >= 5) throw e;
      waitSync(10 * (attempt + 1));
    }
  }
}

/**
 * Crash-safe single-file write: content goes to a temp file, then a rename.
 * A kill or power loss mid-write leaves the original file intact (rename is
 * atomic on POSIX and Windows), never a truncated target.
 * @param {string} file
 * @param {string|Buffer} data
 */
export function writeFileAtomic(file, data) {
  const tmp = `${file}.tmp-${process.pid}-${tmpCounter++}`;
  let fd;
  try {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fd = fs.openSync(tmp, "w");
    fs.writeFileSync(fd, data);
    fs.fsyncSync(fd);
    fs.closeSync(fd); fd = undefined;
    renameWithRetry(tmp, file);
    // Persist the directory entry as well on platforms that allow directory fsync.
    if (process.platform !== "win32") {
      let dirFd;
      try { dirFd = fs.openSync(path.dirname(file), "r"); fs.fsyncSync(dirFd); }
      catch { /* some filesystems do not support directory fsync */ }
      finally { if (dirFd !== undefined) fs.closeSync(dirFd); }
    }
  } catch (e) {
    if (fd !== undefined) try { fs.closeSync(fd); } catch { /* best effort */ }
    try { fs.rmSync(tmp, { force: true }); } catch { /* best effort */ }
    throw e;
  }
}

/** Roll back all listed files if a synchronous multi-file update fails. */
export function withFileRollback(files, action) {
  const targets = [...new Set(files.map((f) => path.resolve(f)))];
  const before = new Map(targets.map((f) => [f, fs.existsSync(f) ? fs.readFileSync(f) : null]));
  try {
    return action();
  } catch (error) {
    const rollbackErrors = [];
    for (const [file, content] of before) {
      try {
        if (content === null) fs.rmSync(file, { force: true });
        else writeFileAtomic(file, content);
      } catch (e) { rollbackErrors.push(`${file}: ${e.message}`); }
    }
    if (rollbackErrors.length) error.message += `\nÉchec partiel du retour arrière : ${rollbackErrors.join(" ; ")}`;
    throw error;
  }
}
