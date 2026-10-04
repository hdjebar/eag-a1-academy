import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.E2E_PORT || 4310);
// Locally, an already installed Chromium can be used with PW_CHROMIUM=/path/to/chrome.
const launchOptions = process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {};

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  fullyParallel: true,
  reporter: process.env.CI ? [["list"], ["github"]] : "list",
  use: { baseURL: `http://127.0.0.1:${port}`, launchOptions },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], launchOptions } },
    { name: "mobile", use: { ...devices["Pixel 5"], viewport: { width: 375, height: 740 }, launchOptions }, grep: /@mobile/ },
  ],
  webServer: { command: "node tests/e2e/server.mjs", url: `http://127.0.0.1:${port}/eag-a1-academy.html`, reuseExistingServer: !process.env.CI },
});
