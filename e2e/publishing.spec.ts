import { test, expect } from '@playwright/test'
import nextEnv from '@next/env'
import fs from 'node:fs'
import path from 'node:path'

test('a saved draft remains private until Publish, then updates the public page', async ({ page }) => {
  const targetUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3100'
  test.skip(!/^http:\/\/(localhost|127\.0\.0\.1):(3000|3100)\/?$/.test(targetUrl), 'Publishing test only runs against the local portfolio')
  nextEnv.loadEnvConfig(process.cwd())
  test.skip(!process.env.JWT_SECRET, 'Admin signing secret is not configured for this environment')

  const localFiles = ['.portfolio-admin-data.json', '.portfolio-published-data.json'].map((name) => {
    const file = path.join(process.cwd(), name)
    return { file, original: fs.existsSync(file) ? fs.readFileSync(file) : null }
  })

  const { generateToken, getCookieName } = await import('../src/lib/admin/auth')
  await page.context().addCookies([{ name: getCookieName(), value: generateToken(), url: targetUrl }])
  const api = page.request
  const publicBefore = await (await api.get('/api/portfolio')).json()
  const adminBefore = await (await api.get('/api/admin/portfolio')).json()
  const changedHeading = 'A draft heading for publishing verification.'
  const changedAbout = { ...adminBefore.about, projectsHeading: changedHeading, privateDraftNote: 'editor-only marker' }

  try {
    const draftSave = await api.put('/api/admin/portfolio', {
      data: { section: 'about', data: changedAbout },
    })
    expect(draftSave.ok(), `${draftSave.status()} ${await draftSave.text()}`).toBeTruthy()
    const stillPublic = await (await api.get('/api/portfolio')).json()
    expect(stillPublic.about.projectsHeading).toBe(publicBefore.about.projectsHeading)

    const publish = await api.post('/api/admin/save', {
      data: { ...adminBefore, about: changedAbout },
    })
    expect(publish.ok(), await publish.text()).toBeTruthy()
    const publicAfter = await (await api.get('/api/portfolio')).json()
    expect(publicAfter.about.projectsHeading).toBe(changedHeading)
    expect(publicAfter.about.privateDraftNote).toBeUndefined()
    await page.goto('/#projects')
    await expect(page.getByRole('heading', { name: changedHeading })).toBeVisible()
  } finally {
    try {
      await api.put('/api/admin/portfolio', {
        data: { section: 'about', data: adminBefore.about },
      })
      await api.post('/api/admin/save', { data: publicBefore })
    } finally {
      for (const { file, original } of localFiles) {
        if (original === null && fs.existsSync(file)) fs.unlinkSync(file)
        else if (original !== null) fs.writeFileSync(file, original)
      }
    }
  }
})
