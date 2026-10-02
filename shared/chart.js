/*
 * EAG A1 Académie — chart stimulus renderer (bar and line charts as inline SVG).
 * Classic script exposing globalThis.EagChart, used by the learner app and the admin page.
 * Values are printed on the chart so every answer can be computed from what is shown;
 * a visually hidden data table gives screen-reader users the same information.
 */
(function (g) {
  "use strict";
  const COLORS = ["var(--chart1, #2f6f9f)", "var(--chart2, #c2662d)", "var(--chart3, #4f8a4b)"];
  const fmt = (v) => (typeof v === "number" ? v.toLocaleString("fr-FR") : String(v));

  /** Rounded axis maximum and tick step for a given data maximum. */
  function niceScale(max) {
    if (!(max > 0)) return { top: 1, step: 1 };
    const raw = max / 5;
    const mag = 10 ** Math.floor(Math.log10(raw));
    const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw);
    return { top: Math.ceil(max / step) * step, step };
  }

  /**
   * @param {{type:"chart", kind:"bar"|"line", caption:string, unit?:string, labels:string[], series:{name:string, values:number[]}[], note?:string}} s
   * @param {(t:string)=>string} esc - HTML escaping function of the host page.
   * @returns {string} HTML (figure with SVG, hidden table and optional note).
   */
  function html(s, esc) {
    const labels = s.labels || [], series = s.series || [];
    const W = 640, H = 300, L = 56, R = 16, T = 20, B = 46 + (series.length > 1 ? 22 : 0);
    const pw = W - L - R, ph = H - T - B;
    const max = Math.max(0, ...series.flatMap((x) => x.values || []));
    const { top, step } = niceScale(max);
    const y = (v) => T + ph - (v / top) * ph;
    const band = pw / Math.max(1, labels.length);
    const parts = [];
    for (let v = 0; v <= top + 1e-9; v += step) {
      parts.push(`<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" stroke="currentColor" stroke-opacity="${v === 0 ? 0.6 : 0.15}"/>`);
      parts.push(`<text x="${L - 6}" y="${y(v) + 4}" text-anchor="end" font-size="11" fill="currentColor" fill-opacity="0.7">${esc(fmt(Math.round(v * 100) / 100))}</text>`);
    }
    labels.forEach((lab, i) => parts.push(`<text x="${L + band * (i + 0.5)}" y="${T + ph + 18}" text-anchor="middle" font-size="12" fill="currentColor">${esc(lab)}</text>`));
    if (s.kind === "line") {
      series.forEach((ser, k) => {
        const pts = (ser.values || []).map((v, i) => [L + band * (i + 0.5), y(v)]);
        parts.push(`<polyline fill="none" stroke="${COLORS[k % 3]}" stroke-width="2.5" points="${pts.map((p) => p.join(",")).join(" ")}"/>`);
        pts.forEach(([px, py], i) => {
          parts.push(`<circle cx="${px}" cy="${py}" r="4" fill="${COLORS[k % 3]}"/>`);
          // The highest point at this position gets its label above, the others below, so labels never collide.
          const top = series.every((o, m) => m === k || (o.values[i] ?? -Infinity) < ser.values[i] || ((o.values[i] === ser.values[i]) && m > k));
          parts.push(`<text x="${px}" y="${top ? py - 9 : py + 18}" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor">${esc(fmt(ser.values[i]))}</text>`);
        });
      });
    } else {
      const n = Math.max(1, series.length), gap = band * 0.2, bw = (band - gap) / n;
      series.forEach((ser, k) => (ser.values || []).forEach((v, i) => {
        const x = L + band * i + gap / 2 + k * bw;
        parts.push(`<rect x="${x}" y="${y(v)}" width="${Math.max(1, bw - 2)}" height="${Math.max(0, T + ph - y(v))}" fill="${COLORS[k % 3]}" rx="2"/>`);
        parts.push(`<text x="${x + (bw - 2) / 2}" y="${y(v) - 5}" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor">${esc(fmt(v))}</text>`);
      }));
    }
    if (series.length > 1) {
      let lx = L;
      series.forEach((ser, k) => {
        parts.push(`<rect x="${lx}" y="${H - 16}" width="12" height="12" fill="${COLORS[k % 3]}" rx="2"/><text x="${lx + 17}" y="${H - 6}" font-size="12" fill="currentColor">${esc(ser.name)}</text>`);
        lx += 30 + 7 * String(ser.name).length;
      });
    }
    const unit = s.unit ? ` (${s.unit})` : "";
    const table = `<table class="sr"><caption>${esc(s.caption)}${esc(unit)}</caption><thead><tr><th scope="col"></th>${series.map((x) => `<th scope="col">${esc(x.name)}</th>`).join("")}</tr></thead><tbody>${labels.map((lab, i) => `<tr><th scope="row">${esc(lab)}</th>${series.map((x) => `<td>${esc(fmt(x.values[i]))}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
    return `<figure class="chart"><figcaption>${esc(s.caption)}${s.unit ? ` <span class="unit">${esc(unit)}</span>` : ""}</figcaption>`
      + `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${esc(s.caption)}" style="max-width:${W}px;height:auto">${parts.join("")}</svg>${table}`
      + `${s.note ? `<p class="note">${esc(s.note)}</p>` : ""}</figure>`;
  }

  g.EagChart = { html, niceScale };
})(typeof globalThis !== "undefined" ? globalThis : this);
