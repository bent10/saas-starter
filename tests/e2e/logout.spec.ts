import { test, expect } from '@playwright/test';

test.describe('User Logout', () => {
  test('should allow a logged-in user to logout', async ({ page }) => {
    // 1. Log in
    // Note: This relies on a seeded user or registration flow. 
    // For now, we assume these credentials exist or will be mocked/handled.
    await page.goto('/login');
    await page.getByPlaceholder('m@example.com').fill('user@example.com');
    await page.getByPlaceholder('Password').fill('Password123!');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Wait for dashboard to confirm login
    await expect(page).toHaveURL(/\/dashboard/);

    // 2. Perform Logout
    // Locate the user menu trigger (avatar or name) if logout is hidden, 
    // or the logout button directly if visible in sidebar.
    // Based on the plan, it's in the dashboard sidebar or user profile menu.
    // We'll try to find a button named "Logout".
    await page.getByRole('button', { name: 'Logout' }).click();

    // 3. Verify Redirect
    await expect(page).toHaveURL(/\/login/);

    // 4. Verify Session Cleared (Back button protection / Direct access)
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });
});
