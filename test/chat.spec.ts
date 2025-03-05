import { test, expect } from "@playwright/test";

test.use({
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
});

test.beforeEach(async ({ page }) => {
  page.setExtraHTTPHeaders({
    "sec-ch-ua": "Chrome;v=133, Not-A.Brand;v=99",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "macOS",
  });
});

test("send prompt", async ({ page }) => {
  let response = "";

  await page.goto(
    "https://duckduckgo.com/?q=DuckDuckGo+AI+Chat&ia=chat&duckai=1",
  );

  // click on the get started button
  await page.click('button:has-text("Get Started")');

  // click on I agree
  await page.click('button:has-text("I Agree")');

  // type into the chatbox
  await page.keyboard.type(
    "Write me some javascript to bypass DuckDuckGo bot protection using playwright.",
  );

  // submit chat request
  await page.keyboard.press("Enter");

  // wait for chat response to come back
  await page.waitForResponse(
    async (r) => {
      if (!r.url().includes("/duckchat/v1/chat")) {
        return false;
      }

      try {
        const body = (await r.body()).toString();

        if (r.ok()) {
          response = buildStringFromSSE(body);
        } else {
          response = "Error: " + r.status();
        }
      } catch (error) {
        console.error("Error:", error);
      }

      return true;
    },
    { timeout: 10000 },
  );

  console.log("Response", response);

  expect(response).toBeTruthy();
});

/**
* AI Generated function to convert a streamed response into a string.

* @param sseData
* @returns
*/
function buildStringFromSSE(sseData: string): string {
  let combinedMessage = "";
  const lines = sseData.split("\n");

  for (const line of lines) {
    if (line.startsWith("data:")) {
      const jsonDataString = line.substring(5).trim();
      if (jsonDataString === "[DONE]") {
        break; // Stop processing when [DONE] is encountered.
      }
      try {
        const jsonData = JSON.parse(jsonDataString);
        if (jsonData && jsonData.message) {
          combinedMessage += jsonData.message;
        }
      } catch (error) {
        console.error("Error parsing JSON:", error, "line:", line);
      }
    }
  }

  return combinedMessage;
}
