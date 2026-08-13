/* global customElements */

const { test, expect } = require('@playwright/test')

test('named hash is appended to component JavaScript', async ({ page }) => {
  const assetRequests = []

  page.on('request', request => {
    if (/CacheBuster\.js/.test(request.url())) assetRequests.push(request.url())
  })

  await page.goto('e2e/nested/cache-buster.html')
  await page.locator('x-cache-buster').waitFor()
  await page.waitForFunction(() => customElements.get('x-cache-buster'))
  await page.waitForFunction(() => globalThis.cacheBusterImportPath)
  await page.waitForLoadState('networkidle')
  const hash = '20260813120000'
  const componentRequest = assetRequests
    .map(url => new URL(url))
    .find(url => url.pathname === '/src/es/components/web-components-toolbox/e2e/cache-buster/CacheBuster.js')

  expect(componentRequest).toBeDefined()
  expect(componentRequest.searchParams.get('variant')).toBe('test')
  expect(componentRequest.searchParams.getAll('hash')).toEqual([hash])
  expect(await page.evaluate(() => globalThis.cacheBusterImportPath)).toBe(`./src/es/components/web-components-toolbox/e2e/cache-buster/CacheBuster.js?variant=test&hash=${hash}`)
})
