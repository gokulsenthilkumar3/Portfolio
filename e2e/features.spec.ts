import { test, expect } from '@playwright/test'

test('project browsing and command navigation work on a short mobile screen', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 650 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Browse all', exact: true }).click()
  await page.getByRole('searchbox', { name: 'Search projects' }).fill('Velo')
  await page.getByRole('combobox', { name: 'Category' }).selectOption('mobile')
  await expect(page.locator('#projects .content-card')).toHaveCount(1)
  await page.locator('#projects').getByRole('link', { name: 'Velo', exact: true }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Velo' })).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Table of contents' })).toBeVisible()
  await page.getByRole('button', { name: /Find a page/ }).click()
  const dialog = page.getByRole('dialog', { name: 'Find a page or project' })
  await dialog.getByRole('textbox').fill('Resume')
  await dialog.getByRole('link', { name: 'Resume', exact: true }).click()
  await page.waitForURL('**/resume/')
  await expect(page.locator('.resume-page')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Print / save PDF' })).toBeVisible()
})

test('contact retains a failed message and clears it after a successful retry', async ({ page }) => {
  let attempt = 0
  await page.route('**/api/contact**', route => {
    attempt += 1
    return route.fulfill({ status: attempt === 1 ? 503 : 200, json: { ok: attempt > 1, message: attempt === 1 ? 'Please try again.' : 'Message received.' } })
  })
  await page.goto('/')
  const form = page.locator('#contact form')
  await form.getByRole('textbox', { name: 'Name', exact: true }).fill('Portfolio visitor')
  await form.getByRole('textbox', { name: 'Email', exact: true }).fill('visitor@example.com')
  await form.getByRole('textbox', { name: 'Subject', exact: true }).fill('Project question')
  await form.getByRole('textbox', { name: 'Message', exact: true }).fill('I would like to learn more about this project.')
  await form.getByRole('button', { name: 'Send message' }).click()
  await expect(form.getByRole('status')).toHaveText('Please try again.')
  await expect(form.getByRole('textbox', { name: 'Subject', exact: true })).toHaveValue('Project question')
  await form.getByRole('button', { name: 'Send message' }).click()
  await expect(form.getByRole('status')).toHaveText('Message received.')
  await expect(form.getByRole('textbox', { name: 'Subject', exact: true })).toBeEmpty()
})

test('public routes, feed and project social image resolve', async ({ request }) => {
  for (const path of ['/now/', '/uses/', '/resume/', '/blog/', '/guestbook/', '/feed.xml/', '/projects/velo/opengraph-image/']) {
    const response = await request.get(path)
    expect(response.ok(), path + ' should resolve').toBeTruthy()
  }
  const unknown = await request.get('/not-a-real-section/')
  expect(unknown.status()).toBe(404)
})
