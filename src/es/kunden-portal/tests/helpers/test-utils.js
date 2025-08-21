// @ts-check
const fs = require('fs')
const path = require('path')

/**
 * Set up API mocking for booking endpoints
 * @param {import('@playwright/test').Page} page
 * @param {string} fixture - fixture filename (e.g., 'bookings-success.json')
 */
async function setupApiMocking (page, fixture = 'bookings-success.json') {
  // Load fixture data
  const fixtureData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'fixtures', fixture), 'utf8')
  )

  // Mock API responses
  await page.route(/\/kunden-portal\/myBookings/, async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(fixtureData)
    })
  })

  // Mock any other booking-related endpoints
  await page.route(/\/api\/bookings/, async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(fixtureData)
    })
  })
}

/**
 * Wait for dashboard component to be fully loaded and rendered
 * @param {import('@playwright/test').Page} page
 * @param {number} timeout
 */
async function waitForDashboardReady (page, timeout = 15000) {
  // Wait for web components to be loaded
  await page.waitForSelector('body[wc-config-load="true"]', { timeout })

  // Wait for p-dashboard to exist
  await page.waitForSelector('p-dashboard', { timeout })

  // Wait for kp-o-dashboard to be rendered inside p-dashboard
  await page.waitForFunction(() => {
    const dashboard = document.querySelector('p-dashboard')
    return dashboard && dashboard.shadowRoot && dashboard.shadowRoot.querySelector('kp-o-dashboard')
  }, { timeout })

  // Wait for o-grid to be rendered (the main content container)
  await page.waitForFunction(() => {
    const dashboard = document.querySelector('p-dashboard')
    const orgDashboard = dashboard?.shadowRoot?.querySelector('kp-o-dashboard')
    return orgDashboard && orgDashboard.shadowRoot && orgDashboard.shadowRoot.querySelector('o-grid')
  }, { timeout })

  // Wait for the first section to have content
  await page.waitForFunction(() => {
    const dashboard = document.querySelector('p-dashboard')
    const orgDashboard = dashboard?.shadowRoot?.querySelector('kp-o-dashboard')
    const grid = orgDashboard?.shadowRoot?.querySelector('o-grid')

    if (!grid || !grid.shadowRoot) return false

    // Check if any of the main sections exist
    const nextAppointments = grid.shadowRoot.querySelector('#next-appointments')
    const courses = grid.shadowRoot.querySelector('#courses')

    return nextAppointments || courses
  }, { timeout })
}

/**
 * Trigger the booking data loading manually for tests
 * @param {import('@playwright/test').Page} page
 * @param {object} bookingsData
 */
async function triggerBookingDataUpdate (page, bookingsData) {
  await page.evaluate((data) => {
    // Create a promise that resolves with the booking data
    const fetchPromise = Promise.resolve(data)

    // Dispatch the update-bookings event that the dashboard listens for
    document.body.dispatchEvent(new CustomEvent('update-bookings', {
      detail: { fetch: fetchPromise },
      bubbles: true,
      cancelable: true,
      composed: true
    }))
  }, bookingsData)
}

/**
 * Get fixture data
 * @param {string} fixture
 * @returns {object}
 */
function getFixtureData (fixture) {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'fixtures', fixture), 'utf8')
  )
}

/**
 * Wait for specific component to be defined and rendered
 * @param {import('@playwright/test').Page} page
 * @param {string} componentName
 * @param {number} timeout
 */
async function waitForComponent (page, componentName, timeout = 10000) {
  // Wait for component to be defined
  await page.waitForFunction((name) => {
    return customElements.get(name) !== undefined
  }, componentName, { timeout })

  // Wait for component to exist in DOM
  await page.waitForSelector(componentName, { timeout })
}

module.exports = {
  setupApiMocking,
  waitForDashboardReady,
  triggerBookingDataUpdate,
  getFixtureData,
  waitForComponent
}
