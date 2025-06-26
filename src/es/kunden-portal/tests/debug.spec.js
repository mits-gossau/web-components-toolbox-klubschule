// @ts-check
const { test, expect } = require('@playwright/test')

test.describe('Debug Kunden Portal', () => {
  test('should load the page and show what we get', async ({ page }) => {
    console.log('Navigating to the page...')
    await page.goto('/src/es/kunden-portal/index.html')
    
    // Wait a bit for the page to load
    await page.waitForTimeout(5000)
    
    // Log the page title
    const title = await page.title()
    console.log('Page title:', title)
    
    // Log the URL
    console.log('Current URL:', page.url())
    
    // Take a screenshot to see what we get
    await page.screenshot({ path: 'debug-screenshot.png', fullPage: true })
    
    // Check what HTML we have
    const bodyHTML = await page.locator('body').innerHTML()
    console.log('Body HTML length:', bodyHTML.length)
    console.log('Body HTML preview:', bodyHTML.substring(0, 500))
    
    // Check if the main components exist
    const components = [
      'c-fetch-html',
      'c-fetch-css', 
      'c-fetch-modules',
      'p-general',
      'o-body',
      'ks-o-body-section',
      'kp-router',
      'p-dashboard'
    ]
    
    for (const component of components) {
      const element = await page.locator(component)
      const isVisible = await element.isVisible().catch(() => false)
      const count = await element.count()
      console.log(`${component}: visible=${isVisible}, count=${count}`)
    }
    
    // Check for any JavaScript errors
    const errors = []
    page.on('pageerror', error => {
      errors.push(error.message)
    })
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Console error:', msg.text())
      }
    })
    
    // Wait for any potential web component loading
    await page.waitForTimeout(3000)
    
    // Check if there's a dashboard now
    const dashboard = await page.locator('p-dashboard')
    const dashboardExists = await dashboard.count()
    console.log('Dashboard component count:', dashboardExists)
    
    if (dashboardExists > 0) {
      const dashboardHTML = await dashboard.innerHTML()
      console.log('Dashboard HTML:', dashboardHTML.substring(0, 300))
    }
    
    // Basic assertion to pass the test
    expect(page.url()).toContain('index.html')
  })
})
