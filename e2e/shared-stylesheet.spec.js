/* global sharedStyleResult */

const { test, expect } = require('@playwright/test')

test('shares processed base CSS between shadow roots', async ({ page }) => {
  await page.goto('e2e/shared-stylesheet.html')
  await page.waitForFunction(() => globalThis.sharedStyleResult)

  const result = await page.evaluate(() => sharedStyleResult)

  expect(result.firstSheets).toBe(1)
  expect(result.secondSheets).toBe(1)
  expect(result.sharedInstance).toBe(true)
  expect(result.cacheSize).toBe(1)
  expect(result.firstMarkerCount).toBe(0)
  expect(result.fallbackStyleText).toBeGreaterThan(1000)
  expect(result.orderedSheets).toBe(0)
  expect(result.orderedStyleText).toBeGreaterThan(1000)
  expect(result.headingDisplay).toBe('block')
})

test('falls back when a constructable stylesheet is rejected', async ({ page }) => {
  await page.goto('e2e/shared-stylesheet.html?reject-constructable-stylesheet')
  await page.waitForFunction(() => globalThis.sharedStyleResult)

  const result = await page.evaluate(() => sharedStyleResult)

  expect(result.firstSheets).toBe(0)
  expect(result.secondSheets).toBe(0)
  expect(result.firstMarkerCount).toBe(1)
  expect(result.headingDisplay).toBe('block')
})
