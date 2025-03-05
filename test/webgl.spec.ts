import { test, expect, Page } from "@playwright/test";
import * as path from "path";
import { promises as fs } from "fs";

test.use({
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
});

test.beforeEach(async ({ page }) => {
  // no native way to override sec-ch-ua
  page.setExtraHTTPHeaders({
    "sec-ch-ua": "Chrome;v=133, Not-A.Brand;v=99",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "macOS",
  });

  // add a global hashing function
  await page.addInitScript({
    path: path.resolve(__dirname, "webgl-js/canvas-hash.js"),
  });
});

async function evaluateScript(page: Page, script: string) {
  const filePath = path.join(__dirname, `webgl-js/${script}.js`);
  const scriptContent = await fs.readFile(filePath, "utf-8");
  return await page.evaluate(scriptContent);
}

test("calculate webgl code generated partially by AI", async ({ page }) => {
  await page.goto(
    "https://duckduckgo.com/?q=DuckDuckGo+AI+Chat&ia=chat&duckai=1",
  );

  expect(await evaluateScript(page, "ai-webgl")).toBe(-2017915884);
});

test("calculate webgl code from panopticon minus fingerprint", async ({
  page,
}) => {
  await page.goto(
    "https://duckduckgo.com/?q=DuckDuckGo+AI+Chat&ia=chat&duckai=1",
  );

  expect(await evaluateScript(page, "panopticon-webgl")).toBe(585432715);
});
