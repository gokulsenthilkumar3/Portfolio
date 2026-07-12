import { test, expect } from '@playwright/test';

test('has title and hero section', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Gokul Senthilkumar/);

  // Expect the hero section to be visible
  await expect(page.locator('section#home')).toBeVisible();
});

test('navigation links work', async ({ page }) => {
  await page.goto('/');

  // Click on "Explore Projects"
  const projectsLink = page.getByRole('link', { name: /Explore Projects/i });
  if (await projectsLink.isVisible()) {
    await projectsLink.click();
    await expect(page).toHaveURL(/.*#projects/);
  }
});
