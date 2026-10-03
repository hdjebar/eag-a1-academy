/* Monotonic-enough wall-clock helpers for browser countdowns. */
(function (g) {
  "use strict";

  function deadline(seconds, now = Date.now()) {
    return now + Math.max(0, Number(seconds) || 0) * 1000;
  }

  function secondsLeft(end, now = Date.now()) {
    return Math.max(0, Math.ceil((Number(end) - now) / 1000));
  }

  g.EagTimer = { deadline, secondsLeft };
})(typeof globalThis !== "undefined" ? globalThis : this);
