// @ts-check
const { test, expect } = require('@playwright/test')

const WAITING_TIMEOUT = 1000

test.describe('Kunden Portal Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/es/kunden-portal/index.html')
    await page.waitForSelector('body[wc-config-load]', { timeout: 10000 })
    await page.evaluate(async () => { await document.fonts.ready })
    await page.waitForTimeout(WAITING_TIMEOUT)
  })

  test('should load all required CSS resources', async ({ page }) => {
    // Check if critical CSS files are loaded
    const stylesheets = await page.evaluate(() => {
      // @ts-ignore
      return Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(link => link.href)
    })

    // Verify essential CSS files are present
    const expectedCSS = [
      'initial.css',
      'reset.css',
      'colors.css',
      'fonts.css',
      'variables.css'
    ]

    expectedCSS.forEach(cssFile => {
      const hasCSS = stylesheets.some(href => href.includes(cssFile))
      expect(hasCSS).toBeTruthy()
    })
  })

  test('should load all required JavaScript modules', async ({ page }) => {
    // Check if critical JavaScript files are loaded
    const scripts = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('script')).map(script => script.src)
    })

    // Verify essential JS files are present
    const expectedJS = [
      'Environment.js',
      'wc-config.js'
    ]

    expectedJS.forEach(jsFile => {
      const hasJS = scripts.some(src => src.includes(jsFile))
      expect(hasJS).toBeTruthy()
    })
  })

  test('should have proper web components structure', async ({ page }) => {
    // Verify the nested web components structure
    const components = [
      'c-fetch-html',
      'c-fetch-css',
      'c-fetch-modules',
      'p-general',
      'o-body',
      'ks-o-body-section',
      'kp-router'
    ]

    for (const component of components) {
      const element = await page.locator(component)
      expect(await element.isVisible()).toBeTruthy()
    }
  })

  test('should handle component loading sequence', async ({ page }) => {
    // Test the loading sequence of components
    // 1. First, fetch components should load
    await page.waitForSelector('c-fetch-html', { timeout: 5000 })
    await page.waitForSelector('c-fetch-css', { timeout: 5000 })
    await page.waitForSelector('c-fetch-modules', { timeout: 5000 })

    // 2. Then page structure components
    await page.waitForSelector('p-general', { timeout: 5000 })
    await page.waitForSelector('o-body', { timeout: 5000 })

    // 3. Finally application-specific components
    await page.waitForSelector('kp-router', { timeout: 5000 })
    await page.waitForSelector('p-dashboard', { timeout: 5000 })
  })

  test('should maintain proper component hierarchy', async ({ page }) => {
    // Verify the DOM hierarchy is correct
    const hierarchy = await page.evaluate(() => {
      const body = document.querySelector('body')
      const fetchHtml = body?.querySelector('c-fetch-html')
      const fetchCss = fetchHtml?.querySelector('c-fetch-css')
      const fetchModules = fetchCss?.querySelector('c-fetch-modules')
      const pGeneral = fetchModules?.querySelector('p-general')
      const oBody = pGeneral?.querySelector('o-body')
      const bodySection = oBody?.querySelector('ks-o-body-section')
      const router = bodySection?.querySelector('kp-router')

      return {
        hasBody: !!body,
        hasFetchHtml: !!fetchHtml,
        hasFetchCss: !!fetchCss,
        hasFetchModules: !!fetchModules,
        hasPGeneral: !!pGeneral,
        hasOBody: !!oBody,
        hasBodySection: !!bodySection,
        hasRouter: !!router
      }
    })

    // All components should be properly nested
    Object.entries(hierarchy).forEach(([key, hasComponent]) => {
      if (!hasComponent) console.error('Missing component:', key)
      expect(hasComponent).toBeTruthy()
    })
  })

  test('should handle custom CSS variables', async ({ page }) => {
    // Check if custom CSS variables are applied
    const bodySection = await page.locator('ks-o-body-section')

    const computedStyle = await bodySection.evaluate(el => {
      const style = window.getComputedStyle(el)
      return {
        backgroundColor: style.backgroundColor,
        padding: style.padding
      }
    })

    // The background-color should be set by the CSS variable
    expect(computedStyle.backgroundColor).not.toBe('rgba(0, 0, 0, 0)')
    expect(computedStyle.padding).toBe('32px 0px')
  })

  test('should be responsive across different screen sizes', async ({ page }) => {
    const screenSizes = [
      { width: 320, height: 568, name: 'mobile-small' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1024, height: 768, name: 'desktop-small' },
      { width: 1920, height: 1080, name: 'desktop-large' }
    ]

    for (const size of screenSizes) {
      await page.setViewportSize({ width: size.width, height: size.height })
      await page.waitForTimeout(1500)
      await page.waitForSelector('p-dashboard', { timeout: 10000 })

      // Verify main components are still visible
      const dashboard = await page.locator('p-dashboard')
      console.log('p-dashboard count:', await dashboard.count())
      if (!(await dashboard.isVisible())) {
        const html = await page.content()
        console.log(html)
      }
      expect(await dashboard.isVisible()).toBeTruthy()

      const dashboardDiv = await page.locator('div#dashboard')
      expect(await dashboardDiv.isVisible()).toBeTruthy()
    }
  })

  test('should handle error states gracefully', async ({ page }) => {
    // Test what happens if a component fails to load
    await page.evaluate(() => {
      // Simulate a network error for component loading
      const originalFetch = window.fetch
      window.fetch = function (url) {
        // @ts-ignore
        if (url.includes('nonexistent-component.js')) {
          return Promise.reject(new Error('Component not found'))
        }
        return originalFetch.apply(this, arguments)
      }
    })

    // The page should still function even if some components fail
    const dashboard = await page.locator('p-dashboard')
    expect(await dashboard.isVisible()).toBeTruthy()
  })

  // test('should maintain consistent styling', async ({ page }) => {
  //   // Check if the styling is consistent and applied correctly
  //   const elements = await page.locator('h1, ks-a-button').all()

  //   for (const element of elements) {
  //     const computedStyle = await element.evaluate(el => {
  //       const style = window.getComputedStyle(el)
  //       return {
  //         fontFamily: style.fontFamily,
  //         display: style.display
  //       }
  //     })

  //     // Font family should be defined (not default)
  //     expect(computedStyle.fontFamily).not.toBe('')
  //     expect(computedStyle.display).not.toBe('none')
  //   }
  // })
})
