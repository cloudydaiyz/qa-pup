import { useState } from "react";
import Download from "./svg/Download";
import EditorControls from "./svg/EditorControls";
import VisitArrow from "./svg/VisitArrow";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { gruvboxDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import "./TestRun.css";
import React from "react";

const Overview = () => {
    return (
        <div className="overview">
            <h3>OVERALL</h3>
            <div className="overview-section overall">
                <span>
                    <h4>Start Time</h4>
                    <p>Lorem ipsum lorem ipsum lorem ipsum</p>
                </span>
                <span>
                    <h4>Duration</h4>
                    <p>Lorem ipsum lorem ipsum lorem ipsum</p>
                </span>
                <span>
                    <h4>Tests Ran</h4>
                    <p>Lorem ipsum lorem ipsum lorem ipsum</p>
                </span>
                <span>
                    <h4>Tests Passed</h4>
                    <p>Lorem ipsum lorem ipsum lorem ipsum</p>
                </span>
            </div>
            <h3>sortHackerNewsArticles : sortHackerNewsArticles method 1</h3>
            <div className="overview-section">
                <span>
                    <h4>Start Time</h4>
                    <p>Time o clock</p>
                </span>
                <span>
                    <h4>Duration</h4>
                    <p>100ms</p>
                </span>
                <span>
                    <h4>Status</h4>
                    <p>PASSED</p>
                </span>
            </div>
            <h3>sortHackerNewsArticles : sortHackerNewsArticles method 2</h3>
            <div className="overview-section">
                <span>
                    <h4>Start Time</h4>
                    <p>Time o clock</p>
                </span>
                <span>
                    <h4>Duration</h4>
                    <p>100ms</p>
                </span>
                <span>
                    <h4>Status</h4>
                    <p>PASSED</p>
                </span>
            </div>
        </div>
    );
}

const codeSample = 
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
`

function getLineNumbers(sample: string) {
    const numLines = sample != "" ? sample.split(/\n/).length - 1 : 0;
    const lines = [...Array(numLines).keys()].map((num, i) => (
        <React.Fragment key={i}>
            {num+1}<br/>
        </React.Fragment>
    ));
    return lines;
}

const Code = () => {
    return (
        <div className="code">
            <div className="code-header">
                <EditorControls />
                <p>index-test-ts</p>
            </div>
            <div className="code-body">
                <div className="line-numbers">
                    {getLineNumbers(codeSample)}
                </div>
                <SyntaxHighlighter 
                    language="typescript" 
                    style={gruvboxDark}
                    customStyle={
                        {
                            background: "var(--editor-color-3)",
                            width: "100%",
                            color: "var(--white)",
                            height: "fit-content",
                            fontSize: "1rem",
                            display: "flex",
                            flexDirection: "column",
                            padding: "0",
                        }
                    }
                    wrapLines={true}
                >
                    {codeSample}
                </SyntaxHighlighter>
            </div>
        </div>
    );
}

const Assets = () => {
    return (
        <div className="assets">
            <h3>Reporters</h3>
            <div className="asset-section">
                <span>
                    <p>HTML Report</p>
                    <button><VisitArrow /></button>
                </span>
                <span>
                    <p>JSON Report</p>
                    <button><Download /></button>
                </span>
            </div>
            <h3>Other</h3>
            <div className="asset-section">
                <span>
                    <p>vid1</p>
                    <button><Download /></button>
                </span>
                <span>
                    <p>vid2</p>
                    <button><Download /></button>
                </span>
                <span>
                    <p>vid3</p>
                    <button><Download /></button>
                </span>
                <span>
                    <p>vid4</p>
                    <button><Download /></button>
                </span>
            </div>
        </div>
    );
}

interface TestRunProps {}

const TestRun = ({}: TestRunProps) => {
    const [selectedTab, setSelectedTab] = useState(0);
    
    return (
    <div className="test-run-data">
        <ul>
            <li><button disabled={selectedTab == 0} onClick={() => setSelectedTab(0)}>Overview</button></li>
            <li><button disabled={selectedTab == 1} onClick={() => setSelectedTab(1)}>Code</button></li>
            <li><button disabled={selectedTab == 2} onClick={() => setSelectedTab(2)}>Assets</button></li>
        </ul>
        <div className="data">
            {selectedTab == 0 && <Overview />}
            {selectedTab == 1 && <Code />}
            {selectedTab == 2 && <Assets />}
        </div>
    </div>
    );
}

export default TestRun