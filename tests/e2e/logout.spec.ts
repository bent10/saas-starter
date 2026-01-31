import { test, expect } from '@playwright/test';

test.describe('User Logout', () => {
  test('should allow a logged-in user to logout', async ({ page }) => {
    // 1. Log in
    await page.goto('/en/login');
    await page.getByPlaceholder('m@example.com').fill('user@example.com');
    await page.getByPlaceholder('******').fill('Password123!');
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    // Wait for dashboard to confirm login
    await expect(page).toHaveURL(/.*\/en\/dashboard/);

    // 2. Perform Logout
    // Locate the logout button in the dashboard sidebar
    await page.getByRole('button', { name: 'Log out' }).click();

    // 3. Verify Redirect
    await expect(page).toHaveURL(/.*\/en\/login/);

    // 4. Verify Session Cleared (Back button protection / Direct access)
    await page.goto('/en/dashboard');
    await expect(page).toHaveURL(/.*\/en\/login/);
  });
});
