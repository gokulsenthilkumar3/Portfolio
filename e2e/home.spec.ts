import { test, expect } from '@playwright/test'

test('renders a specific, navigable hero', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/Gokul Senthilkumar/)
  await expect(page.locator('section#home')).toBeVisible()
  await expect(page.getByRole('heading', { name: /I build software that earns trust/i })).toBeVisible()
  await expect(page.getByRole('link', { name: /Selected work/i }).first()).toHaveAttribute('href', '#projects')
})

test('primary navigation points to the sections in reading order', async ({ page }) => {
  await page.goto('/')

  const nav = page.getByRole('navigation', { name: 'Primary navigation' })
  await expect(nav.getByRole('link', { name: 'Work' })).toHaveAttribute('href', '/#projects')
  await expect(nav.getByRole('link', { name: 'Profile' })).toHaveAttribute('href', '/#profile')
  await expect(nav.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/#about')

  await nav.getByRole('link', { name: 'Work' }).click()
  await expect(page).toHaveURL(/#projects$/)
})

test('project details open as a focus-managed dialog', async ({ page }) => {
  await page.goto('/')
  await page.locator('#projects').scrollIntoViewIfNeeded()

  const trigger = page.getByRole('button', { name: /View details for VaultIQ/i })
  await trigger.click()

  const dialog = page.getByRole('dialog', { name: 'VaultIQ' })
  await expect(dialog).toBeVisible()
  await expect(page.getByRole('button', { name: 'Close project details' })).toBeFocused()

  await page.getByRole('button', { name: 'Close project details' }).click()
  await expect(trigger).toBeFocused()
})

test('mobile navigation and skills filter remain operable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  const menuButton = page.getByRole('button', { name: 'Open navigation' })
  await menuButton.click()
  await expect(page.getByRole('dialog', { name: 'Mobile navigation' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(menuButton).toBeFocused()

  const testingFilter = page.getByRole('button', { name: 'Test engineering' })
  await testingFilter.click()
  await expect(page.locator('.skills-marquee__row')).toHaveCount(1)
  await expect(page.locator('.skills-marquee__status')).toContainText('test engineering')
})
