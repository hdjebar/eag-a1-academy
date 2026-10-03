import fs from "node:fs";
import path from "node:path";

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
        else { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, content); }
      } catch (e) { rollbackErrors.push(`${file}: ${e.message}`); }
    }
    if (rollbackErrors.length) error.message += `\nÉchec partiel du retour arrière : ${rollbackErrors.join(" ; ")}`;
    throw error;
  }
}
