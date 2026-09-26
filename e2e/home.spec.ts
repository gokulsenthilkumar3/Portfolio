import { test, expect } from '@playwright/test'
import { portfolioConfig } from '../src/config/portfolio.config'

test('renders a specific, navigable hero', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/Gokul Senthilkumar/)
  await expect(page.locator('section#home')).toBeVisible()
  await expect(page.getByRole('heading', { name: /I test the seams. Then I build./i })).toBeVisible()
  await expect(page.getByText('Focused on current work')).toBeVisible()
  await expect(page.getByRole('link', { name: /View all projects/i }).first()).toHaveAttribute('href', '#projects')
})

test('primary navigation points to the sections in reading order', async ({ page }) => {
  await page.goto('/')

  const nav = page.getByRole('navigation', { name: 'Primary navigation' })
  await expect(nav.getByRole('link', { name: 'Work' })).toHaveAttribute('href', '/#projects')
  await expect(nav.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/#about')
  await expect(nav.getByRole('link', { name: 'Say hello' })).toHaveAttribute('href', '/#contact')

  await nav.getByRole('link', { name: 'Work' }).click()
  await expect(page).toHaveURL(/#projects$/)
})

test('project details open as a focus-managed dialog', async ({ page }) => {
  await page.goto('/')
  await page.locator('.projects-gallery__stage').scrollIntoViewIfNeeded()
  const bounds = await page.locator('.projects-gallery__track').boundingBox()
  if (bounds) await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2)

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

  await page.locator('#about').scrollIntoViewIfNeeded()
  await expect(page.locator('#about')).toBeInViewport()
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
  await expect(page.locator('.projects-gallery__position')).toContainText('01 / 10')
  await expect(page.getByRole('button', { name: 'Pause project tour' })).toBeVisible()
  await page.getByRole('button', { name: 'Pause project tour' }).click()
  await expect(page.getByRole('button', { name: 'Play project tour' })).toBeVisible()
  await expect(page.getByText('Microsoft Certified: Azure Data Scientist Associate')).toBeAttached()
  await expect(page.getByText(/Research archive · Forex Forecasting Research/i)).toBeAttached()
})

test('navigation targets and public assets resolve', async ({ page, request }) => {
  await page.goto('/')
  for (const id of ['home', 'projects', 'about', 'skills', 'contact']) {
    await expect(page.locator(`section#${id}`)).toHaveCount(1)
  }
  await expect(page.locator('#profile')).toHaveCount(1) // old deep links still land inside About
  const assets = await page.locator('img').evaluateAll((images) => images.map((image) => image.getAttribute('src')).filter(Boolean))
  const projectCovers = portfolioConfig.projects.filter((project) => project.featured).map((project) => project.images?.[0]).filter((asset): asset is string => Boolean(asset))
  for (const asset of ['/Gokul_S_Resume.pdf', '/gokul-photo.jpg', ...projectCovers, ...assets.filter((src) => src?.startsWith('/projects/'))]) {
    const response = await request.get(asset!)
    expect(response.ok(), `${asset} should load`).toBeTruthy()
  }
  await expect(page.locator('.project-card:not([data-loop-clone]) .project-card__art-label')).toHaveCount(10)
  await expect(page.locator('.project-card:not([data-loop-clone]) .project-card__art-label').filter({ hasText: 'Prototype screen' })).toHaveCount(1)
})

test('project tour auto-plays only while visible and respects reduced motion', async ({ page }) => {
  await page.goto('/')
  const gallery = page.locator('.projects-gallery__track')
  await page.mouse.move(0, 0)
  await expect(gallery).toHaveAttribute('data-playing', 'false')
  await gallery.scrollIntoViewIfNeeded()
  await page.mouse.move(page.viewportSize()!.width / 2, 1)
  await expect(gallery).toHaveAttribute('data-playing', 'true')
  const start = await gallery.evaluate((element) => element.scrollLeft)
  await expect.poll(() => gallery.evaluate((element) => element.scrollLeft)).toBeGreaterThan(start + 10)
  await page.getByRole('button', { name: 'Pause project tour' }).click()
  await expect(gallery).toHaveAttribute('data-playing', 'false')

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(gallery).toHaveAttribute('data-playing', 'false')
  await expect(page.getByRole('button', { name: 'Pause project tour' })).toBeHidden()
})

test('each current project has a readable case study and source link', async ({ page, request }) => {
  await page.goto('/projects/velo')
  await expect(page.getByRole('heading', { level: 1, name: 'Velo' })).toBeVisible()
  await expect(page.getByText(/planned Android app and backend are not yet implemented/i)).toBeVisible()
  await expect(page.getByText(/static rider UI prototype/i)).toBeVisible()
  await expect(page.getByRole('link', { name: /View repository/i })).toHaveAttribute('href', 'https://github.com/gokulsenthilkumar3/Velo')
  const data = await (await request.get('/api/portfolio')).json()
  expect(data.projects.filter((project: { id: string }) => project.id !== 'forex-prediction')).toHaveLength(10)
  const unauthorized = await request.post('/api/admin/save', { data })
  expect(unauthorized.status()).toBe(401)
})

test('all gallery projects have rendered case studies with matching repository links', async ({ request }) => {
  const data = await (await request.get('/api/portfolio')).json()
  const projects = data.projects.filter((project: { kind?: string }) => project.kind !== 'research')
  expect(projects).toHaveLength(10)
  for (const project of projects) {
    const response = await request.get(`/projects/${project.id}`)
    expect(response.ok(), `${project.id} case study should load`).toBeTruthy()
    const html = await response.text()
    expect(html).toContain(project.title)
    expect(html).toContain(project.links.github)
    expect(html).toContain(project.mediaCaption)
  }
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
