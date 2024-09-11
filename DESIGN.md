## Limits

- 1 scheduled test run a day
- 3 manually triggered test runs a day max
- No one can trigger a test run if 
	- a test run is already running
	- it's within 1 hr of a scheduled run
- 10 emails get notified on test run completion max

## Database Schema

`npm install --save-dev @playwright/test` - installs Playwright Test
`npm install --save-dev @types/node` - installs types
`npx playwright install` - installs playwright browsers

```
✔ Success! Created a Playwright Test project at /Users/kdunc/Desktop/workspace/tech-proj/qa-pup/test-container2

Inside that directory, you can run several commands:

  npx playwright test
    Runs the end-to-end tests.

  npx playwright test --ui
    Starts the interactive UI mode.

  npx playwright test --project=chromium
    Runs the tests only on Desktop Chrome.

  npx playwright test example
    Runs the tests in a specific file.

  npx playwright test --debug
    Runs the tests in debug mode.

  npx playwright codegen
    Auto generate tests with Codegen.

We suggest that you begin by typing:

    cd test-container2
  npx playwright test

And check out the following files:
  - ./test-container2/tests/example.spec.ts - Example end-to-end test
  - ./test-container2/tests-examples/demo-todo-app.spec.ts - Demo Todo App end-to-end tests
  - ./test-container2/playwright.config.ts - Playwright Test configuration

Visit https://playwright.dev/docs/intro for more information. ✨

Happy hacking! 🎭
```

MongoDB database with single collection

### Dashboard Document (singleton)
```ts
{
	_id: ObjectId("1"),
	docType: "dashboard",
	runType: "SCHEDULED",
	runId: ObjectId("..."),
	startTime: ISODate("..."),
	latestTests: [
		{
			name: "sortHackerNewsArticles",
			duration: 800,
			status: "PASS" // "PASS | FAIL | ERROR"
		},
		{
			name: "sortHackerNewsArticles2",
			duration: 800,
			status: "PASS"
		},
	]
	manualRun: {
		remaining: 3,
		max: 3,
		startTime: ISODate("..."),
	},
	nextScheduledRun: {
		startTime: ISODate("..."),
		emailList: [
			"kyduncan123@gmail.com"
		]
	},
	currentRun: {
		status: "RUNNING", // RUNNING | AT REST
		runType: "MANUAL", // MANUAL | SCHEDULED
		runId: ObjectId("..."),
		startTime: ISODate("..."), 
		emailList: [ 
			"kduncan@utexas.edu"
		]
	}
}
```

### Test Document
```ts
{
	docType: "test",
	runId: ObjectId("..."),
	startTime: ISODate("..."),
	name: "sortHackerNewsArticles",
	description: "...",
	duration: 800,
	testsRan: 3,
	testsPassed: 3,
	tests: [
		{
			suiteName: "sortHackerNewsArticles",
			testName: "sortHackerNewsArticles method 1",
			startTime: ISODate("..."),
			duration: 100,
			status: "PASS"
		}
	],
	sourceCode: "s3://...",
	reporters: {
		html: "https://....",
		json: "s3://...."
	},
	otherAssets: [
		{
			name: "vid1",
			downloadUri: "https://..."
		},
		{
			name: "vid2",
			downloadUri: "https://..."
		},
		...
	]
}
```