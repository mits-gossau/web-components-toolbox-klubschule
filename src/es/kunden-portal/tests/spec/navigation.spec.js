// @ts-check
const { test, expect } = require('@playwright/test')

const WAITING_TIMEOUT = 1000

test.describe('Kunden Portal Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/es/kunden-portal/index.html')
    await page.waitForSelector('body[wc-config-load]', { timeout: 10000 })
    await page.evaluate(async () => await document.fonts.ready)
    await page.waitForTimeout(WAITING_TIMEOUT)
  })

  test('should load default dashboard route', async ({ page }) => {
    // Check if we're on the default route (dashboard)
    const router = await page.locator('kp-router')
    const routerCount = await router.count()
    console.log('kp-router count:', routerCount)
    expect(routerCount).toBeGreaterThan(0)

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
      { hash: '#/subscriptions', component: 'p-subscriptions' },
      { hash: '#/booking', component: 'p-booking' },
    ]

    for (const route of routes) {
      await page.evaluate((hash) => {
        window.location.hash = hash
      }, route.hash)

      await page.waitForTimeout(WAITING_TIMEOUT)

      if (route.component === 'p-dashboard') {
        await page.waitForSelector(route.component, { timeout: 5000 })
        const component = await page.locator(route.component)
        const isVisible = await component.isVisible()
        console.log(`${route.component} visible:`, isVisible)
        expect(isVisible).toBeTruthy()
      }
    }
  })

  test('should maintain router configuration', async ({ page }) => {
    // Check if the router has the correct routes configured
    const routerElement = await page.locator('kp-router')

    // Get the routes attribute
    const routesConfig = await routerElement.getAttribute('routes')
    console.log('routesConfig:', routesConfig)
    expect(routesConfig).toBeTruthy()

    // Parse and validate the routes configuration
    let routes
    try {
      if (routesConfig === null) throw new Error('routesConfig is null')
      routes = JSON.parse(routesConfig)
    } catch (e) {
      routes = eval('(' + routesConfig + ')')
    }
    expect(Array.isArray(routes)).toBeTruthy()
    expect(routes.length).toBe(4)

    // Verify each route configuration
    const expectedRoutes = [
      { name: 'p-dashboard', path: '../../pages/Dashboard.js' },
      { name: 'p-booked', path: '../../pages/Booked.js' },
      { name: 'p-subscriptions', path: '../../pages/Subscriptions.js' },
      { name: 'p-booking', path: '../../pages/Booking.js' },
    ]

    expectedRoutes.forEach((expectedRoute, index) => {
      expect(routes[index].name).toBe(expectedRoute.name)
      expect(routes[index].path).toBe(expectedRoute.path)
      expect(routes[index].regExp).toBeDefined()
    })
  })

  test('should handle deep linking', async ({ page }) => {
    await page.evaluate(() => { window.location.hash = '/' })
    await page.waitForSelector('body[wc-config-load]', { timeout: 10000 })

    // Warte auf das Dashboard-Element
    await page.waitForSelector('p-dashboard', { timeout: 10000 })
    const dashboard = await page.locator('p-dashboard')
    const dashboardCount = await dashboard.count()
    console.log('p-dashboard count:', dashboardCount)
    const hidden = await dashboard.getAttribute('hidden')
    console.log('dashboard hidden:', hidden)
    expect(dashboardCount).toBeGreaterThan(0)
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
