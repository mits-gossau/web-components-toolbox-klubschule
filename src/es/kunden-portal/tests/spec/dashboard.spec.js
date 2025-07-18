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

    // Check if the main title is present
    const title = await page.locator('h1').textContent()
    expect(title).toBe('Dashboard')

    // Check if the test API button exists
    const button = await page.locator('ks-a-button')
    expect(await button.isVisible()).toBeTruthy()
    expect(await button.textContent()).toContain('Test API')
  })

  test('should have correct layout structure', async ({ page }) => {
    // Check if the grid container exists
    const gridContainer = await page.locator('o-grid')
    expect(await gridContainer.isVisible()).toBeTruthy()

    // Check if grid columns are properly structured
    const columns = await page.locator('o-grid div[col-lg="12"]')
    expect(await columns.count()).toBeGreaterThan(0)
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.waitForTimeout(WAITING_TIMEOUT)

    // Check if elements are still visible and properly arranged
    const title = await page.locator('h1')
    expect(await title.isVisible()).toBeTruthy()

    const button = await page.locator('ks-a-button')
    expect(await button.isVisible()).toBeTruthy()
  })

  test('should handle button interactions', async ({ page }) => {
    // Wait for the button to be ready
    const button = await page.locator('ks-a-button')
    await button.waitFor({ state: 'visible' })

    // Test button hover state (if applicable)
    await button.hover()
    await page.waitForTimeout(500)

    // Test button click
    await button.click()

    // Verify button click worked (you might want to add specific assertions here
    // based on what the button should do)
    expect(await button.isVisible()).toBeTruthy()
  })

  test('should load all required modules', async ({ page }) => {
    // Check if all expected web components are loaded
    await page.waitForSelector('ks-a-button', { timeout: 10000 })
    await page.waitForSelector('o-grid', { timeout: 10000 })

    // Verify that the components are properly initialized
    const buttonComponent = await page.locator('ks-a-button')
    const gridComponent = await page.locator('o-grid')

    expect(await buttonComponent.isVisible()).toBeTruthy()
    expect(await gridComponent.isVisible()).toBeTruthy()
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
