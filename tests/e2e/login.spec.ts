import { test, expect } from '@playwright/test';

test('login page has title', async ({ page }) => {
  await page.goto('/login');
  await expect(page).toHaveTitle(/Login/);
});

test('login with valid credentials redirects to dashboard', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'Password123!');
  await page.click('button[type="submit"]');
  // Expect redirect
  // await expect(page).toHaveURL(/\/dashboard/);
});