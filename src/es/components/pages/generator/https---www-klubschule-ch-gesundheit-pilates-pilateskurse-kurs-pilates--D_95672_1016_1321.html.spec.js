
    const { test, expect } = require('@playwright/test')

    const dir = process.cwd().split('/').pop().split('-')
    const PROJECT_NAME = dir.splice(3)[0]
    const WAITING_TIMEOUT = 200

    test('https---www-klubschule-ch-gesundheit-pilates-pilateskurse-kurs-pilates--D_95672_1016_1321.html', async ({ page, browserName }) => {
      await page.goto('./src/es/components/web-components-toolbox/docs/TemplateMiduweb.html?rootFolder=src&css=./src/css/variablesCustomKlubschule.css&login=./src/es/components/molecules/login/default-/default-.html&logo=./src/es/components/atoms/logo/default-/default-.html&nav=./src/es/components/web-components-toolbox/src/es/components/molecules/multiLevelNavigation/default-/default-.html&footer=./src/es/components/organisms/footer/default-/default-.html&content=./src/es/components/pages/generator/https---www-klubschule-ch-gesundheit-pilates-pilateskurse-kurs-pilates--D_95672_1016_1321.html')
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
        expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(`${PROJECT_NAME || 'snapshot'}.png`)
      }
    })
  