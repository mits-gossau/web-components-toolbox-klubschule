/* global customElements */

const { test, expect } = require('@playwright/test')

test('loads a-picture and ks-a-picture without reusing their constructor', async ({ page }) => {
  const pageErrors = []
  page.on('pageerror', error => pageErrors.push(error.message))

  await page.goto('/e2e/picture-alias.html')
  await page.waitForFunction(() => document.body.hasAttribute('wc-config-load'))

  const registrations = await page.evaluate(() => ({
    aPicture: customElements.get('a-picture')?.name,
    ksPicture: customElements.get('ks-a-picture')?.name,
    sameConstructor: customElements.get('a-picture') === customElements.get('ks-a-picture')
  }))

  expect(registrations.aPicture).toBeTruthy()
  expect(registrations.ksPicture).toBeTruthy()
  expect(registrations.sameConstructor).toBe(false)
  expect(pageErrors.some(message => message.includes(
    "Failed to execute 'define' on 'CustomElementRegistry': this constructor has already been used with this registry"
  ))).toBe(false)
})
