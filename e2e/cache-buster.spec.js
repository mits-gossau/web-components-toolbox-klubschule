/* global customElements */

const { test, expect } = require('@playwright/test')

test('named hash is propagated through a statically imported component', async ({ page }) => {
  const assetRequests = []

  page.on('request', request => {
    if (/CacheBuster(?:Child|Dependency|OptOutChild|OptOutDependency)?\.js/.test(request.url())) assetRequests.push(request.url())
  })

  await page.goto('e2e/nested/cache-buster.html')
  await page.locator('x-cache-buster').waitFor({ state: 'attached' })
  await page.waitForFunction(() => customElements.get('x-cache-buster'))
  await page.waitForFunction(() => globalThis.cacheBusterImportPath)
  await page.waitForLoadState('networkidle')
  const hash = '20260813120000'
  const componentRequest = assetRequests
    .map(url => new URL(url))
    .find(url => url.pathname === '/src/es/components/web-components-toolbox/e2e/cache-buster/CacheBuster.js')
  const childRequest = assetRequests
    .map(url => new URL(url))
    .find(url => url.pathname === '/src/es/components/web-components-toolbox/e2e/cache-buster/CacheBusterChild.js')
  const dependencyRequest = assetRequests
    .map(url => new URL(url))
    .find(url => url.pathname === '/src/es/components/web-components-toolbox/e2e/cache-buster/CacheBusterDependency.js')
  const optOutChildRequest = assetRequests
    .map(url => new URL(url))
    .find(url => url.pathname === '/src/es/components/web-components-toolbox/e2e/cache-buster/CacheBusterOptOutChild.js')
  const optOutDependencyRequest = assetRequests
    .map(url => new URL(url))
    .find(url => url.pathname === '/src/es/components/web-components-toolbox/e2e/cache-buster/CacheBusterOptOutDependency.js')

  expect(componentRequest).toBeDefined()
  expect(componentRequest.searchParams.get('variant')).toBe('test')
  expect(componentRequest.searchParams.getAll('hash')).toEqual([hash])
  expect(await page.evaluate(() => globalThis.cacheBusterImportPath)).toBe(`./src/es/components/web-components-toolbox/e2e/cache-buster/CacheBuster.js?variant=test&hash=${hash}`)
  expect(childRequest).toBeDefined()
  expect(childRequest.searchParams.getAll('hash')).toEqual([])
  expect(dependencyRequest).toBeDefined()
  expect(dependencyRequest.searchParams.get('variant')).toBe('test')
  expect(dependencyRequest.searchParams.getAll('hash')).toEqual([hash])
  expect(optOutChildRequest).toBeDefined()
  expect(optOutChildRequest.searchParams.getAll('hash')).toEqual([''])
  expect(optOutDependencyRequest).toBeDefined()
  expect(optOutDependencyRequest.searchParams.get('variant')).toBe('test')
  expect(optOutDependencyRequest.searchParams.getAll('hash')).toEqual([])
})

test('component assets remain unchanged without a configured hash', async ({ page }) => {
  const dependencyRequests = []

  page.on('request', request => {
    if (/CacheBusterDependency\.js/.test(request.url())) dependencyRequests.push(new URL(request.url()))
  })

  await page.goto('e2e/nested/cache-buster-no-hash.html')
  await page.waitForFunction(() => customElements.get('x-cache-buster-dependency'))
  await page.waitForLoadState('networkidle')

  expect(dependencyRequests).toHaveLength(1)
  expect(dependencyRequests[0].searchParams.get('variant')).toBe('test')
  expect(dependencyRequests[0].searchParams.getAll('hash')).toEqual([])
})
