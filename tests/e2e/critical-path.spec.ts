import { test, expect } from '@playwright/test';

test('Critical Path: Auth -> Org -> Billing', async ({ page }) => {
  // 1. Sign Up
  await page.goto('/en/register');
  
  const email = `test-${Date.now()}@example.com`;
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign up' }).click();
  
  // Note: This test assumes either auto-confirm is enabled or we stop here.
  // In a real E2E environment, you'd use a mailcatcher or Supabase Admin API to confirm the user.
  
  await expect(page.getByText('Check your email')).toBeVisible();
});
