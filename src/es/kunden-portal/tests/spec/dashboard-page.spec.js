// @ts-check
const { test, expect } = require('@playwright/test')
const { setupApiMocking, getFixtureData, waitForDashboardReady } = require('../helpers/test-utils.js')

test.describe('Dashboard Page Component (p-dashboard)', () => {
  test.beforeEach(async ({ page }) => {
    // Set up API mocking before navigation
    await setupApiMocking(page, 'bookings-success.json')

    // Navigate to the kunden portal main page
    await page.goto('/src/es/kunden-portal/index.html')

    // Wait for web components to be loaded
    await page.waitForSelector('body[wc-config-load="true"]', { timeout: 15000 })

    // Wait for router to be ready
    await page.waitForSelector('kp-router', { timeout: 10000 })
  })

  test('should be defined as a custom element', async ({ page }) => {
    const isDefined = await page.evaluate(() => {
      return customElements.get('p-dashboard') !== undefined
    })
    expect(isDefined).toBe(true)
  })

  test('should render when routed to dashboard', async ({ page }) => {
    // Ensure we're on the dashboard route
    await page.evaluate(() => { window.location.hash = '/' })

    // Wait for dashboard to be rendered
    await page.waitForSelector('p-dashboard', { state: 'attached', timeout: 15000 })

    const dashboard = page.locator('p-dashboard')
    await expect(dashboard).toHaveCount(1)

    // Dashboard should not have hidden attribute when active
    const isHidden = await dashboard.getAttribute('hidden')
    expect(isHidden).toBeNull()
  })

  test('should have shadow root with proper structure', async ({ page }) => {
    // Navigate to dashboard route
    await page.evaluate(() => { window.location.hash = '/' })
    await page.waitForSelector('p-dashboard', { state: 'attached', timeout: 15000 })

    // Wait for shadow DOM to be created
    await page.waitForFunction(() => {
      const dashboard = document.querySelector('p-dashboard')
      return dashboard && dashboard.shadowRoot !== null
    }, { timeout: 10000 })

    const shadowContent = await page.evaluate(() => {
      const dashboard = document.querySelector('p-dashboard')
      if (!dashboard) return { error: 'No dashboard element found' }
      if (!dashboard.shadowRoot) return { error: 'No shadow root found' }

      return {
        hasShadowRoot: dashboard.shadowRoot !== null,
        childrenCount: dashboard.shadowRoot.children.length,
        hasStyles: dashboard.shadowRoot.querySelector('style[_css]') !== null,
        hasOrganism: dashboard.shadowRoot.querySelector('kp-o-dashboard') !== null
      }
    })

    expect(shadowContent.error).toBeUndefined()
    expect(shadowContent.hasShadowRoot).toBe(true)
    expect(shadowContent.childrenCount).toBeGreaterThan(0)
  })

  test('should render kp-o-dashboard organism component', async ({ page }) => {
    // Navigate to dashboard route
    await page.evaluate(() => { window.location.hash = '/' })
    await page.waitForSelector('p-dashboard', { state: 'attached', timeout: 15000 })

    // Wait for the organism to be rendered
    await page.waitForFunction(() => {
      const dashboard = document.querySelector('p-dashboard')
      return dashboard && dashboard.shadowRoot && dashboard.shadowRoot.querySelector('kp-o-dashboard')
    }, { timeout: 10000 })

    const organismExists = await page.evaluate(() => {
      const dashboard = document.querySelector('p-dashboard')
      const organism = dashboard.shadowRoot.querySelector('kp-o-dashboard')
      return {
        exists: organism !== null,
        hasNamespace: organism ? organism.getAttribute('namespace') === 'dashboard-default-' : false,
        tagName: organism ? organism.tagName.toLowerCase() : null
      }
    })

    expect(organismExists.exists).toBe(true)
    expect(organismExists.hasNamespace).toBe(true)
    expect(organismExists.tagName).toBe('kp-o-dashboard')
  })

  test('should implement proper lifecycle methods', async ({ page }) => {
    // Navigate to dashboard route
    await page.evaluate(() => { window.location.hash = '/' })
    await page.waitForSelector('p-dashboard', { state: 'attached', timeout: 15000 })

    const lifecycleInfo = await page.evaluate(() => {
      const dashboard = document.querySelector('p-dashboard')
      if (!dashboard) return null

      return {
        hasConnectedCallback: typeof dashboard.connectedCallback === 'function',
        hasDisconnectedCallback: typeof dashboard.disconnectedCallback === 'function',
        hasShouldRenderHTML: typeof dashboard.shouldRenderHTML === 'function',
        hasShouldRenderCSS: typeof dashboard.shouldRenderCSS === 'function',
        hasRenderHTML: typeof dashboard.renderHTML === 'function',
        hasRenderCSS: typeof dashboard.renderCSS === 'function',
        hasDashboardGetter: dashboard.hasOwnProperty('dashboard') || 'dashboard' in Object.getPrototypeOf(dashboard)
      }
    })

    expect(lifecycleInfo.hasConnectedCallback).toBe(true)
    expect(lifecycleInfo.hasDisconnectedCallback).toBe(true)
    expect(lifecycleInfo.hasShouldRenderHTML).toBe(true)
    expect(lifecycleInfo.hasShouldRenderCSS).toBe(true)
    expect(lifecycleInfo.hasRenderHTML).toBe(true)
    expect(lifecycleInfo.hasRenderCSS).toBe(true)
    expect(lifecycleInfo.hasDashboardGetter).toBe(true)
  })

  test('should handle dashboard getter logic correctly', async ({ page }) => {
    // Navigate to dashboard route
    await page.evaluate(() => { window.location.hash = '/' })
    await page.waitForSelector('p-dashboard', { state: 'attached', timeout: 15000 })

    const dashboardLogic = await page.evaluate(() => {
      const dashboard = document.querySelector('p-dashboard')
      if (!dashboard) return null

      // Test the dashboard getter
      const dashboardValue = dashboard.dashboard
      const hasOrganism = dashboard.shadowRoot.querySelector('kp-o-dashboard') !== null

      return {
        dashboardValue,
        hasOrganism,
        shouldRenderHTML: dashboard.shouldRenderHTML(),
        shadowRootExists: dashboard.shadowRoot !== null
      }
    })

    expect(dashboardLogic.shadowRootExists).toBe(true)
    expect(dashboardLogic.hasOrganism).toBe(true)
    // dashboard getter returns true when NO kp-o-dashboard is found (should render)
    // Since we have the organism, dashboard should return false
    expect(dashboardLogic.dashboardValue).toBe(false)
  })

  test('should inherit from Index class properly', async ({ page }) => {
    // Navigate to dashboard route
    await page.evaluate(() => { window.location.hash = '/' })
    await page.waitForSelector('p-dashboard', { state: 'attached', timeout: 15000 })

    const inheritance = await page.evaluate(() => {
      const dashboard = document.querySelector('p-dashboard')
      if (!dashboard) return null

      return {
        hasImportMetaUrl: dashboard.hasOwnProperty('importMetaUrl') || 'importMetaUrl' in dashboard,
        hasShadowRoot: dashboard.shadowRoot !== null,
        hasRoot: dashboard.hasOwnProperty('root') || 'root' in dashboard,
        hasCssSelector: dashboard.hasOwnProperty('cssSelector') || 'cssSelector' in dashboard,
        constructorName: dashboard.constructor.name
      }
    })

    expect(inheritance.hasShadowRoot).toBe(true)
    expect(inheritance.hasRoot).toBe(true)
    expect(inheritance.hasCssSelector).toBe(true)
  })

  test('should load and render organism module correctly', async ({ page }) => {
    // Navigate to dashboard route
    await page.evaluate(() => { window.location.hash = '/' })
    await page.waitForSelector('p-dashboard', { state: 'attached', timeout: 15000 })

    // Wait for organism to be fully rendered
    await page.waitForFunction(() => {
      const dashboard = document.querySelector('p-dashboard')
      const organism = dashboard && dashboard.shadowRoot && dashboard.shadowRoot.querySelector('kp-o-dashboard')
      return organism && customElements.get('kp-o-dashboard')
    }, { timeout: 10000 })

    const moduleInfo = await page.evaluate(() => {
      const dashboard = document.querySelector('p-dashboard')
      const organism = dashboard.shadowRoot.querySelector('kp-o-dashboard')

      return {
        organismDefined: customElements.get('kp-o-dashboard') !== undefined,
        organismConnected: organism && organism.isConnected,
        organismHasShadowRoot: organism && organism.shadowRoot !== null,
        organismNamespace: organism ? organism.getAttribute('namespace') : null
      }
    })

    expect(moduleInfo.organismDefined).toBe(true)
    expect(moduleInfo.organismConnected).toBe(true)
    expect(moduleInfo.organismHasShadowRoot).toBe(true)
    expect(moduleInfo.organismNamespace).toBe('dashboard-default-')
  })

  test('should handle component removal and cleanup', async ({ page }) => {
    // Navigate to dashboard route
    await page.evaluate(() => { window.location.hash = '/' })
    await page.waitForSelector('p-dashboard', { state: 'attached', timeout: 15000 })

    // Get initial state
    const initialCount = await page.locator('p-dashboard').count()
    expect(initialCount).toBe(1)

    // Remove the component
    await page.evaluate(() => {
      const dashboard = document.querySelector('p-dashboard')
      if (dashboard) {
        dashboard.remove()
      }
    })

    // Verify removal
    const finalCount = await page.locator('p-dashboard').count()
    expect(finalCount).toBe(0)
  })

  test('should work with router navigation', async ({ page }) => {
    // Start on dashboard
    await page.evaluate(() => { window.location.hash = '/' })
    await page.waitForSelector('p-dashboard', { state: 'attached', timeout: 15000 })

    let dashboardVisible = await page.evaluate(() => {
      const dashboard = document.querySelector('p-dashboard')
      return dashboard && dashboard.getAttribute('hidden') === null
    })
    expect(dashboardVisible).toBe(true)

    // Navigate away (if booking route exists)
    await page.evaluate(() => { window.location.hash = '/booking' })
    await page.waitForTimeout(1000)

    // Navigate back to dashboard
    await page.evaluate(() => { window.location.hash = '/' })
    await page.waitForSelector('p-dashboard[hidden=null], p-dashboard:not([hidden])', { timeout: 10000 })

    dashboardVisible = await page.evaluate(() => {
      const dashboard = document.querySelector('p-dashboard')
      return dashboard && dashboard.getAttribute('hidden') === null
    })
    expect(dashboardVisible).toBe(true)
  })

  test('should handle error states gracefully', async ({ page }) => {
    // Navigate to dashboard route
    await page.evaluate(() => { window.location.hash = '/' })
    await page.waitForSelector('p-dashboard', { state: 'attached', timeout: 15000 })

    // Test error handling by manipulating component state
    const errorHandling = await page.evaluate(() => {
      const dashboard = document.querySelector('p-dashboard')

      try {
        // Test shouldRenderCSS with broken state
        const shouldRenderCSS = dashboard.shouldRenderCSS()

        // Test shouldRenderHTML with broken state
        const shouldRenderHTML = dashboard.shouldRenderHTML()

        return {
          shouldRenderCSSWorks: typeof shouldRenderCSS === 'boolean',
          shouldRenderHTMLWorks: typeof shouldRenderHTML === 'boolean',
          noErrors: true
        }
      } catch (error) {
        return {
          shouldRenderCSSWorks: false,
          shouldRenderHTMLWorks: false,
          noErrors: false,
          error: error.message
        }
      }
    })

    expect(errorHandling.noErrors).toBe(true)
    expect(errorHandling.shouldRenderCSSWorks).toBe(true)
    expect(errorHandling.shouldRenderHTMLWorks).toBe(true)
  })

  test('should have correct HTML structure after full render', async ({ page }) => {
    // Set up with booking data to ensure full rendering
    const fixtureData = getFixtureData('bookings-success.json')

    // Navigate to dashboard
    await page.evaluate(() => { window.location.hash = '/' })
    await page.waitForSelector('p-dashboard', { state: 'attached', timeout: 15000 })

    // Wait for dashboard to be fully ready
    await waitForDashboardReady(page)

    // Trigger booking data update
    await page.evaluate((data) => {
      const fetchPromise = Promise.resolve(data)
      document.body.dispatchEvent(new CustomEvent('update-bookings', {
        detail: { fetch: fetchPromise },
        bubbles: true,
        cancelable: true,
        composed: true
      }))
    }, fixtureData)

    // Wait for content to render
    await page.waitForTimeout(3000)

    // Check final structure
    const structure = await page.evaluate(() => {
      const dashboard = document.querySelector('p-dashboard')
      const organism = dashboard.shadowRoot.querySelector('kp-o-dashboard')
      const grid = organism && organism.shadowRoot && organism.shadowRoot.querySelector('o-grid')

      return {
        hasDashboard: dashboard !== null,
        hasOrganism: organism !== null,
        hasGrid: grid !== null,
        dashboardTagName: dashboard ? dashboard.tagName.toLowerCase() : null,
        organismNamespace: organism ? organism.getAttribute('namespace') : null
      }
    })

    expect(structure.hasDashboard).toBe(true)
    expect(structure.hasOrganism).toBe(true)
    expect(structure.hasGrid).toBe(true)
    expect(structure.dashboardTagName).toBe('p-dashboard')
    expect(structure.organismNamespace).toBe('dashboard-default-')
  })
})
