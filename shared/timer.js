/* Monotonic clock helpers for browser countdowns: performance.now() does not
 * jump when the user (or an NTP sync) moves the system clock mid-exam. */
(function (g) {
  "use strict";

  const now = () => (g.performance && typeof g.performance.now === "function" ? g.performance.now() : Date.now());

  function deadline(seconds, start = now()) {
    return start + Math.max(0, Number(seconds) || 0) * 1000;
  }

  function secondsLeft(end, nowAt = now()) {
    return Math.max(0, Math.ceil((Number(end) - nowAt) / 1000));
  }

  g.EagTimer = { deadline, secondsLeft };
})(typeof globalThis !== "undefined" ? globalThis : this);