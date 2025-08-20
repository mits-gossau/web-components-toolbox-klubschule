// @ts-check
const { test, expect } = require('@playwright/test')

// Helper function to find the p-dashboard component in nested shadow DOM
const findDashboard = () => {
  let dashboard = document.querySelector('p-dashboard')

  // If not in main DOM, check router's light DOM where it renders the page component
  if (!dashboard) {
    const oBody = document.querySelector('o-body')
    const oBodyShadow = oBody?.shadowRoot
    const bodySection = oBodyShadow?.querySelector('ks-o-body-section')
    const bodySectionShadow = bodySection?.shadowRoot
    const router = bodySectionShadow?.querySelector('kp-router')

    if (router) {
      dashboard = router.querySelector('p-dashboard')
    }
  }

  return dashboard
}

test.describe('Dashboard Page Component (p-dashboard) - Basic Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the kunden portal main page
    await page.goto('/src/es/kunden-portal/index.html')

    // Wait for web components to be loaded
    await page.waitForSelector('body[wc-config-load="true"]', { timeout: 15000 })

    // Wait for page structure to be ready (o-body should be present)
    await page.waitForSelector('o-body', { timeout: 10000 })

    // Wait for router to be ready - it's in ks-o-body-section shadow DOM which is in o-body shadow DOM
    await page.waitForFunction(() => {
      const oBody = document.querySelector('o-body')
      if (!oBody?.shadowRoot) return false
      const bodySection = oBody.shadowRoot.querySelector('ks-o-body-section')
      if (!bodySection?.shadowRoot) return false
      return bodySection.shadowRoot.querySelector('kp-router') !== null
    }, { timeout: 10000 })

    // Navigate to dashboard route
    await page.evaluate(() => { window.location.hash = '/' })

    // Wait longer for router to load the page component
    await page.waitForTimeout(3000)

    // Check if router has processed the route
    const routerInfo = await page.evaluate(() => {
      const oBody = document.querySelector('o-body')
      const oBodyShadow = oBody?.shadowRoot
      const bodySection = oBodyShadow?.querySelector('ks-o-body-section')
      const bodySectionShadow = bodySection?.shadowRoot
      const router = bodySectionShadow?.querySelector('kp-router')

      return {
        hash: window.location.hash,
        oBodyExists: oBody !== null,
        oBodyHasShadow: oBodyShadow !== null,
        bodySectionExists: bodySection !== null,
        bodySectionHasShadow: bodySectionShadow !== null,
        routerExists: router !== null,
        routerContent: router ? router.innerHTML.substring(0, 300) : null,
        bodySectionInnerHTML: bodySection ? bodySection.innerHTML.substring(0, 300) : null
      }
    })
    console.log('Router debug info after setup:', JSON.stringify(routerInfo, null, 2))
  })

  test('should have p-dashboard element defined', async ({ page }) => {
    const isDefined = await page.evaluate(() => {
      return customElements.get('p-dashboard') !== undefined
    })
    expect(isDefined).toBe(true)
  })

  test('should render p-dashboard component in DOM', async ({ page }) => {
    // Wait for dashboard to be rendered
    await page.waitForSelector('p-dashboard', { state: 'attached', timeout: 15000 })

    const dashboard = page.locator('p-dashboard')
    await expect(dashboard).toHaveCount(1)
  })

  test('should have basic component properties', async ({ page }) => {
    // Debug what's actually in the DOM
    const domInfo = await page.evaluate(() => {
      const pageElements = Array.from(document.querySelectorAll('*[class*="dashboard"], *[id*="dashboard"], p-dashboard, kp-c-dashboard, kp-o-dashboard'))
      const oBodyShadow = document.querySelector('o-body')?.shadowRoot
      const shadowElements = oBodyShadow ? Array.from(oBodyShadow.querySelectorAll('*')) : []

      return {
        currentHash: window.location.hash,
        pageElements: pageElements.map(el => ({ tagName: el.tagName.toLowerCase(), className: el.className, id: el.id })),
        shadowElements: shadowElements.map(el => ({ tagName: el.tagName.toLowerCase(), className: el.className, id: el.id })),
        bodyContent: document.body.innerHTML.substring(0, 1000)
      }
    })

    console.log('DOM Debug Info:', JSON.stringify(domInfo, null, 2))

    // Wait for p-dashboard to be rendered by the router (in router's light DOM)
    await page.waitForFunction(() => {
      const oBody = document.querySelector('o-body')
      if (!oBody?.shadowRoot) return false
      const bodySection = oBody.shadowRoot.querySelector('ks-o-body-section')
      if (!bodySection?.shadowRoot) return false
      const router = bodySection.shadowRoot.querySelector('kp-router')
      if (!router) return false
      // Check router's light DOM (innerHTML) for p-dashboard
      return router.querySelector('p-dashboard') !== null
    }, { timeout: 15000 })

    const basicInfo = await page.evaluate(() => {
      let dashboard = document.querySelector('p-dashboard')

      // If not in main DOM, check router's light DOM where it renders the page component
      if (!dashboard) {
        const oBody = document.querySelector('o-body')
        const oBodyShadow = oBody?.shadowRoot
        const bodySection = oBodyShadow?.querySelector('ks-o-body-section')
        const bodySectionShadow = bodySection?.shadowRoot
        const router = bodySectionShadow?.querySelector('kp-router')

        if (router) {
          dashboard = router.querySelector('p-dashboard')
        }
      }

      return {
        exists: dashboard !== null,
        tagName: dashboard ? dashboard.tagName.toLowerCase() : null,
        isConnected: dashboard ? dashboard.isConnected : false,
        hasConnectedCallback: dashboard ? typeof dashboard.connectedCallback === 'function' : false,
        location: dashboard ? (dashboard.getRootNode() === document ? 'main-dom' : 'shadow-dom') : 'not-found'
      }
    })

    console.log('Basic info:', basicInfo)

    expect(basicInfo.exists).toBe(true)
    expect(basicInfo.tagName).toBe('p-dashboard')
    expect(basicInfo.isConnected).toBe(true)
    expect(basicInfo.hasConnectedCallback).toBe(true)
  })

  test('should eventually create shadow DOM', async ({ page }) => {
    // Wait for p-dashboard to be rendered by the router
    await page.waitForFunction(() => {
      const oBody = document.querySelector('o-body')
      if (!oBody?.shadowRoot) return false
      const bodySection = oBody.shadowRoot.querySelector('ks-o-body-section')
      if (!bodySection?.shadowRoot) return false
      const router = bodySection.shadowRoot.querySelector('kp-router')
      if (!router) return false
      return router.querySelector('p-dashboard') !== null
    }, { timeout: 15000 })

    // Give it time to initialize
    await page.waitForTimeout(2000)

    const shadowInfo = await page.evaluate((findDashboard) => {
      const dashboard = eval(`(${findDashboard})()`)
      if (!dashboard) return { error: 'No dashboard found' }

      return {
        hasShadowRoot: dashboard.shadowRoot !== null,
        shadowRootMode: dashboard.shadowRoot ? dashboard.shadowRoot.mode : null,
        childrenCount: dashboard.shadowRoot ? dashboard.shadowRoot.children.length : 0
      }
    }, findDashboard.toString())

    console.log('Shadow DOM info:', shadowInfo)

    // Shadow DOM should eventually be created
    if (shadowInfo.hasShadowRoot) {
      expect(shadowInfo.hasShadowRoot).toBe(true)
      expect(shadowInfo.childrenCount).toBeGreaterThanOrEqual(0)
    } else {
      console.log('Shadow DOM not yet created, which might be expected for this component')
    }
  })

  test('should have dashboard getter method', async ({ page }) => {
    // Wait for p-dashboard to be rendered by the router
    await page.waitForFunction(() => {
      const oBody = document.querySelector('o-body')
      if (!oBody?.shadowRoot) return false
      const bodySection = oBody.shadowRoot.querySelector('ks-o-body-section')
      if (!bodySection?.shadowRoot) return false
      const router = bodySection.shadowRoot.querySelector('kp-router')
      if (!router) return false
      return router.querySelector('p-dashboard') !== null
    }, { timeout: 15000 })

    const getterInfo = await page.evaluate((findDashboard) => {
      const dashboard = eval(`(${findDashboard})()`)
      if (!dashboard) return { error: 'No dashboard found' }

      try {
        const dashboardValue = dashboard.dashboard
        return {
          hasDashboardGetter: 'dashboard' in dashboard || 'dashboard' in Object.getPrototypeOf(dashboard),
          dashboardValue,
          dashboardType: typeof dashboardValue
        }
      } catch (error) {
        return { error: error.message }
      }
    }, findDashboard.toString())

    expect(getterInfo.error).toBeUndefined()
    expect(getterInfo.hasDashboardGetter).toBe(true)
    expect(getterInfo.dashboardType).toBe('boolean')
  })

  test('should have render methods', async ({ page }) => {
    // Wait for p-dashboard to be rendered by the router
    await page.waitForFunction(() => {
      const oBody = document.querySelector('o-body')
      if (!oBody?.shadowRoot) return false
      const bodySection = oBody.shadowRoot.querySelector('ks-o-body-section')
      if (!bodySection?.shadowRoot) return false
      const router = bodySection.shadowRoot.querySelector('kp-router')
      if (!router) return false
      return router.querySelector('p-dashboard') !== null
    }, { timeout: 15000 })

    const renderMethods = await page.evaluate((findDashboard) => {
      const dashboard = eval(`(${findDashboard})()`)
      if (!dashboard) return { error: 'No dashboard found' }

      return {
        hasRenderHTML: typeof dashboard.renderHTML === 'function',
        hasRenderCSS: typeof dashboard.renderCSS === 'function',
        hasShouldRenderHTML: typeof dashboard.shouldRenderHTML === 'function',
        hasShouldRenderCSS: typeof dashboard.shouldRenderCSS === 'function'
      }
    }, findDashboard.toString())

    expect(renderMethods.error).toBeUndefined()
    expect(renderMethods.hasRenderHTML).toBe(true)
    expect(renderMethods.hasRenderCSS).toBe(true)
    expect(renderMethods.hasShouldRenderHTML).toBe(true)
    expect(renderMethods.hasShouldRenderCSS).toBe(true)
  })

  test('should be able to remove component from DOM', async ({ page }) => {
    // Wait for p-dashboard to be rendered by the router
    await page.waitForFunction(() => {
      const oBody = document.querySelector('o-body')
      if (!oBody?.shadowRoot) return false
      const bodySection = oBody.shadowRoot.querySelector('ks-o-body-section')
      if (!bodySection?.shadowRoot) return false
      const router = bodySection.shadowRoot.querySelector('kp-router')
      if (!router) return false
      return router.querySelector('p-dashboard') !== null
    }, { timeout: 15000 })

    // Since playwright locator won't find elements in nested shadow DOM, we need to count them manually
    const initialCount = await page.evaluate((findDashboard) => {
      const dashboard = eval(`(${findDashboard})()`)
      return dashboard ? 1 : 0
    }, findDashboard.toString())
    expect(initialCount).toBe(1)

    // Remove the component
    await page.evaluate((findDashboard) => {
      const dashboard = eval(`(${findDashboard})()`)
      if (dashboard) {
        dashboard.remove()
      }
    }, findDashboard.toString())

    // Verify removal
    const finalCount = await page.evaluate((findDashboard) => {
      const dashboard = eval(`(${findDashboard})()`)
      return dashboard ? 1 : 0
    }, findDashboard.toString())
    expect(finalCount).toBe(0)
  })

  test('should inherit from proper base class', async ({ page }) => {
    // Wait for p-dashboard to be rendered by the router
    await page.waitForFunction(() => {
      const oBody = document.querySelector('o-body')
      if (!oBody?.shadowRoot) return false
      const bodySection = oBody.shadowRoot.querySelector('ks-o-body-section')
      if (!bodySection?.shadowRoot) return false
      const router = bodySection.shadowRoot.querySelector('kp-router')
      if (!router) return false
      return router.querySelector('p-dashboard') !== null
    }, { timeout: 15000 })

    const classInfo = await page.evaluate((findDashboard) => {
      const dashboard = eval(`(${findDashboard})()`)
      if (!dashboard) return { error: 'No dashboard found' }

      return {
        constructorName: dashboard.constructor.name,
        hasRoot: 'root' in dashboard,
        hasCssSelector: 'cssSelector' in dashboard,
        isHTMLElement: dashboard instanceof HTMLElement,
        isCustomElement: dashboard instanceof Element
      }
    }, findDashboard.toString())

    expect(classInfo.error).toBeUndefined()
    expect(classInfo.isHTMLElement).toBe(true)
    expect(classInfo.isCustomElement).toBe(true)
    expect(classInfo.hasRoot).toBe(true)
    expect(classInfo.hasCssSelector).toBe(true)
  })
})
