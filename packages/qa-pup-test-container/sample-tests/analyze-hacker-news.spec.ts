import { test, expect } from '@playwright/test';
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
    console.log(`Page load time: ${pageLoadTime} ms`);
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

    console.log(`Largest Contentful Paint (LCP): ${lcp} ms`);
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

    console.log(`Cumulative Layout Shift (LCP): ${cls} ms`);
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

    console.log(`Total Blocking Time (TBT): ${totalBlockingTime} ms`);
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

    console.log(`First Contentful Paint (FCP): ${fcp} ms`);
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