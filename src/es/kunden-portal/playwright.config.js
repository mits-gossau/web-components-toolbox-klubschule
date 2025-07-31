// @ts-check
const { devices } = require('@playwright/test')

const config = {
  testDir: './tests/spec',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  reporter: [
    ['line'],
    ['html', { outputFolder: 'tests/playwright-report' }]
  ],
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome']
      }
    },
    {
      name: 'Desktop Firefox',
      use: {
        ...devices['Desktop Firefox']
      }
    },
    {
      name: 'Desktop Safari',
      use: {
        ...devices['Desktop Safari']
      }
    },
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5']
      }
    },
    {
      name: 'Tablet iPad',
      use: {
        ...devices['iPad Pro']
      }
    }
  ],
  // webServer: {
  //   command: 'npm run serve',
  //   port: 3000,
  //   reuseExistingServer: !process.env.CI
  // },
  snapshotDir: './tests/test-results/snapshots',
  outputDir: './tests/test-results/output'
}

module.exports = config
