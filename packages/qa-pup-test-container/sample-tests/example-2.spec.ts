import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

test.describe('Additional tests', () => {
  test('has search input', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Expect the search input to be visible.
    // await expect(page.locator('input')).toBeVisible();
  });

  test('has non-existing element', async ({ page }) => {
    await page.goto('https://playwright.dev/');

    // Expect a non-existing element to be visible (intentional failure).
    await expect(page.locator('.non-existing-element')).toBeVisible();
  });
});
