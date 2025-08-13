// @ts-check
const { test, expect } = require('@playwright/test')

const WAITING_TIMEOUT = 1000

test.describe('Dashboard Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the kunden portal main page
    await page.goto('/src/es/kunden-portal/index.html')

    // Wait for web components to load
    await page.waitForSelector('body[wc-config-load]', { timeout: 10000 })

    // Wait for dashboard component to be present
    await page.waitForSelector('p-dashboard', { timeout: 10000 })

    // Wait for fonts to be ready
    await page.evaluate(() => document.fonts.ready)

    // Wait for components to fully render
    await page.waitForTimeout(3000)
  })

  test('should render dashboard with correct elements', async ({ page }) => {
    // Wait for the dashboard component to be rendered
    await page.waitForSelector('p-dashboard', { timeout: 10000 })

    // Check if div with id 'dashboard' exists
    const dashboardDiv = await page.locator('div#dashboard')
    expect(await dashboardDiv.isVisible()).toBeTruthy()

    // Check if div with id 'appointments' exists
    const appointmentsDiv = await page.locator('div#appointments')
    expect(await appointmentsDiv.isVisible()).toBeTruthy()

    // Check if div with id 'courses' exists
    const coursesDiv = await page.locator('div#courses')
    expect(await coursesDiv.isVisible()).toBeTruthy()

    // Check if two divs with class 'discover' exist
    const discoverDivs = await page.locator('div.discover')
    expect(await discoverDivs.count()).toBe(2)
    expect(await discoverDivs.first().isVisible()).toBeTruthy()
    expect(await discoverDivs.nth(1).isVisible()).toBeTruthy()

    // check if div with id 'continuation' exists
    const continuationDiv = await page.locator('div#continuation')
    expect(await continuationDiv.isVisible()).toBeTruthy()

    // check if div with id 'abonnements' exists
    const abonnementsDiv = await page.locator('div#abonnements')
    expect(await abonnementsDiv.isVisible()).toBeTruthy()
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.waitForTimeout(WAITING_TIMEOUT)

    // Check if elements are still visible and properly arranged
    await page.waitForSelector('p-dashboard >>> div#dashboard', { timeout: 3000 })
    const dashboardDiv = await page.locator('p-dashboard >>> div#dashboard')
    expect(await dashboardDiv.isVisible()).toBeTruthy()
    
    // const appointmentsDiv = await page.locator('div#appointments')
    // expect(await appointmentsDiv.isVisible()).toBeTruthy()

    // const coursesDiv = await page.locator('div#courses')
    // expect(await coursesDiv.isVisible()).toBeTruthy()

    // const discoverDivs = await page.locator('div.discover')
    // expect(await discoverDivs.count()).toBe(2)
    // expect(await discoverDivs.first().isVisible()).toBeTruthy()
    // expect(await discoverDivs.nth(1).isVisible()).toBeTruthy()

    // const continuationDiv = await page.locator('div#continuation')
    // expect(await continuationDiv.isVisible()).toBeTruthy()

    // const abonnementsDiv = await page.locator('div#abonnements')
    // expect(await abonnementsDiv.isVisible()).toBeTruthy()
  })

  test('should handle appointments', async ({ page }) => {
    // Check if one appointment is rendered correctly
    await page.waitForSelector('p-dashboard >>> div#appointments > ks-m-tile[namespace^="tile-appointment-"]', { timeout: 5000 })
    const appointmentTiles = await page.locator('p-dashboard >>> div#appointments > ks-m-tile[namespace^="tile-appointment-"]')
    expect(await appointmentTiles.count()).toBeGreaterThan(0)
    expect(await appointmentTiles.first().isVisible()).toBeTruthy()
  })

  test('should load all required modules', async ({ page }) => {
    // Check if all expected web components are loaded
    await page.waitForSelector('a-icon-mdx', { timeout: 10000 })
    const iconMdx = await page.locator('p-dashboard >>> div#dashboard a-icon-mdx')
    const iconCount = await page.locator('a-icon-mdx').count()
    console.log('a-icon-mdx count:', iconCount)
    expect(await iconMdx.count()).toBeGreaterThan(0)
    expect(await iconMdx.first().isVisible()).toBeTruthy()

    // await page.waitForSelector('a-icon-mdx', { timeout: 10000 })
    // await page.waitForSelector('ks-a-spacing', { timeout: 10000 })
    // await page.waitForSelector('ks-m-event', { timeout: 10000 })
    // await page.waitForSelector('ks-m-tile', { timeout: 10000 })
    // await page.waitForSelector('ks-m-tile-discover', { timeout: 10000 })

    // // Verify that the components are properly initialized
    // const iconMdx = await page.locator('a-icon-mdx')
    // expect(await iconMdx.count()).toBeGreaterThan(0)
    // expect(await iconMdx.first().isVisible()).toBeTruthy()
    // const spacing = await page.locator('ks-a-spacing')
    // expect(await spacing.count()).toBeGreaterThan(0)
    // expect(await spacing.first().isVisible()).toBeTruthy()
    // const eventTile = await page.locator('ks-m-event')
    // expect(await eventTile.count()).toBeGreaterThan(0)
    // expect(await eventTile.first().isVisible()).toBeTruthy()
    // const tile = await page.locator('ks-m-tile')
    // expect(await tile.count()).toBeGreaterThan(0)
    // expect(await tile.first().isVisible()).toBeTruthy()
    // const tileDiscover = await page.locator('ks-m-tile-discover')
    // expect(await tileDiscover.count()).toBeGreaterThan(0)
    // expect(await tileDiscover.first().isVisible()).toBeTruthy()
  })

  test('should match visual snapshot', async ({ page, browserName }) => {
    // Scroll to ensure all content is loaded
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(WAITING_TIMEOUT)
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(WAITING_TIMEOUT)

    // Take full page screenshot and compare with baseline
    expect(await page.screenshot({
      fullPage: true,
      animations: 'disabled'
    })).toMatchSnapshot(`dashboard-${browserName}.png`)
  })

  test('should handle navigation properly', async ({ page }) => {
    // Check if the router component is present
    const router = await page.locator('kp-router')
    expect(await router.isVisible()).toBeTruthy()

    // Verify that we're on the dashboard route
    const currentUrl = page.url()
    expect(currentUrl).toContain('index.html')
  })
})
