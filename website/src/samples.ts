import { Dashboard, PaginatedTestMetadata, TestMetadata, TestRunFile } from "@cloudydaiyz/qa-pup-types";

export const sampleDashboard1: Dashboard = {
    runId: "N/A",
    runType: "MANUAL",
    startTime: "2024-09-24T13:00:37.051Z",
    latestTests: [],
    manualRun: {
        remaining: 1,
        max: 3,
        nextRefresh: "2024-09-25T13:00:00.000Z"
    },
    nextScheduledRun: {
        startTime: "2024-09-25T13:00:00.000Z"
    },
    currentRun: {
        state: "AT REST",
    }
}

export const sampleDashboard2: Dashboard = {
    runId: "N/A",
    runType: "MANUAL",
    startTime: "2024-09-24T13:00:37.051Z",
    latestTests: [
        {
            name: "example-1-spec-ts",
            duration: 20591.641,
            status: "PASSED"
        },
        {
            name: "example-2-spec-ts",
            duration: 44227.892,
            status: "FAILED"
        }
    ],
    manualRun: {
        remaining: 2,
        max: 3,
        nextRefresh: "2024-09-25T13:00:00.000Z"
    },
    nextScheduledRun: {
        startTime: "2024-09-25T13:00:00.000Z"
    },
    currentRun: {
        state: "RUNNING",
        runType: "MANUAL",
        runId: "66f2b7f569128ede5ec00d6a",
        startTime: "2024-09-24T13:00:37.051Z",
    }
}

export const sampleTestRunFile1: TestRunFile = {
    id: "test1",
    name: "example-1-test-ts",
    duration: 20591.641,
    status: "PASSED",
    runId: "N/A",
    startTime: "2024-09-24T13:01:35.545Z",
    testsRan: 6,
    testsPassed: 6,
    tests: [
        {
            "testName": "get-started-link-chromium",
            "startTime": "2024-09-24T13:01:37.575Z",
            "duration": 2105,
            "status": "PASSED",
            "assets": [
                {
                    "name": "get-started-link-chromium-video-0",
                    "objectUrl": "https://raw.githubusercontent.com/cloudydaiyz/qa-pup/refs/heads/main/README.md"
                }
            ]
        },
        {
            "testName": "get-started-link-firefox",
            "startTime": "2024-09-24T13:01:44.661Z",
            "duration": 2971,
            "status": "PASSED",
            "assets": [
                {
                    "name": "get-started-link-firefox-video-0",
                    "objectUrl": "https://raw.githubusercontent.com/cloudydaiyz/qa-pup/refs/heads/main/README.md"
                }
            ]
        },
        {
            "testName": "get-started-link-webkit",
            "startTime": "2024-09-24T13:01:52.156Z",
            "duration": 3809,
            "status": "PASSED",
            "assets": [
                {
                    "name": "get-started-link-webkit-video-0",
                    "objectUrl": "https://raw.githubusercontent.com/cloudydaiyz/qa-pup/refs/heads/main/README.md"
                }
            ]
        },
        {
            "testName": "has-title-chromium",
            "startTime": "2024-09-24T13:01:36.251Z",
            "duration": 1059,
            "status": "PASSED",
            "assets": [
                {
                    "name": "has-title-chromium-video-0",
                    "objectUrl": "https://raw.githubusercontent.com/cloudydaiyz/qa-pup/refs/heads/main/README.md"
                }
            ]
        },
        {
            "testName": "has-title-firefox",
            "startTime": "2024-09-24T13:01:40.451Z",
            "duration": 3590,
            "status": "PASSED",
            "assets": [
                {
                    "name": "has-title-firefox-video-0",
                    "objectUrl": "https://raw.githubusercontent.com/cloudydaiyz/qa-pup/refs/heads/main/README.md"
                }
            ]
        },
        {
            "testName": "has-title-webkit",
            "startTime": "2024-09-24T13:01:49.075Z",
            "duration": 2432,
            "status": "PASSED",
            "assets": [
                {
                    "name": "has-title-webkit-video-0",
                    "objectUrl": "https://raw.githubusercontent.com/cloudydaiyz/qa-pup/refs/heads/main/README.md"
                }
            ]
        }
    ],
    sourceObjectUrl: "https://raw.githubusercontent.com/cloudydaiyz/qa-pup/refs/heads/main/test-container/sample-tests/example-1.spec.ts",
    reporters: {
        htmlStaticUrl: "https://www.google.com",
        jsonObjectUrl: "https://raw.githubusercontent.com/cloudydaiyz/qa-pup/refs/heads/main/README.md"
    }
}

export const sampleTestRunFile2: TestRunFile = {
    id: "test2",
    name: "example-2-spec-ts",
    duration: 44227.892,
    status: "PASSED",
    runId: "66f2b7f569128ede5ec00d6a",
    startTime: "2024-09-24T13:01:39.550Z",
    testsRan: 12,
    testsPassed: 9,
    tests: [
        {
            "testName": "get-started-link-chromium",
            "startTime": "2024-09-24T13:01:41.681Z",
            "duration": 1964,
            "status": "PASSED",
            "assets": [
                {
                    "name": "get-started-link-chromium-video-0",
                    "objectUrl": "https://raw.githubusercontent.com/cloudydaiyz/qa-pup/refs/heads/main/README.md"
                }
            ]
        },
        {
            "testName": "get-started-link-firefox",
            "startTime": "2024-09-24T13:01:56.388Z",
            "duration": 3009,
            "status": "PASSED",
            "assets": [
                {
                    "name": "get-started-link-firefox-video-0",
                    "objectUrl": "https://raw.githubusercontent.com/cloudydaiyz/qa-pup/refs/heads/main/README.md"
                }
            ]
        },
        {
            "testName": "get-started-link-webkit",
            "startTime": "2024-09-24T13:02:11.808Z",
            "duration": 3761,
            "status": "PASSED",
            "assets": [
                {
                    "name": "get-started-link-webkit-video-0",
                    "objectUrl": "https://raw.githubusercontent.com/cloudydaiyz/qa-pup/refs/heads/main/README.md"
                }
            ]
        },
        {
            "testName": "has-non-existing-element-chromium",
            "suiteName": "Additional-tests",
            "startTime": "2024-09-24T13:01:44.454Z",
            "duration": 6531,
            "status": "FAILED",
            "assets": [
                {
                    "name": "has-non-existing-element-chromium-video-0",
                    "objectUrl": "https://raw.githubusercontent.com/cloudydaiyz/qa-pup/refs/heads/main/README.md"
                }
            ]
        },
        {
            "testName": "has-non-existing-element-firefox",
            "suiteName": "Additional-tests",
            "startTime": "2024-09-24T13:02:01.164Z",
            "duration": 6384,
            "status": "FAILED",
            "assets": [
                {
                    "name": "has-non-existing-element-firefox-video-0",
                    "objectUrl": "https://raw.githubusercontent.com/cloudydaiyz/qa-pup/refs/heads/main/README.md"
                }
            ]
        },
        {
            "testName": "has-non-existing-element-webkit",
            "suiteName": "Additional-tests",
            "startTime": "2024-09-24T13:02:17.053Z",
            "duration": 6629,
            "status": "FAILED",
            "assets": [
                {
                    "name": "has-non-existing-element-webkit-video-0",
                    "objectUrl": "https://raw.githubusercontent.com/cloudydaiyz/qa-pup/refs/heads/main/README.md"
                }
            ]
        },
        {
            "testName": "has-search-input-chromium",
            "suiteName": "Additional-tests",
            "startTime": "2024-09-24T13:01:43.661Z",
            "duration": 786,
            "status": "PASSED",
            "assets": [
                {
                    "name": "has-search-input-chromium-video-0",
                    "objectUrl": "https://raw.githubusercontent.com/cloudydaiyz/qa-pup/refs/heads/main/README.md"
                }
            ]
        },
        {
            "testName": "has-search-input-firefox",
            "suiteName": "Additional-tests",
            "startTime": "2024-09-24T13:01:59.464Z",
            "duration": 1684,
            "status": "PASSED",
            "assets": [
                {
                    "name": "has-search-input-firefox-video-0",
                    "objectUrl": "https://raw.githubusercontent.com/cloudydaiyz/qa-pup/refs/heads/main/README.md"
                }
            ]
        },
        {
            "testName": "has-search-input-webkit",
            "suiteName": "Additional-tests",
            "startTime": "2024-09-24T13:02:15.580Z",
            "duration": 1464,
            "status": "PASSED",
            "assets": [
                {
                    "name": "has-search-input-webkit-video-0",
                    "objectUrl": "https://raw.githubusercontent.com/cloudydaiyz/qa-pup/refs/heads/main/README.md"
                }
            ]
        },
        {
            "testName": "has-title-chromium",
            "startTime": "2024-09-24T13:01:40.304Z",
            "duration": 1109,
            "status": "PASSED",
            "assets": [
                {
                    "name": "has-title-chromium-video-0",
                    "objectUrl": "https://raw.githubusercontent.com/cloudydaiyz/qa-pup/refs/heads/main/README.md"
                }
            ]
        }
    ],
    sourceObjectUrl: "https://raw.githubusercontent.com/cloudydaiyz/qa-pup/refs/heads/main/test-container/sample-tests/example-2.spec.ts",
    reporters: {
        htmlStaticUrl: "https://www.google.com",
        jsonObjectUrl: "https://raw.githubusercontent.com/cloudydaiyz/qa-pup/refs/heads/main/README.md"
    }
}

const sampleTestMetadata: TestMetadata[] = [
    {
        "testName": "get-started-link-chromium",
        "startTime": "2024-09-24T13:01:41.681Z",
        "duration": 1964,
        "status": "PASSED",
        "assets": [
            {
                "name": "get-started-link-chromium-video-0",
                "objectUrl": "https://raw.githubusercontent.com/cloudydaiyz/qa-pup/refs/heads/main/README.md"
            }
        ],
        "testRunFileId": "test2"
    },
    {
        "testName": "get-started-link-firefox",
        "startTime": "2024-09-24T13:01:56.388Z",
        "duration": 3009,
        "status": "PASSED",
        "assets": [
            {
                "name": "get-started-link-firefox-video-0",
                "objectUrl": "https://raw.githubusercontent.com/cloudydaiyz/qa-pup/refs/heads/main/README.md"
            }
        ],
        "testRunFileId": "test2"
    },
    {
        "testName": "get-started-link-webkit",
        "startTime": "2024-09-24T13:02:11.808Z",
        "duration": 3761,
        "status": "PASSED",
        "assets": [
            {
                "name": "get-started-link-webkit-video-0",
                "objectUrl": "https://raw.githubusercontent.com/cloudydaiyz/qa-pup/refs/heads/main/README.md"
            }
        ],
        "testRunFileId": "test2"
    },
    {
        "testName": "has-non-existing-element-chromium",
        "suiteName": "Additional-tests",
        "startTime": "2024-09-24T13:01:44.454Z",
        "duration": 6531,
        "status": "FAILED",
        "assets": [
            {
                "name": "has-non-existing-element-chromium-video-0",
                "objectUrl": "https://raw.githubusercontent.com/cloudydaiyz/qa-pup/refs/heads/main/README.md"
            }
        ],
        "testRunFileId": "test2"
    },
    {
        "testName": "has-non-existing-element-firefox",
        "suiteName": "Additional-tests",
        "startTime": "2024-09-24T13:02:01.164Z",
        "duration": 6384,
        "status": "FAILED",
        "assets": [
            {
                "name": "has-non-existing-element-firefox-video-0",
                "objectUrl": "https://raw.githubusercontent.com/cloudydaiyz/qa-pup/refs/heads/main/README.md"
            }
        ],
        "testRunFileId": "test2"
    },
    {
        "testName": "has-non-existing-element-webkit",
        "suiteName": "Additional-tests",
        "startTime": "2024-09-24T13:02:17.053Z",
        "duration": 6629,
        "status": "FAILED",
        "assets": [
            {
                "name": "has-non-existing-element-webkit-video-0",
                "objectUrl": "https://raw.githubusercontent.com/cloudydaiyz/qa-pup/refs/heads/main/README.md"
            }
        ],
        "testRunFileId": "test2"
    },
    {
        "testName": "has-search-input-chromium",
        "suiteName": "Additional-tests",
        "startTime": "2024-09-24T13:01:43.661Z",
        "duration": 786,
        "status": "PASSED",
        "assets": [
            {
                "name": "has-search-input-chromium-video-0",
                "objectUrl": "https://raw.githubusercontent.com/cloudydaiyz/qa-pup/refs/heads/main/README.md"
            }
        ],
        "testRunFileId": "test2"
    },
    {
        "testName": "has-search-input-firefox",
        "suiteName": "Additional-tests",
        "startTime": "2024-09-24T13:01:59.464Z",
        "duration": 1684,
        "status": "PASSED",
        "assets": [
            {
                "name": "has-search-input-firefox-video-0",
                "objectUrl": "https://raw.githubusercontent.com/cloudydaiyz/qa-pup/refs/heads/main/README.md"
            }
        ],
        "testRunFileId": "test2"
    },
    {
        "testName": "has-search-input-webkit",
        "suiteName": "Additional-tests",
        "startTime": "2024-09-24T13:02:15.580Z",
        "duration": 1464,
        "status": "PASSED",
        "assets": [
            {
                "name": "has-search-input-webkit-video-0",
                "objectUrl": "https://raw.githubusercontent.com/cloudydaiyz/qa-pup/refs/heads/main/README.md"
            }
        ],
        "testRunFileId": "test2"
    },
    {
        "testName": "has-title-chromium",
        "startTime": "2024-09-24T13:01:40.304Z",
        "duration": 1109,
        "status": "PASSED",
        "assets": [
            {
                "name": "has-title-chromium-video-0",
                "objectUrl": "https://raw.githubusercontent.com/cloudydaiyz/qa-pup/refs/heads/main/README.md"
            }
        ],
        "testRunFileId": "test2"
    },
    {
        "testName": "has-title-firefox",
        "startTime": "2024-09-24T13:01:51.771Z",
        "duration": 3845,
        "status": "PASSED",
        "assets": [
            {
                "name": "has-title-firefox-video-0",
                "objectUrl": "https://raw.githubusercontent.com/cloudydaiyz/qa-pup/refs/heads/main/README.md"
            }
        ],
        "testRunFileId": "test2"
    },
    {
        "testName": "has-title-webkit",
        "startTime": "2024-09-24T13:02:09.051Z",
        "duration": 2112,
        "status": "PASSED",
        "assets": [
            {
                "name": "has-title-webkit-video-0",
                "objectUrl": "https://raw.githubusercontent.com/cloudydaiyz/qa-pup/refs/heads/main/README.md"
            }
        ],
        "testRunFileId": "test2"
    }
];

export const codeSample = 
`const { chromium, Locator } = require("playwright");
const { expect } = require("@playwright/test");
const { NUM_ARTICLES, TEST_DELAY, TEST_RUNS } = require("./config.js");

/**
 * Validates that EXACTLY the first \`NUM_ARTICLES\` articles on Hacker News 
 * are sorted from newest to oldest.
 *
 * Performs analysis as new pages are being found.
 */
async function sortHackerNewsArticles(timing) {
    let timeStart = 0;
    let timeEnd = 0;
    console.log("sortHackerNewsArticles start");

    // Launch browser
    const browser = await chromium.launch({ 
        headless: false, 
        args: ['--disable-gpu'],
    });
    const context = await browser.newContext({
        baseURL: "https://news.ycombinator.com",
        timeout: 60000,
    });
    if (timing) timeStart = Date.now();

    try {
        // Store the promises for analyzing each page
        const analysis = [];

        let numArticles = 0;
        let nextPage = await context.newPage();
        await nextPage.goto("newest");

        console.log("starting loop");

        while (numArticles < NUM_ARTICLES) {
            nextPage.on('console', msg => {
                console.log("\u001b[31mCONSOLE\u001b[0m");
                console.log(msg.text())
            });
            nextPage.on('requestfailed', request => {
                console.log("\u001b[33mREQUEST FAILED\u001b[0m");
                console.log(\`Request failed: \${request.url()}\`);
            });
              
            await nextPage.waitForLoadState('networkidle');

            // Calculate the number of articles to analyze on this page
            const numNewArticles = Math.min(30, NUM_ARTICLES - numArticles);
            numArticles += numNewArticles;

            // Analyze the page asynchronously
            const table = await nextPage.getByRole("table").nth(2);
            const rows = await table.locator("tbody > tr").all();
            analysis.push(analyzeHackerNewsPage(rows, numNewArticles));

            // Get the next page if there's still articles left
            if (numArticles < NUM_ARTICLES) {
                await delay(1500);
                const nextPageLink = await (
                    await rows[rows.length - 1].getByRole("link")
                ).getAttribute("href");
                nextPage = await context.newPage();
                await nextPage.goto(nextPageLink);
            }
        }

        // Ensure that the results for each successive page are in order
        const results = await Promise.all(analysis);
        results.forEach((result, i) => {
            if (i < result.length - 1) {
                expect(result.last).toBeGreaterThanOrEqual(results[i + 1].first);
            }
        });

        if (timing) timeEnd = Date.now();
        console.log(
            "The first " + NUM_ARTICLES + " newest articles are sorted from newest to oldest!"
        );
    } catch(e) {
        if (timing) timeEnd = Date.now();
        console.error(
            "The first " + NUM_ARTICLES + " newest articles are NOT sorted from newest to oldest."
        );
        console.error("Error:");
        console.error(e);
    }

    browser.close();
    return timeEnd - timeStart;
}

/**
 * Validates that \`numArticles\` articles on a single page of Hacker News/newest
 * is sorted
 * @param {Locator[]} rows The table rows on the page to analyze
 * @param {number} numArticles The number of articles to analyze
 * @returns The minutes of the first article and last article on the page
 */
async function analyzeHackerNewsPage(rows, numArticles) {
    let previousTimestamp = 0;
    const timeData = {};

    for (let i = 0; i < numArticles; i++) {
        const metadata = rows[i * 3 + 1];

        // Select the metadata
        const links = await metadata.locator("span:has(a)").all();
        if (links.length > 1) {
            const time = await links[1].getAttribute("title");
            const timestamp = Date.parse(time);

            if (previousTimestamp) {
                // Ensure this article's timestamp is before the previous one
                expect(timestamp).toBeLessThanOrEqual(previousTimestamp);
            }
            previousTimestamp = timestamp;

            if (!timeData.first) timeData.first = timestamp;
            timeData.last = timestamp;
        }
    }

    return timeData;
}
`;

export function getMetadata(testRunFileId: string, offset: number, n: number): PaginatedTestMetadata {
    const metadata = sampleTestMetadata
        .filter(metadata => metadata.testRunFileId === testRunFileId)
        .slice(offset, offset + n);
    const total = metadata.length;
    return { metadata, offset, n, total };
}

// Useful for the frontend
async function readDataFromBucket() {
    fetch(`https://test-output-bucket.s3.aws-region.amazonaws.com/qa-pup-example.spec.ts`)
        .then(res => res.text())
        .then(txt => console.log(txt));
    
    // use <a download="filename" href="s3link"> for downloading
}