const { test, expect } = require('@playwright/test')

test('content stage picture fills its media column', async ({ page }, testInfo) => {
  await page.goto('src/es/components/web-components-toolbox/docs/TemplateMiduweb.html?rootFolder=src&css=./src/css/variablesCustomKlubschule.css&content=./src/es/components/pages/GridPicture.html')
  await page.locator('body[wc-config-load]').waitFor()

  const picture = page.locator('o-grid aside > a-picture')
  const aside = page.locator('o-grid aside')

  await expect(picture).toHaveAttribute('loaded', 'true')

  const pictureBox = await picture.boundingBox()
  const asideBox = await aside.boundingBox()

  expect(pictureBox).not.toBeNull()
  expect(asideBox).not.toBeNull()
  expect(Math.abs(pictureBox.width - asideBox.width)).toBeLessThanOrEqual(1)
  expect(Math.abs(pictureBox.height - asideBox.height)).toBeLessThanOrEqual(1)

  const expectedPosition = testInfo.project.name === 'Mobile Android' ? 'relative' : 'absolute'
  await expect(picture).toHaveCSS('position', expectedPosition)
})
