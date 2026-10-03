import fs from "node:fs";
import path from "node:path";

let tmpCounter = 0;

/**
 * Crash-safe single-file write: content goes to a temp file, then a rename.
 * A kill or power loss mid-write leaves the original file intact (rename is
 * atomic on POSIX and Windows), never a truncated target.
 * @param {string} file
 * @param {string|Buffer} data
 */
export function writeFileAtomic(file, data) {
  const tmp = `${file}.tmp-${process.pid}-${tmpCounter++}`;
  try {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(tmp, data);
    fs.renameSync(tmp, file);
  } catch (e) {
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