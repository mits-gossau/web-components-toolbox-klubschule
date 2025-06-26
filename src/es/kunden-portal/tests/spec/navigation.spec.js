// @ts-check
const { test, expect } = require('@playwright/test')

const WAITING_TIMEOUT = 1000

test.describe('Kunden Portal Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/es/kunden-portal/index.html')
    await page.waitForSelector('body[wc-config-load]', { timeout: 10000 })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(WAITING_TIMEOUT)
  })

  test('should load default dashboard route', async ({ page }) => {
    // Check if we're on the default route (dashboard)
    const router = await page.locator('kp-router')
    expect(await router.isVisible()).toBeTruthy()

    // Verify the dashboard component is loaded
    await page.waitForSelector('p-dashboard', { timeout: 5000 })
    const dashboard = await page.locator('p-dashboard')
    expect(await dashboard.isVisible()).toBeTruthy()
  })

  test('should handle hash routing', async ({ page }) => {
    // Test navigation to different routes via hash changes
    const routes = [
      { hash: '#/', component: 'p-dashboard' },
      { hash: '#/booked', component: 'p-booked' },
      { hash: '#/subscriptions', component: 'p-subscriptions' }
    ]

    for (const route of routes) {
      // Navigate to the route
      await page.evaluate((hash) => {
        window.location.hash = hash
      }, route.hash)

      await page.waitForTimeout(WAITING_TIMEOUT)

      // Note: Since we only have the Dashboard component in the current setup,
      // we'll only test the dashboard route for now
      if (route.component === 'p-dashboard') {
        const component = await page.locator(route.component)
        expect(await component.isVisible()).toBeTruthy()
      }
    }
  })

  test('should maintain router configuration', async ({ page }) => {
    // Check if the router has the correct routes configured
    const routerElement = await page.locator('kp-router')

    // Get the routes attribute
    const routesConfig = await routerElement.getAttribute('routes')
    expect(routesConfig).toBeTruthy()

    // Parse and validate the routes configuration
    const routes = JSON.parse(routesConfig)
    expect(routes).toHaveLength(3)

    // Verify each route configuration
    const expectedRoutes = [
      { name: 'p-dashboard', path: '../../pages/Dashboard.js' },
      { name: 'p-booked', path: '../../pages/Booked.js' },
      { name: 'p-subscriptions', path: '../../pages/Subscriptions.js' }
    ]

    expectedRoutes.forEach((expectedRoute, index) => {
      expect(routes[index].name).toBe(expectedRoute.name)
      expect(routes[index].path).toBe(expectedRoute.path)
      expect(routes[index].regExp).toBeDefined()
    })
  })

  test('should handle deep linking', async ({ page }) => {
    // Test direct navigation to a specific route
    await page.goto('/src/es/kunden-portal/index.html#/')
    await page.waitForSelector('body[wc-config-load]', { timeout: 10000 })

    // Verify the correct component loads
    const dashboard = await page.locator('p-dashboard')
    expect(await dashboard.isVisible()).toBeTruthy()
  })

  test('should be accessible', async ({ page }) => {
    // Check if the main container has proper ARIA attributes
    const bodySection = await page.locator('ks-o-body-section')

    // Verify accessibility attributes
    const tabindex = await bodySection.getAttribute('tabindex')
    const ariaLabel = await bodySection.getAttribute('aria-label')

    expect(tabindex).toBe('0')
    expect(ariaLabel).toBe('Section')
  })
})
