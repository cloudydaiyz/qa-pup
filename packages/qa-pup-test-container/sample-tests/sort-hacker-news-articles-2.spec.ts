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
    numArticles: number; // timestamp of the last article on the page
}

/**
 * Validates that EXACTLY the first `NUM_ARTICLES` articles on Hacker News 
 * are sorted from newest to oldest.
 *
 * Finds all pages, then performs an analysis on each page.
 */
async function sortHackerNewsArticles2(page: Page) {
    console.log("sortHackerNewsArticles2 start");

    try {
        // Store the info needed from each page to perform analysis
        const pageInfo: PageInfo[] = [];

        let numArticles = 0;
        let nextPage = page;
        await nextPage.goto("https://news.ycombinator.com/newest");

        while (numArticles < NUM_ARTICLES) {
            // Calculate the number of articles to analyze on this page
            const numNewArticles = Math.min(30, NUM_ARTICLES - numArticles);
            numArticles += numNewArticles;

            // Analyze the page asynchronously
            const table = await nextPage.getByRole("table").nth(2);
            const rows = await table.locator("tbody > tr").all();
            pageInfo.push({ rows, numArticles });

            // Get the next page if there's still articles left
            if (numArticles < NUM_ARTICLES) {
                const nextPageLink = await (
                    await rows[rows.length - 1].getByRole("link")
                ).getAttribute("href");
                nextPage = await page.context().newPage();
                await nextPage.goto(`https://news.ycombinator.com/${nextPageLink}`);
            }
        }

        // Store the promises for analyzing each page
        const analysis: Promise<TimeData>[] = [];
        pageInfo.forEach((info) => {
            analysis.push(analyzeHackerNewsPage(info.rows, info.numArticles));
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
    } catch(e) {
        console.error(
            "The first " + NUM_ARTICLES + " newest articles are NOT sorted from newest to oldest."
        );
        console.error("Error:");
        console.error(e);
    }
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