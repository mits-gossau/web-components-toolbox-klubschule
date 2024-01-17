const { test, expect } = require('@playwright/test')

const dir = process.cwd().split('/').pop().split('-')
const PROJECT_NAME = dir.splice(3)[0]
const WAITING_TIMEOUT = 200

test('button test', async ({ page, browserName }) => {
  await page.goto('src/es/components/pages/Buttons.html')
  const demoPage = await page.waitForSelector('body')
  const wcLoaded = await demoPage.getAttribute('wc-config-load')
  console.log('wait for wc-load')
  if (wcLoaded) {
    console.log('loaded')
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(WAITING_TIMEOUT)
    await page.evaluate(() => window.scrollTo(0, 999999999))
    await page.waitForTimeout(WAITING_TIMEOUT)
    await page.evaluate(() => window.scrollTo(0, 999999999))
    await page.waitForTimeout(WAITING_TIMEOUT)
    await page.evaluate(() => window.scrollTo(0, 999999999))
    await page.waitForTimeout(WAITING_TIMEOUT)
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(WAITING_TIMEOUT)
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(`${PROJECT_NAME}.png`)
  }
})
