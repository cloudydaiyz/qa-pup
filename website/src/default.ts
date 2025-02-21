/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Dashboard,
    TestRunFile,
} from "@cloudydaiyz/qa-pup-types";

export const defaultDashboard: Dashboard = {
    runId: "66edf2a4425577ca29eb90ef",
    runType: "SCHEDULED",
    startTime: "2025-02-20T13:00:37.992Z",
    latestTests: [
        {
            name: "analyze-hacker-news-spec-ts",
            duration: 73557.643,
            status: "FAILED",
        },
        {
            name: "sort-hacker-news-articles-1-spec-ts",
            duration: 48744.636,
            status: "FAILED",
        },
        {
            name: "sort-hacker-news-articles-2-spec-ts",
            duration: 45142.837,
            status: "FAILED",
        },
        {
            name: "sort-hacker-news-articles-3-spec-ts",
            duration: 13987.637999999999,
            status: "FAILED",
        },
    ],
    manualRun: {
        remaining: 3,
        max: 3,
        nextRefresh: "2205-02-21T13:00:00.000Z",
    },
    nextScheduledRun: {
        startTime: "2025-02-21T13:00:00.000Z",
    },
    currentRun: {
        state: "AT REST",
    },
};

export const testFileAnalyzeHackerNews: TestRunFile = {
    id: "67b72802a1f91f9ba25bab28",
    name: "analyze-hacker-news-spec-ts",
    duration: 73557.643,
    status: "FAILED",
    runId: "67b727758bea0db473dde0a9",
    startTime: new Date(1740056502426).toISOString(),
    testsRan: 18,
    testsPassed: 12,
    tests: [
        {
            testName: "cumulative-layout-shift-chromium",
            suiteName: "performance-testing",
            startTime: new Date(1740056511020).toISOString(),
            duration: 0,
            status: "SKIPPED" as any,
            assets: [],
            testRunFileId: "67b72802a1f91f9ba25bab28",
        },
        {
            testName: "cumulative-layout-shift-firefox",
            suiteName: "performance-testing",
            startTime: new Date(1740056536212).toISOString(),
            duration: 0,
            status: "SKIPPED" as any,
            assets: [],
            testRunFileId: "67b72802a1f91f9ba25bab28",
        },
        {
            testName: "cumulative-layout-shift-webkit",
            suiteName: "performance-testing",
            startTime: new Date(1740056560721).toISOString(),
            duration: 0,
            status: "SKIPPED" as any,
            assets: [],
            testRunFileId: "67b72802a1f91f9ba25bab28",
        },
        {
            testName: "first-contentful-paint-chromium",
            suiteName: "performance-testing",
            startTime: new Date(1740056517509).toISOString(),
            duration: 590,
            status: "PASSED",
            assets: [
            {
                name: "first-contentful-paint-chromium-video-0",
                objectUrl:
                "/demo-output/analyze-hacker-news-spec-ts/first-contentful-paint-chromium-video-0.webm",
            },
            ],
            testRunFileId: "67b72802a1f91f9ba25bab28",
        },
        {
            testName: "first-contentful-paint-firefox",
            suiteName: "performance-testing",
            startTime: new Date(1740056542241).toISOString(),
            duration: 1023,
            status: "PASSED",
            assets: [
            {
                name: "first-contentful-paint-firefox-video-0",
                objectUrl:
                "/demo-output/analyze-hacker-news-spec-ts/first-contentful-paint-firefox-video-0.webm",
            },
            ],
            testRunFileId: "67b72802a1f91f9ba25bab28",
        },
        {
            testName: "first-contentful-paint-webkit",
            suiteName: "performance-testing",
            startTime: new Date(1740056566959).toISOString(),
            duration: 1313,
            status: "PASSED",
            assets: [
            {
                name: "first-contentful-paint-webkit-video-0",
                objectUrl:
                "/demo-output/analyze-hacker-news-spec-ts/first-contentful-paint-webkit-video-0.webm",
            },
            ],
            testRunFileId: "67b72802a1f91f9ba25bab28",
        },
        {
            testName: "largest-contextful-paint-chromium",
            suiteName: "performance-testing",
            startTime: new Date(1740056504534).toISOString(),
            duration: 6479,
            status: "PASSED",
            assets: [
            {
                name: "largest-contextful-paint-chromium-video-0",
                objectUrl:
                "/demo-output/analyze-hacker-news-spec-ts/largest-contextful-paint-chromium-video-0.webm",
            },
            ],
            testRunFileId: "67b72802a1f91f9ba25bab28",
        },
        {
            testName: "largest-contextful-paint-firefox",
            suiteName: "performance-testing",
            startTime: new Date(1740056536211).toISOString(),
            duration: 1200,
            status: "PASSED",
            assets: [
            {
                name: "largest-contextful-paint-firefox-video-0",
                objectUrl:
                "/demo-output/analyze-hacker-news-spec-ts/largest-contextful-paint-firefox-video-0.webm",
            },
            ],
            testRunFileId: "67b72802a1f91f9ba25bab28",
        },
        {
            testName: "largest-contextful-paint-webkit",
            suiteName: "performance-testing",
            startTime: new Date(1740056542240).toISOString(),
            duration: 1400,
            status: "PASSED",
            assets: [
            {
                name: "largest-contextful-paint-webkit-video-0",
                objectUrl:
                "/demo-output/analyze-hacker-news-spec-ts/largest-contextful-paint-webkit-video-0.webm",
            },
            ],
            testRunFileId: "67b72802a1f91f9ba25bab28",
        },
        {
            testName: "page-load-time-chromium",
            suiteName: "performance-testing",
            startTime: new Date(1740056501049).toISOString(),
            duration: 1100,
            status: "PASSED",
            assets: [
            {
                name: "page-load-time-chromium-video-0",
                objectUrl:
                "/demo-output/analyze-hacker-news-spec-ts/page-load-time-chromium-video-0.webm",
            },
            ],
            testRunFileId: "67b72802a1f91f9ba25bab28",
        },
        {
            testName: "page-load-time-firefox",
            suiteName: "performance-testing",
            startTime: new Date(1740056528064).toISOString(),
            duration: 1310,
            status: "PASSED",
            assets: [
            {
                name: "page-load-time-firefox-video-0",
                objectUrl:
                "/demo-output/analyze-hacker-news-spec-ts/page-load-time-firefox-video-0.webm",
            },
            ],
            testRunFileId: "67b72802a1f91f9ba25bab28",
        },
        {
            testName: "page-load-time-under-2-seconds-webkit",
            suiteName: "performance-testing",
            startTime: new Date(1740056552262).toISOString(),
            duration: 1352,
            status: "PASSED",
            assets: [
            {
                name: "page-load-time-under-2-seconds-webkit-video-0",
                objectUrl:
                "/demo-output/analyze-hacker-news-spec-ts/page-load-time-under-2-seconds-webkit-video-0.webm",
            },
            ],
            testRunFileId: "67b72802a1f91f9ba25bab28",
        },
        {
            testName: "should-not-have-any-automatically-detectable-accessibility-issues-chromium",
            suiteName: "accessibility-testing",
            startTime: new Date(1740056518114).toISOString(),
            duration: 7667,
            status: "FAILED",
            assets: [
            {
                name: "should-not-have-any-automatically-detectable-accessibility-issues-chromium-video-0",
                objectUrl:
                "/demo-output/analyze-hacker-news-spec-ts/should-not-have-any-automatically-detectable-accessibility-issues-chromium-video-0.webm",
            },
            {
                name: "should-not-have-any-automatically-detectable-accessibility-issues-chromium-video-1",
                objectUrl:
                "/demo-output/analyze-hacker-news-spec-ts/should-not-have-any-automatically-detectable-accessibility-issues-chromium-video-1.webm",
            },
            ],
            testRunFileId: "67b72802a1f91f9ba25bab28",
        },
        {
            testName: "should-not-have-any-automatically-detectable-accessibility-issues-firefox",
            suiteName: "accessibility-testing",
            startTime: new Date(1740056543272).toISOString(),
            duration: 7380,
            status: "FAILED",
            assets: [
            {
                name: "should-not-have-any-automatically-detectable-accessibility-issues-firefox-video-0",
                objectUrl:
                "/demo-output/analyze-hacker-news-spec-ts/should-not-have-any-automatically-detectable-accessibility-issues-firefox-video-0.webm",
            },
            {
                name: "should-not-have-any-automatically-detectable-accessibility-issues-firefox-video-1",
                objectUrl:
                "/demo-output/analyze-hacker-news-spec-ts/should-not-have-any-automatically-detectable-accessibility-issues-firefox-video-1.webm",
            },
            ],
            testRunFileId: "67b72802a1f91f9ba25bab28",
        },
        {
            testName: "should-not-have-any-automatically-detectable-accessibility-issues-webkit",
            suiteName: "accessibility-testing",
            startTime: new Date(1740056568280).toISOString(),
            duration: 7573,
            status: "FAILED",
            assets: [
            {
                name: "should-not-have-any-automatically-detectable-accessibility-issues-webkit-video-1",
                objectUrl:
                "/demo-output/analyze-hacker-news-spec-ts/should-not-have-any-automatically-detectable-accessibility-issues-webkit-video-1.webm",
            },
            {
                name: "should-not-have-any-automatically-detectable-accessibility-issues-webkit-video-0",
                objectUrl:
                "/demo-output/analyze-hacker-news-spec-ts/should-not-have-any-automatically-detectable-accessibility-issues-webkit-video-0.webm",
            },
            ],
            testRunFileId: "67b72802a1f91f9ba25bab28",
        },
        {
            testName: "total-blocking-time-chromium",
            suiteName: "performance-testing",
            startTime: new Date(1740056511021).toISOString(),
            duration: 6478,
            status: "PASSED",
            assets: [
            {
                name: "total-blocking-time-chromium-video-0",
                objectUrl:
                "/demo-output/analyze-hacker-news-spec-ts/total-blocking-time-chromium-video-0.webm",
            },
            ],
            testRunFileId: "67b72802a1f91f9ba25bab28",
        },
        {
            testName: "total-blocking-time-firefox",
            suiteName: "performance-testing",
            startTime: new Date(1740056536214).toISOString(),
            duration: 6014,
            status: "PASSED",
            assets: [
            {
                name: "total-blocking-time-firefox-video-0",
                objectUrl:
                "/demo-output/analyze-hacker-news-spec-ts/total-blocking-time-firefox-video-0.webm",
            },
            ],
            testRunFileId: "67b72802a1f91f9ba25bab28",
        },
        {
            testName: "total-blocking-time-webkit",
            suiteName: "performance-testing",
            startTime: new Date(1740056560722).toISOString(),
            duration: 6230,
            status: "PASSED",
            assets: [
            {
                name: "total-blocking-time-webkit-video-0",
                objectUrl:
                "/demo-output/analyze-hacker-news-spec-ts/total-blocking-time-webkit-video-0.webm",
            },
            ],
            testRunFileId: "67b72802a1f91f9ba25bab28",
        },
    ],
    sourceObjectUrl:
        "/demo-input/analyze-hacker-news.spec.ts",
    reporters: {
        htmlStaticUrl:
            "/demo-output/analyze-hacker-news-spec-ts/index.html",
        jsonObjectUrl:
            "/demo-output/analyze-hacker-news-spec-ts/test-results.json",
    },
};

export const testFileSortHackerNews1: TestRunFile = {
    id: "67b727dfdf8d2aa8734c9651",
    name: "sort-hacker-news-articles-1-spec-ts",
    duration: 48744.636,
    status: "FAILED",
    runId: "67b727758bea0db473dde0a9",
    startTime: new Date(1740056493360).toISOString(),
    testsRan: 3,
    testsPassed: 0,
    tests: [
        {
            testName: "run-function-1-chromium",
            startTime: new Date(1740056494266).toISOString(),
            duration: 7137,
            status: "FAILED",
            assets: [
                {
                    name: "run-function-1-chromium-video-3",
                    objectUrl:
                        "/demo-output/sort-hacker-news-articles-1-spec-ts/run-function-1-chromium-video-3.webm",
                },
                {
                    name: "run-function-1-chromium-video-0",
                    objectUrl:
                        "/demo-output/sort-hacker-news-articles-1-spec-ts/run-function-1-chromium-video-0.webm",
                },
                {
                    name: "run-function-1-chromium-video-2",
                    objectUrl:
                        "/demo-output/sort-hacker-news-articles-1-spec-ts/run-function-1-chromium-video-2.webm",
                },
                {
                    name: "run-function-1-chromium-video-1",
                    objectUrl:
                        "/demo-output/sort-hacker-news-articles-1-spec-ts/run-function-1-chromium-video-1.webm",
                },
            ],
        },
        {
            testName: "run-function-1-firefox",
            startTime: new Date(1740056502482).toISOString(),
            duration: 24482,
            status: "FAILED",
            assets: [
                {
                    name: "run-function-1-firefox-video-2",
                    objectUrl:
                        "/demo-output/sort-hacker-news-articles-1-spec-ts/run-function-1-firefox-video-2.webm",
                },
                {
                    name: "run-function-1-firefox-video-3",
                    objectUrl:
                        "/demo-output/sort-hacker-news-articles-1-spec-ts/run-function-1-firefox-video-3.webm",
                },
                {
                    name: "run-function-1-firefox-video-0",
                    objectUrl:
                        "/demo-output/sort-hacker-news-articles-1-spec-ts/run-function-1-firefox-video-0.webm",
                },
                {
                    name: "run-function-1-firefox-video-1",
                    objectUrl:
                        "/demo-output/sort-hacker-news-articles-1-spec-ts/run-function-1-firefox-video-1.webm",
                },
            ],
        },
        {
            testName: "run-function-1-webkit",
            startTime: new Date(1740056529145).toISOString(),
            duration: 12297,
            status: "FAILED",
            assets: [
                {
                    name: "run-function-1-webkit-video-2",
                    objectUrl:
                        "/demo-output/sort-hacker-news-articles-1-spec-ts/run-function-1-webkit-video-2.webm",
                },
                {
                    name: "run-function-1-webkit-video-3",
                    objectUrl:
                        "/demo-output/sort-hacker-news-articles-1-spec-ts/run-function-1-webkit-video-3.webm",
                },
                {
                    name: "run-function-1-webkit-video-1",
                    objectUrl:
                        "/demo-output/sort-hacker-news-articles-1-spec-ts/run-function-1-webkit-video-1.webm",
                },
                {
                    name: "run-function-1-webkit-video-0",
                    objectUrl:
                        "/demo-output/sort-hacker-news-articles-1-spec-ts/run-function-1-webkit-video-0.webm",
                },
            ],
        },
    ],
    sourceObjectUrl:
        "/demo-input/sort-hacker-news-articles-1.spec.ts",
    reporters: {
        htmlStaticUrl:
            "/demo-output/sort-hacker-news-articles-1-spec-ts/index.html",
        jsonObjectUrl:
            "/demo-output/sort-hacker-news-articles-1-spec-ts/test-results.json",
    },
};

export const testFileSortHackerNews2: TestRunFile = {
    id: "67b727e2990ffcb4efc6e354",
    name: "sort-hacker-news-articles-2-spec-ts",
    duration: 45142.837,
    status: "FAILED" as any,
    runId: "67b727758bea0db473dde0a9",
    startTime: new Date(1740056500173).toISOString(),
    testsRan: 3,
    testsPassed: 0,
    tests: [
        {
            testName: "run-function-2-chromium",
            startTime: new Date(1740056501061).toISOString(),
            duration: 6536,
            status: "FAILED" as any,
            assets: [
                {
                    name: "run-function-2-chromium-video-0",
                    objectUrl:
                        "/demo-output/sort-hacker-news-articles-2-spec-ts/run-function-2-chromium-video-0.webm",
                },
                {
                    name: "run-function-2-chromium-video-3",
                    objectUrl:
                        "/demo-output/sort-hacker-news-articles-2-spec-ts/run-function-2-chromium-video-3.webm",
                },
                {
                    name: "run-function-2-chromium-video-1",
                    objectUrl:
                        "/demo-output/sort-hacker-news-articles-2-spec-ts/run-function-2-chromium-video-1.webm",
                },
                {
                    name: "run-function-2-chromium-video-2",
                    objectUrl:
                        "/demo-output/sort-hacker-news-articles-2-spec-ts/run-function-2-chromium-video-2.webm",
                },
            ],
        },
        {
            testName: "run-function-2-firefox",
            startTime: new Date(1740056508662).toISOString(),
            duration: 22036,
            status: "FAILED" as any,
            assets: [
                {
                    name: "run-function-2-firefox-video-2",
                    objectUrl:
                        "/demo-output/sort-hacker-news-articles-2-spec-ts/run-function-2-firefox-video-2.webm",
                },
                {
                    name: "run-function-2-firefox-video-1",
                    objectUrl:
                        "/demo-output/sort-hacker-news-articles-2-spec-ts/run-function-2-firefox-video-1.webm",
                },
                {
                    name: "run-function-2-firefox-video-3",
                    objectUrl:
                        "/demo-output/sort-hacker-news-articles-2-spec-ts/run-function-2-firefox-video-3.webm",
                },
                {
                    name: "run-function-2-firefox-video-0",
                    objectUrl:
                        "/demo-output/sort-hacker-news-articles-2-spec-ts/run-function-2-firefox-video-0.webm",
                },
            ],
        },
        {
            testName: "run-function-2-webkit",
            startTime: new Date(1740056532689).toISOString(),
            duration: 11894,
            status: "FAILED" as any,
            assets: [
                {
                    name: "run-function-2-webkit-video-0",
                    objectUrl:
                        "/demo-output/sort-hacker-news-articles-2-spec-ts/run-function-2-webkit-video-0.webm",
                },
                {
                    name: "run-function-2-webkit-video-1",
                    objectUrl:
                        "/demo-output/sort-hacker-news-articles-2-spec-ts/run-function-2-webkit-video-1.webm",
                },
                {
                    name: "run-function-2-webkit-video-3",
                    objectUrl:
                        "/demo-output/sort-hacker-news-articles-2-spec-ts/run-function-2-webkit-video-3.webm",
                },
                {
                    name: "run-function-2-webkit-video-2",
                    objectUrl:
                        "/demo-output/sort-hacker-news-articles-2-spec-ts/run-function-2-webkit-video-2.webm",
                },
            ],
        },
    ],
    sourceObjectUrl:
        "/demo-input/sort-hacker-news-articles-2.spec.ts",
    reporters: {
        htmlStaticUrl:
            "/demo-output/sort-hacker-news-articles-2-spec-ts/index.html",
        jsonObjectUrl:
            "/demo-output/sort-hacker-news-articles-2-spec-ts/test-results.json",
    },
};

export const testFileSortHackerNews3: TestRunFile = {
    id: "67b727c3833b4b8df937ff5d",
    name: "sort-hacker-news-articles-3-spec-ts",
    duration: 13987.638,
    status: "FAILED" as any,
    runId: "67b727758bea0db473dde0a9",
    startTime: new Date(1740056500582).toISOString(),
    testsRan: 3,
    testsPassed: 0,
    tests: [
        {
            testName: "run-function-3-chromium",
            startTime: new Date(1740056501557).toISOString(),
            duration: 1158,
            status: "FAILED" as any,
            assets: [
                {
                    name: "run-function-3-chromium-video-0",
                    objectUrl:
                        "/demo-output/sort-hacker-news-articles-3-spec-ts/run-function-3-chromium-video-0.webm",
                },
            ],
        },
        {
            testName: "run-function-3-firefox",
            startTime: new Date(1740056503698).toISOString(),
            duration: 4871,
            status: "FAILED" as any,
            assets: [
                {
                    name: "run-function-3-firefox-video-0",
                    objectUrl:
                        "/demo-output/sort-hacker-news-articles-3-spec-ts/run-function-3-firefox-video-0.webm",
                },
            ],
        },
        {
            testName: "run-function-3-webkit",
            startTime: new Date(1740056510661).toISOString(),
            duration: 3078,
            status: "FAILED" as any,
            assets: [
                {
                    name: "run-function-3-webkit-video-0",
                    objectUrl:
                        "/demo-output/sort-hacker-news-articles-3-spec-ts/run-function-3-webkit-video-0.webm",
                },
            ],
        },
    ],
    sourceObjectUrl:
        "/demo-input/sort-hacker-news-articles-3.spec.ts",
    reporters: {
        htmlStaticUrl:
            "/demo-output/sort-hacker-news-articles-3-spec-ts/index.html",
        jsonObjectUrl:
            "/demo-output/sort-hacker-news-articles-3-spec-ts/test-results.json",
    },
};

export const testFiles = [testFileAnalyzeHackerNews, testFileSortHackerNews1, testFileSortHackerNews2, testFileSortHackerNews3];

export const codeAnalyzeHackerNews = `import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test.describe('performance testing', () => {

  // Testing LCP, CLS, and TBT, as they're considered the most important
  // performance testing metrics. Check out Lightout 10 changes per metric:
  // https://nitropack.io/blog/post/lighthouse-10#:~:text=The%20Deprecation%20of%20Time%20to%20Interactive%20(TTI)

  // NOTE: each metric is testing according to QA Wolf standards
  // https://www.qawolf.com/blog/performance-metrics-that-really-matter

  test('page load time under 2 seconds', async ({ page }) => {
    await page.goto("https://news.ycombinator.com");
    await page.waitForLoadState();

    // Capture load event timing
    const loadEventTime = await page.evaluate(() => window.performance.timing.loadEventEnd);
    const navigationStartTime = await page.evaluate(() => window.performance.timing.navigationStart);

    const pageLoadTime = loadEventTime - navigationStartTime;
    console.log(\`Page load time: \${pageLoadTime} ms\`);
    expect(pageLoadTime).toBeLessThan(2000);
  });

  test('largest contextful paint', async ({ page }) => {
    await page.goto("https://news.ycombinator.com");

    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          observer.disconnect(); // Disconnect the observer once the LCP is captured
        });
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
   
        // In case LCP is not available, set a timeout
        setTimeout(() => {
          observer.disconnect();
          resolve(0);
        }, 5000);
      });
    });

    console.log(\`Largest Contentful Paint (LCP): \${lcp} ms\`);
    expect(lcp).toBeLessThan(2500);
  });

  // NOTE: The CLS for this page is 0, but it's good practice to test it for 
  // webpages regardless
  test.skip('cumulative layout shift', async ({ page }) => {
    await page.goto("https://news.ycombinator.com");

    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let cls = 0;

        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          for(const entry of entries) {
            // cls += entry.value;
          }
          resolve(cls);
        });
        observer.observe({ type: 'layout-shift', buffered: true})

        // In case the CLS isn't available, set a timeout
        setTimeout(() => {
          observer.disconnect();
          resolve(cls);
        }, 10000);
      });
    });

    console.log(\`Cumulative Layout Shift (LCP): \${cls} ms\`);
    expect(cls).toBeLessThan(15);
  });

  test('total blocking time', async ({ page }) => {
    await page.goto("https://news.ycombinator.com");

    const totalBlockingTime = await page.evaluate(() => {
      return new Promise((resolve) => {
        let tbt = 0;

        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          for (const entry of entries) {
            const blockTime = entry.duration - 50;

            // If the duration of the task is beyond 50 ms, add the blocking time
            if (blockTime > 0) tbt += blockTime;
          }
          resolve(tbt);
        });
        observer.observe({ type: 'longtask', buffered: true });

        // In case TBT is not available, set a timeout
        setTimeout(() => {
          observer.disconnect();
          resolve(tbt);
        }, 5000);
      });
    });

    console.log(\`Total Blocking Time (TBT): \${totalBlockingTime} ms\`);
    expect(totalBlockingTime).toBeLessThan(200);
  });

  test('first contentful paint', async ({ page }) => {
    await page.goto("https://news.ycombinator.com");

    // Execute script to capture paint timings and extract FCP
    const fcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        if (window.performance) {
          // Use the PerformanceObserver to listen for 'paint' entries
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntriesByName('first-contentful-paint');
            if (entries.length > 0) {
              observer.disconnect(); // Disconnect the observer once FCP is captured
              const fcpEntry = entries[0];
              resolve(fcpEntry.startTime); // Resolve with the FCP time
            }
          });
          observer.observe({ type: 'paint', buffered: true });
        } else {
          resolve(null); // Resolve with null if the Performance API is not supported
        }
      });
    });

    console.log(\`First Contentful Paint (FCP): \${fcp} ms\`);
    expect(fcp).toBeLessThan(1800);
  });

});

test.describe('accessibility testing', () => {

  // Scans an entire page for accessibility issues using axe accessibility testing
  // engine (Deque Axe library)
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('https://news.ycombinator.com');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

});
`

export const codeSortHackerNews1 = `import { chromium, Locator } from "playwright";
import test, { expect, Page } from "@playwright/test";

// Number of articles to analyze total
const NUM_ARTICLES = 100;

interface TimeData {
    first: number; // timestamp of the first article on the page
    last: number; // timestamp of the last article on the page
}

/**
 * Validates that EXACTLY the first \`NUM_ARTICLES\` articles on Hacker News 
 * are sorted from newest to oldest.
 *
 * Performs analysis as new pages are being found. Creates a new page for each
 * page of articles to analyze.
 */
async function sortHackerNewsArticles(page: Page) {
    console.log("sortHackerNewsArticles start");

    // Store the promises for analyzing each page
    const analysis: Promise<TimeData>[] = [];

    let numArticles = 0;
    let nextPage = page;
    await nextPage.goto("https://news.ycombinator.com/newest");

    console.log("starting loop");

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
        analysis.push(analyzeHackerNewsPage(rows, numNewArticles));

        // Get the next page if there's still articles left
        if (numArticles < NUM_ARTICLES) {
            const link = await rows[rows.length - 1].getByRole("link");
            const nextPageLink = await link.getAttribute("href");
            expect(nextPageLink).not.toBeNull();
            nextPage = await page.context().newPage();
            await nextPage.goto(\`https://news.ycombinator.com/\${nextPageLink!}\`);
        }
    }

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
 * Waits for \`ms\` milliseconds
 * @param {number} ms The number of milliseconds to wait for
 * @returns A promise to await for the delay to finish
 */
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Validates that \`numArticles\` articles on a single page of Hacker News/newest
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

test("run function 1", async ({ page }) => {
    await sortHackerNewsArticles(page);
});
`

export const codeSortHackerNews2 = `import { chromium, Locator } from "playwright";
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
 * Validates that EXACTLY the first \`NUM_ARTICLES\` articles on Hacker News 
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
            await nextPage.goto(\`https://news.ycombinator.com/\${nextPageLink}\`);
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
 * Waits for \`ms\` milliseconds
 * @param {number} ms The number of milliseconds to wait for
 * @returns A promise to await for the delay to finish
 */
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Validates that \`numArticles\` articles on a single page of Hacker News/newest
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
`

export const codeSortHackerNews3 = `import { chromium, Locator } from "playwright";
import test, { expect, Page } from "@playwright/test";

// Number of articles to analyze total
const NUM_ARTICLES = 100;

interface TimeData {
    first: number; // timestamp of the first article on the page
    last: number; // timestamp of the last article on the page
}

/**
 * Validates that EXACTLY the first \`NUM_ARTICLES\` articles on Hacker News 
 * are sorted from newest to oldest.
 *
 * Performs analysis as new pages are being found. Only uses a single page.
 */
async function sortHackerNewsArticles3(page: Page) {
    console.log("sortHackerNewsArticles start");

    // Store the promises for analyzing each page
    const analysis: Promise<TimeData>[] = [];

    let numArticles = 0;
    let nextPage = page;
    await nextPage.goto("https://news.ycombinator.com/newest");

    console.log("starting loop");

    while (numArticles < NUM_ARTICLES) {
        let fault = page.getByText("Sorry, we're not able to serve your requests this quickly.");
        while(fault && await fault.count() != 0) {
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
        analysis.push(analyzeHackerNewsPage(rows, numNewArticles));

        // Get the next page if there's still articles left
        if (numArticles < NUM_ARTICLES) {
            const link = await rows[rows.length - 1].getByRole("link");
            const nextPageLink = await link.getAttribute("href");
            expect(nextPageLink).not.toBeNull();
            await nextPage.goto(\`https://news.ycombinator.com/\${nextPageLink!}\`);
        }
    }

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
 * Waits for \`ms\` milliseconds
 * @param {number} ms The number of milliseconds to wait for
 * @returns A promise to await for the delay to finish
 */
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Validates that \`numArticles\` articles on a single page of Hacker News/newest
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

test("run function 3", async ({ page }) => {
    await sortHackerNewsArticles3(page);
});
`

export const defaultCode = [
    codeAnalyzeHackerNews,
    codeSortHackerNews1,
    codeSortHackerNews2,
    codeSortHackerNews3,
]