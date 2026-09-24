import { test, expect } from '@playwright/test'
import { portfolioConfig } from '../src/config/portfolio.config'

test('renders a specific, navigable hero', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/Gokul Senthilkumar/)
  await expect(page.locator('section#home')).toBeVisible()
  await expect(page.getByRole('heading', { name: /I build software that earns trust/i })).toBeVisible()
  await expect(page.getByRole('link', { name: /View all projects/i }).first()).toHaveAttribute('href', '#projects')
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
  await page.locator('.projects-gallery__stage').scrollIntoViewIfNeeded()

  const trigger = page.getByRole('button', { name: /View details for ForgeOS/i })
  await trigger.click()

  const dialog = page.getByRole('dialog', { name: 'ForgeOS' })
  await expect(dialog).toBeVisible()
  await expect(page.getByRole('button', { name: 'Close project details' })).toBeFocused()

  await page.getByRole('button', { name: 'Close project details' }).click()
  await expect(trigger).toBeFocused()
})

test('projects scroll inside their container without pinning the page', async ({ page }) => {
  await page.goto('/')
  const gallery = page.locator('.projects-gallery__track')
  await page.locator('.projects-gallery__stage').scrollIntoViewIfNeeded()
  expect(await gallery.evaluate((element) => element.scrollWidth > element.clientWidth)).toBeTruthy()

  await page.getByRole('button', { name: 'Next project' }).click()
  await expect(page.locator('.projects-gallery__position')).toContainText('02 / 10')
  const horizontalPosition = await gallery.evaluate((element) => element.scrollLeft)
  expect(horizontalPosition).toBeGreaterThan(0)

  await page.locator('#profile').scrollIntoViewIfNeeded()
  await expect(page.locator('#profile')).toBeInViewport()
  expect(await gallery.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0)
})

test('the horizontal project tour wraps from ten back to one', async ({ page }) => {
  await page.goto('/')
  const gallery = page.locator('.projects-gallery__track')
  await page.locator('.projects-gallery__stage').scrollIntoViewIfNeeded()
  await gallery.evaluate((element) => {
    const tenth = element.querySelectorAll<HTMLElement>('.project-card:not([data-loop-clone])')[9]
    element.scrollLeft = tenth.offsetLeft - (element.clientWidth - tenth.offsetWidth) / 2
  })
  await expect(page.locator('.projects-gallery__position')).toContainText('10 / 10')
  await page.getByRole('button', { name: 'Next project' }).click()
  await expect(page.locator('.projects-gallery__position')).toContainText('01 / 10')
  await expect.poll(() => gallery.evaluate((element) => element.scrollLeft)).toBe(0)
})

test('shows current selected work, credentials, and research', async ({ page }) => {
  await page.goto('/')
  for (const project of ['ForgeOS', 'EverGreen One', 'Nexora', 'AgroOS', 'VeriLex AI', 'GrowthTrack Ultimate', 'FindThemNow', 'Velo', 'Lang', 'OS']) {
    await expect(page.getByRole('button', { name: `View details for ${project}` })).toBeAttached()
  }
  await expect(page.locator('.project-card:not([data-loop-clone])')).toHaveCount(10)
  await expect(page.getByRole('button', { name: 'View details for Portfolio v4' })).toHaveCount(0)
  await expect(page.getByText('Research phase')).toHaveCount(2)
  const firstCard = page.locator('.project-card:not([data-loop-clone])').first()
  const lastCard = page.locator('.project-card:not([data-loop-clone])').last()
  expect((await lastCard.boundingBox())!.x).toBeGreaterThan((await firstCard.boundingBox())!.x)
  await expect(page.getByText('01 / 10')).toBeVisible()
  const playTour = page.getByRole('button', { name: 'Play project tour' })
  await playTour.click()
  await expect(page.getByRole('button', { name: 'Pause project tour' })).toBeVisible()
  await page.getByRole('button', { name: 'Pause project tour' }).click()
  await expect(page.getByText('Microsoft Certified: Azure Data Scientist Associate')).toBeAttached()
  await expect(page.getByText(/Research archive · Forex Forecasting Research/i)).toBeAttached()
})

test('navigation targets and public assets resolve', async ({ page, request }) => {
  await page.goto('/')
  for (const id of ['home', 'projects', 'profile', 'about', 'skills', 'contact']) {
    await expect(page.locator(`section#${id}`)).toHaveCount(1)
  }
  const assets = await page.locator('img').evaluateAll((images) => images.map((image) => image.getAttribute('src')).filter(Boolean))
  const projectCovers = portfolioConfig.projects.filter((project) => project.featured).map((project) => project.images?.[0]).filter((asset): asset is string => Boolean(asset))
  for (const asset of ['/Gokul_S_Resume.pdf', '/gokul-photo.jpg', ...projectCovers, ...assets.filter((src) => src?.startsWith('/projects/'))]) {
    const response = await request.get(asset!)
    expect(response.ok(), `${asset} should load`).toBeTruthy()
  }
  await expect(page.locator('.project-card:not([data-loop-clone]) .project-card__art-label')).toHaveCount(10)
})

test('admin can edit the hero copy in the live preview', async ({ page }) => {
  await page.route('**/api/admin/portfolio', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ personal: portfolioConfig.personal }),
  }))
  await page.goto('/')
  await page.getByRole('button', { name: 'Edit Hero section' }).click()
  await page.getByLabel(/Hero headline/).fill('I build reliable <em>systems.</em>')
  await page.getByRole('button', { name: 'Save Changes' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('I build reliable systems.')
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
