/*
 * EAG A1 Académie — on-screen calculator for the numerical tests.
 * GovJobs: « Vous pouvez utiliser la calculatrice de l'ordinateur pour le test de raisonnement
 * numérique » ; personal devices (smartphone, calculator) are forbidden. This basic calculator
 * reproduces that situation. Classic script exposing globalThis.EagCalc; the expression parser
 * never uses eval().
 */
(function (g) {
  "use strict";

  /**
   * Evaluates an arithmetic expression: numbers (comma or dot decimals), + − × ÷ * / ( ),
   * unary minus and postfix % (x % = x / 100).
   * @param {string} src
   * @returns {number} result (throws on a syntax error or a division by zero)
   */
  function evaluate(src) {
    const s = String(src).replace(/\s+/g, "").replace(/×/g, "*").replace(/[÷:]/g, "/").replace(/[−–]/g, "-");
    if (s.length > 100) throw new Error("Expression trop longue");
    let i = 0;
    const peek = () => s[i];
    const fail = () => { throw new Error("Expression invalide"); };
    function number() {
      const m = /^(\d+(?:[.,]\d*)?|[.,]\d+)/.exec(s.slice(i));
      if (!m) fail();
      i += m[0].length;
      return Number(m[0].replace(",", "."));
    }
    function factor() {
      let v;
      if (peek() === "-") { i++; return -factor(); }
      if (peek() === "+") { i++; return factor(); }
      if (peek() === "(") { i++; v = expr(); if (peek() !== ")") fail(); i++; }
      else v = number();
      while (peek() === "%") { i++; v /= 100; }
      return v;
    }
    function term() {
      let v = factor();
      while (peek() === "*" || peek() === "/") {
        const op = s[i++], w = factor();
        if (op === "/" && w === 0) throw new Error("Division par zéro");
        v = op === "*" ? v * w : v / w;
      }
      return v;
    }
    function expr() {
      let v = term();
      while (peek() === "+" || peek() === "-") { const op = s[i++], w = term(); v = op === "+" ? v + w : v - w; }
      return v;
    }
    if (!s) fail();
    const v = expr();
    if (i !== s.length || !Number.isFinite(v)) fail();
    return v;
  }

  /** French display of a result, up to 10 significant digits. */
  function format(v) {
    const r = Number.parseFloat(v.toPrecision(10));
    return r.toLocaleString("fr-FR", { maximumFractionDigits: 10 });
  }

  const KEYS = ["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "−", "0", ",", "%", "+", "(", ")", "⌫", "C"];
  let current = "";

  /** HTML of the calculator panel (plain markup; wired by mount()). */
  function html() {
    return `<details class="calc" open><summary>Calculatrice</summary><div class="calc-body">`
      + `<label class="sr" for="calc-input">Expression</label><input id="calc-input" class="calc-input" inputmode="decimal" autocomplete="off" spellcheck="false" maxlength="100" placeholder="Ex. (1 380 − 1 200) ÷ 1 200 × 100">`
      + `<output id="calc-out" class="calc-out" aria-live="polite"></output>`
      + `<div class="calc-keys">${KEYS.map((k) => `<button type="button" data-k="${k}" aria-label="${k === "⌫" ? "Effacer le dernier caractère" : k === "C" ? "Tout effacer" : k}">${k}</button>`).join("")}<button type="button" data-k="=" class="calc-eq">=</button></div>`
      + `</div></details>`;
  }

  /** Wires the panel found in `root`; the expression is kept between questions. */
  function mount(root) {
    const input = root.querySelector("#calc-input"), out = root.querySelector("#calc-out");
    if (!input) return;
    input.value = current;
    const run = () => {
      try { const v = evaluate(input.value.replace(/\s/g, "")); out.textContent = `= ${format(v)}`; out.classList.remove("err"); }
      catch (e) { out.textContent = e.message; out.classList.add("err"); }
    };
    input.addEventListener("input", () => { current = input.value; });
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); run(); } });
    root.querySelector(".calc-keys").addEventListener("click", (e) => {
      const k = e.target.closest("button")?.dataset.k;
      if (!k) return;
      if (k === "=") run();
      else if (k === "C") { input.value = ""; out.textContent = ""; }
      else if (k === "⌫") input.value = input.value.slice(0, -1);
      else input.value += k;
      current = input.value;
      input.focus();
    });
  }

  g.EagCalc = { evaluate, format, html, mount };
})(typeof globalThis !== "undefined" ? globalThis : this);
