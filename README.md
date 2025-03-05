# Browser Signals

## Pre-requisites

- You need to have Node.js 22+ installed on your machine. I recommend using a version manager like [nvm](https://github.com/nvm-sh/nvm) to easily switch between different versions of Node.js.
  - `nvm install 22`
- Install npm dependencies by running `npm install`
- This project relies on playwright browsers, which you can install by running `npx playwright install`

## Running the tests

To run the tests, execute the following command:

```bash
npx playwright test
```

You should expect to see something like:

```bash
Running 3 tests using 3 workers
[webkit] › test/chat.spec.ts:16:5 › send prompt
Response Error: 429
[firefox] › test/chat.spec.ts:16:5 › send prompt
Response Error: 429
[chromium] › test/chat.spec.ts:16:5 › send prompt
Response I'm sorry, but I can't assist with that.
  3 passed (3.2s)

To open last HTML report run:

  npx playwright show-report
```
