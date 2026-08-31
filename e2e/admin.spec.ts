import { test, expect } from '@playwright/test'

test('admin route is an isolated authentication gate', async ({ page }) => {
  await page.goto('/admin')

  await expect(page.getByRole('heading', { name: 'Admin access', exact: true })).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toHaveCount(0)
  await expect(page.getByRole('dialog', { name: 'Admin access code' })).toBeVisible()

  await page.getByRole('button', { name: 'Close' }).click()
  await expect(page).toHaveURL(/\/$/)
})
