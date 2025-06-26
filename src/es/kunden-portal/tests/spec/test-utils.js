// @ts-check

/**
 * Common test utilities for Kunden Portal testing
 */

/**
 * Wait for web components to be fully loaded
 * @param {import('@playwright/test').Page} page
 * @param {number} timeout
 */
async function waitForWebComponentsLoaded (page, timeout = 10000) {
  await page.waitForSelector('body[wc-config-load]', { timeout })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(1000)
}

/**
 * Navigate to a specific route in the Kunden Portal
 * @param {import('@playwright/test').Page} page
 * @param {string} route
 */
async function navigateToRoute (page, route = '/') {
  await page.evaluate((routeHash) => {
    window.location.hash = routeHash
  }, route)
  await page.waitForTimeout(1000)
}

/**
 * Check if a component is properly loaded and visible
 * @param {import('@playwright/test').Page} page
 * @param {string} selector
 * @param {number} timeout
 */
async function waitForComponent (page, selector, timeout = 5000) {
  await page.waitForSelector(selector, { timeout })
  const element = await page.locator(selector)
  return element.isVisible()
}

/**
 * Get computed styles for an element
 * @param {import('@playwright/test').Page} page
 * @param {string} selector
 * @param {string[]} properties
 */
async function getComputedStyles (page, selector, properties) {
  return await page.locator(selector).evaluate((el, props) => {
    const style = window.getComputedStyle(el)
    const result = {}
    props.forEach(prop => {
      result[prop] = style[prop]
    })
    return result
  }, properties)
}

/**
 * Test component responsiveness across different screen sizes
 * @param {import('@playwright/test').Page} page
 * @param {string} componentSelector
 * @param {Array} screenSizes
 */
async function testResponsiveness (page, componentSelector, screenSizes = [
  { width: 320, height: 568, name: 'mobile' },
  { width: 768, height: 1024, name: 'tablet' },
  { width: 1920, height: 1080, name: 'desktop' }
]) {
  const results = {}

  for (const size of screenSizes) {
    await page.setViewportSize({ width: size.width, height: size.height })
    await page.waitForTimeout(500)

    const element = await page.locator(componentSelector)
    const isVisible = await element.isVisible()
    const boundingBox = await element.boundingBox()

    results[size.name] = {
      isVisible,
      boundingBox,
      screenSize: size
    }
  }

  return results
}

/**
 * Take a screenshot with consistent settings
 * @param {import('@playwright/test').Page} page
 * @param {string} name
 * @param {Object} options
 */
async function takeStandardScreenshot (page, name, options = {}) {
  const defaultOptions = {
    fullPage: true,
    animations: 'disabled',
    ...options
  }

  // Ensure page is scrolled to top
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(500)

  return await page.screenshot(defaultOptions)
}

/**
 * Check accessibility attributes for an element
 * @param {import('@playwright/test').Page} page
 * @param {string} selector
 */
async function checkAccessibilityAttributes (page, selector) {
  const element = await page.locator(selector)

  const attributes = await element.evaluate(el => {
    return {
      ariaLabel: el.getAttribute('aria-label'),
      ariaRole: el.getAttribute('role'),
      tabIndex: el.getAttribute('tabindex'),
      ariaHidden: el.getAttribute('aria-hidden'),
      ariaExpanded: el.getAttribute('aria-expanded'),
      ariaDescribedBy: el.getAttribute('aria-describedby')
    }
  })

  return attributes
}

/**
 * Simulate user interactions with proper timing
 * @param {import('@playwright/test').Page} page
 * @param {string} selector
 * @param {string} action
 * @param {Object} options
 */
async function simulateUserInteraction (page, selector, action, options = {}) {
  const element = await page.locator(selector)
  await element.waitFor({ state: 'visible' })

  switch (action) {
    case 'click':
      await element.click(options)
      break
    case 'hover':
      await element.hover()
      await page.waitForTimeout(300)
      break
    case 'focus':
      await element.focus()
      await page.waitForTimeout(200)
      break
    case 'type':
      if (options.text) {
        await element.type(options.text, { delay: 50 })
      }
      break
    default:
      throw new Error(`Unknown action: ${action}`)
  }

  await page.waitForTimeout(300)
}

/**
 * Check if all required resources are loaded
 * @param {import('@playwright/test').Page} page
 */
async function checkResourcesLoaded (page) {
  const resources = await page.evaluate(() => {
    const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .map(link => ({ href: link.href, loaded: !!link.sheet }))

    const scripts = Array.from(document.querySelectorAll('script[src]'))
      .map(script => ({ src: script.src, loaded: true }))

    const images = Array.from(document.querySelectorAll('img'))
      .map(img => ({ src: img.src, loaded: img.complete && img.naturalHeight !== 0 }))

    return { stylesheets, scripts, images }
  })

  return resources
}

/**
 * Mock network requests for testing
 * @param {import('@playwright/test').Page} page
 * @param {Array} mockRules
 */
async function setupNetworkMocks (page, mockRules) {
  await page.route('**/*', (route) => {
    const url = route.request().url()

    for (const rule of mockRules) {
      if (url.match(rule.pattern)) {
        if (rule.response) {
          route.fulfill(rule.response)
        } else if (rule.abort) {
          route.abort()
        }
        return
      }
    }

    route.continue()
  })
}

module.exports = {
  waitForWebComponentsLoaded,
  navigateToRoute,
  waitForComponent,
  getComputedStyles,
  testResponsiveness,
  takeStandardScreenshot,
  checkAccessibilityAttributes,
  simulateUserInteraction,
  checkResourcesLoaded,
  setupNetworkMocks
}
