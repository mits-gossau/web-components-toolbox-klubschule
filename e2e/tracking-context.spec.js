/* global sessionStorage */

const { test, expect } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  await page.goto('e2e/tracking-context.html')
  await page.waitForFunction(() => globalThis.GTMEvent)
  await page.evaluate(() => {
    sessionStorage.clear()
    window.dataLayer = [{ pageType: 'subcategory page' }]
  })
})

test('select_item stores and exposes list data outside items', async ({ page }) => {
  const eventData = await page.evaluate(() => globalThis.GTMEvent.addTrackingContextToEvent({
    event: 'select_item',
    ecommerce: {
      items: [{
        item_id: 'D_88896_2661--D_88896',
        price: 199.5,
        item_category: 'Gesundheit',
        currency: 'CHF'
      }]
    }
  }, 'search_overlay', globalThis.GTMEvent.getPageType()))

  expect(eventData.ecommerce).toMatchObject({
    item_list_id: 'search_overlay',
    item_list_name: 'subcategory page',
    currency: 'CHF',
    value: 199.5
  })
  expect(eventData.ecommerce.items[0]).toEqual({
    item_id: 'D_88896_2661--D_88896',
    price: 199.5,
    item_category: 'Gesundheit'
  })
  expect(await page.evaluate(() => ({
    id: sessionStorage.getItem('ks_tracking_context'),
    name: sessionStorage.getItem('ks_tracking_item_list_name')
  }))).toEqual({ id: 'search_overlay', name: 'subcategory page' })
})

test('following ecommerce events inherit list data inside items', async ({ page }) => {
  const eventData = await page.evaluate(() => {
    sessionStorage.setItem('ks_tracking_context', 'search_overlay')
    sessionStorage.setItem('ks_tracking_item_list_name', 'subcategory page')
    return globalThis.GTMEvent.addTrackingContextToEvent({
      event: 'begin_checkout',
      ecommerce: {
        items: [{ item_id: 'D_88896_2661--D_88896', price: 199.5, currency: 'CHF' }]
      }
    })
  })

  expect(eventData.ecommerce).toMatchObject({ currency: 'CHF', value: 199.5 })
  expect(eventData.ecommerce).not.toHaveProperty('item_list_id')
  expect(eventData.ecommerce).not.toHaveProperty('item_list_name')
  expect(eventData.ecommerce.items[0]).toMatchObject({
    item_list_id: 'search_overlay',
    item_list_name: 'subcategory page'
  })
})

test('following ecommerce events preserve explicitly provided item list data', async ({ page }) => {
  const eventData = await page.evaluate(() => {
    sessionStorage.setItem('ks_tracking_context', 'search_overlay')
    sessionStorage.setItem('ks_tracking_item_list_name', 'subcategory page')
    return globalThis.GTMEvent.addTrackingContextToEvent({
      event: 'view_item_list',
      ecommerce: {
        item_list_id: 'featured_courses',
        item_list_name: 'Featured courses',
        items: [{
          item_id: 'D_88896_2661--D_88896',
          item_list_id: 'recommended_courses',
          item_list_name: 'Recommended courses'
        }]
      }
    })
  })

  expect(eventData.ecommerce).toMatchObject({
    item_list_id: 'featured_courses',
    item_list_name: 'Featured courses'
  })
  expect(eventData.ecommerce.items[0]).toMatchObject({
    item_list_id: 'recommended_courses',
    item_list_name: 'Recommended courses'
  })
})

test('following ecommerce events only inherit missing item list data', async ({ page }) => {
  const eventData = await page.evaluate(() => {
    sessionStorage.setItem('ks_tracking_context', 'search_overlay')
    sessionStorage.setItem('ks_tracking_item_list_name', 'subcategory page')
    return globalThis.GTMEvent.addTrackingContextToEvent({
      event: 'begin_checkout',
      ecommerce: {
        items: [{
          item_id: 'D_88896_2661--D_88896',
          item_list_id: 'recommended_courses'
        }]
      }
    })
  })

  expect(eventData.ecommerce.items[0]).toMatchObject({
    item_list_id: 'recommended_courses',
    item_list_name: 'subcategory page'
  })
})

test('select_item clears an inherited item_list_name when page type is unavailable', async ({ page }) => {
  const eventData = await page.evaluate(() => {
    sessionStorage.setItem('ks_tracking_item_list_name', 'old page')
    return globalThis.GTMEvent.addTrackingContextToEvent({
      event: 'select_item',
      ecommerce: { items: [{ item_id: 'D_88896_2661--D_88896', price: 199.5 }] }
    }, 'offers_list', null)
  })

  expect(eventData.ecommerce).not.toHaveProperty('item_list_name')
  expect(await page.evaluate(() => sessionStorage.getItem('ks_tracking_item_list_name'))).toBeNull()
})

test('select_item persists list data without ecommerce items', async ({ page }) => {
  await page.evaluate(() => globalThis.GTMEvent.addTrackingContextToEvent({
    event: 'select_item',
    ecommerce: {}
  }, 'search_overlay', 'subcategory page'))

  expect(await page.evaluate(() => ({
    id: sessionStorage.getItem('ks_tracking_context'),
    name: sessionStorage.getItem('ks_tracking_item_list_name')
  }))).toEqual({ id: 'search_overlay', name: 'subcategory page' })
})

test('select_item ignores a blank tracking context', async ({ page }) => {
  await page.evaluate(() => {
    sessionStorage.setItem('ks_tracking_context', 'offers_list')
    return globalThis.GTMEvent.addTrackingContextToEvent({
      event: 'select_item',
      ecommerce: { items: [{ item_id: 'D_88896_2661--D_88896', price: 199.5 }] }
    }, '   ', 'subcategory page')
  })

  expect(await page.evaluate(() => sessionStorage.getItem('ks_tracking_context'))).toBe('offers_list')
})
