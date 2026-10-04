import fs from "node:fs";
import { withLock } from "./lib/lockfile.mjs";

const [root, active, failure] = process.argv.slice(2);

await withLock(root, `stress-${process.pid}`, () => {
  let ownsMarker = false;
  try {
    const fd = fs.openSync(active, "wx");
    fs.closeSync(fd);
    ownsMarker = true;
  } catch (e) {
    if (e.code !== "EEXIST") throw e;
    fs.writeFileSync(failure, `overlap detected by ${process.pid}\n`, { flag: "a" });
  }
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 10);
  if (ownsMarker) fs.rmSync(active, { force: true });
}, { attempts: 1000, delayMs: 1 });
