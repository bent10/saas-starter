import { test, expect } from '@playwright/test';

test('unauthenticated user is redirected to login', async ({ page }) => {
  await page.goto('/en/dashboard');
  await expect(page).toHaveURL(/.*\/en\/login/);
});

test('banned user cannot login', async ({ page }) => {
  // Mock banning user or use a pre-banned user
  // Since we can't easily ban in E2E without admin, we might skip or mock
  test.skip('Requires admin setup to ban user first');
});

test('mfa flow', async ({ page }) => {
   // Requires MFA setup
   test.skip('Requires MFA enrollment');
});
