import { chromium, Locator } from "playwright";
import test, { expect, Page } from "@playwright/test";

// Number of articles to analyze total
const NUM_ARTICLES = 100;

interface TimeData {
    first: number; // timestamp of the first article on the page
    last: number; // timestamp of the last article on the page
}

interface PageInfo {
    rows: Locator[]; // timestamp of the first article on the page
    numNewArticles: number;
}

/**
 * Validates that EXACTLY the first `NUM_ARTICLES` articles on Hacker News 
 * are sorted from newest to oldest.
 *
 * Finds all pages, then performs an analysis on each page. Creates a new page for each
 * page of articles to analyze.
 */
async function sortHackerNewsArticles2(page: Page) {
    console.log("sortHackerNewsArticles2 start");

    // Store the info needed from each page to perform analysis
    const pageInfo: PageInfo[] = [];

    let numArticles = 0;
    let nextPage = page;
    await nextPage.goto("https://news.ycombinator.com/newest");

    while (numArticles < NUM_ARTICLES) {
        let fault = page.getByText("Sorry, we're not able to serve your requests this quickly.");
        while(await fault.count() != 0) {
            console.log("Faulty page. Reloading...");
            await delay(1000).then(() => nextPage.reload());
            fault = page.getByText("Sorry, we're not able to serve your requests this quickly.");
        }

        // Calculate the number of articles to analyze on this page
        const numNewArticles = Math.min(30, NUM_ARTICLES - numArticles);
        numArticles += numNewArticles;

        // Analyze the page asynchronously
        const table = await nextPage.getByRole("table").nth(2);
        const rows = await table.locator("tbody > tr").all();
        pageInfo.push({ rows, numNewArticles });

        // Get the next page if there's still articles left
        if (numArticles < NUM_ARTICLES) {
            const link = await rows[rows.length - 1].getByRole("link");
            const nextPageLink = await link.getAttribute("href");
            nextPage = await page.context().newPage();
            await nextPage.goto(`https://news.ycombinator.com/${nextPageLink}`);
        }
    }

    // Store the promises for analyzing each page
    const analysis: Promise<TimeData>[] = [];
    pageInfo.forEach((info) => {
        analysis.push(analyzeHackerNewsPage(info.rows, info.numNewArticles));
    });

    // Ensure that the results for each successive page are in order
    const results = await Promise.all(analysis);
    results.forEach((result, i) => {
        if (i < results.length - 1) {
            expect(result.last).toBeGreaterThanOrEqual(results[i + 1].first);
        }
    });

    console.log(
        "The first " + NUM_ARTICLES + " newest articles are sorted from newest to oldest!"
    );
}

/**
 * Waits for `ms` milliseconds
 * @param {number} ms The number of milliseconds to wait for
 * @returns A promise to await for the delay to finish
 */
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Validates that `numArticles` articles on a single page of Hacker News/newest
 * is sorted
 * @param {Locator[]} rows The table rows on the page to analyze
 * @param {number} numArticles The number of articles to analyze
 * @returns The minutes of the first article and last article on the page
 */
async function analyzeHackerNewsPage(rows, numArticles): Promise<TimeData> {
    let previousTimestamp = 0;
    const timeData = {
        first: 0,
        last: 0,
    };

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

test("run function 2", async ({ page }) => {
    await sortHackerNewsArticles2(page);
});