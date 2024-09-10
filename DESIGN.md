## Database Schema

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