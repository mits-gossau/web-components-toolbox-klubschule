// @ts-check
const { test, expect } = require('@playwright/test')

test.describe('Kunden Portal Basic Tests', () => {
  test('should load the Kunden Portal page successfully', async ({ page }) => {
    // Navigate to the page
    await page.goto('/src/es/kunden-portal/index.html')

    // Check that the page loads
    expect(await page.title()).toBe('Kunden Portal')

    // Wait for the basic web components structure to load
    await page.waitForSelector('body[wc-config-load]', { timeout: 10000 })

    // Check if main components exist
    const fetchHtml = page.locator('c-fetch-html')
    const fetchCss = page.locator('c-fetch-css')
    const fetchModules = page.locator('c-fetch-modules')

    expect(await fetchHtml.count()).toBe(1)
    expect(await fetchCss.count()).toBe(1)
    expect(await fetchModules.count()).toBe(1)
  })

  test('should load core page structure', async ({ page }) => {
    await page.goto('/src/es/kunden-portal/index.html')
    await page.waitForSelector('body[wc-config-load]', { timeout: 10000 })

    // Check for page structure components
    expect(await page.locator('p-general').count()).toBe(1)
    expect(await page.locator('o-body').count()).toBe(1)
    expect(await page.locator('ks-o-body-section').count()).toBe(1)
    expect(await page.locator('kp-router').count()).toBe(1)
  })

  test('should load dashboard component', async ({ page }) => {
    await page.goto('/src/es/kunden-portal/index.html')
    await page.waitForSelector('body[wc-config-load]', { timeout: 10000 })

    // Wait for router to initialize
    await page.waitForSelector('kp-router', { timeout: 10000 })
    
    // Wait for dashboard to be attached to the DOM (not necessarily visible)
    await page.waitForSelector('p-dashboard', { state: 'attached', timeout: 15000 })

    // Wait for dashboard content to be rendered (wait for the h1 element inside)
    await page.waitForSelector('p-dashboard h1', { timeout: 10000 })

    const dashboard = page.locator('p-dashboard')
    expect(await dashboard.count()).toBe(1)
    
    // Check that the dashboard content is rendered correctly
    const dashboardTitle = page.locator('p-dashboard h1')
    expect(await dashboardTitle.textContent()).toBe('Dashboard')
    
    // The component should not have the hidden attribute
    expect(await dashboard.getAttribute('hidden')).toBeNull()
  })

  test('should have correct page metadata', async ({ page }) => {
    await page.goto('/src/es/kunden-portal/index.html')

    // Check page title
    expect(await page.title()).toBe('Kunden Portal')

    // Check language attribute
    const htmlLang = await page.locator('html').getAttribute('lang')
    expect(htmlLang).toBe('de-CH')

    // Check viewport meta tag
    const viewport = page.locator('meta[name="viewport"]')
    expect(await viewport.count()).toBe(1)
  })

  test('should load required CSS files', async ({ page }) => {
    await page.goto('/src/es/kunden-portal/index.html')

    // Check that CSS files are linked
    const cssLinks = page.locator('link[rel="stylesheet"]')
    const cssCount = await cssLinks.count()

    // Should have multiple CSS files loaded
    expect(cssCount).toBeGreaterThan(4)

    // Check for specific important CSS files
    const initialCss = page.locator('link[href*="initial.css"]')
    const resetCss = page.locator('link[href*="reset.css"]')
    const colorsCss = page.locator('link[href*="colors.css"]')

    expect(await initialCss.count()).toBe(1)
    expect(await resetCss.count()).toBe(1)
    expect(await colorsCss.count()).toBe(1)
  })

  test('should be responsive on different screen sizes', async ({ page }) => {
    await page.goto('/src/es/kunden-portal/index.html')
    await page.waitForSelector('body[wc-config-load]', { timeout: 10000 })

    // Test different viewport sizes
    const viewports = [
      { width: 320, height: 568 }, // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1920, height: 1080 } // Desktop
    ]

    for (const viewport of viewports) {
      await page.setViewportSize(viewport)
      await page.waitForTimeout(500)

      // Check that main components are still visible
      const bodySection = page.locator('ks-o-body-section')
      expect(await bodySection.isVisible()).toBeTruthy()

      const router = page.locator('kp-router')
      expect(await router.isVisible()).toBeTruthy()
    }
  })

  test('should handle hash routing', async ({ page }) => {
    await page.goto('/src/es/kunden-portal/index.html')
    await page.waitForSelector('body[wc-config-load]', { timeout: 10000 })

    // Test navigation with hash by setting the hash on current page instead of navigating
    await page.evaluate(() => { window.location.hash = '/' })
    
    // Wait for router to process the hash route
    await page.waitForSelector('kp-router', { timeout: 10000 })
    
    // Wait for dashboard to be attached to the DOM
    await page.waitForSelector('p-dashboard', { state: 'attached', timeout: 15000 })
    
    // Wait for dashboard content to be rendered
    await page.waitForSelector('p-dashboard h1', { timeout: 10000 })

    const dashboard = page.locator('p-dashboard')
    expect(await dashboard.getAttribute('hidden')).toBeNull()
    
    // Check that the dashboard content is rendered correctly
    const dashboardTitle = page.locator('p-dashboard h1')
    expect(await dashboardTitle.textContent()).toBe('Dashboard')
  })
})
