import { defineConfig, devices } from '@playwright/test'

const port = Number(process.env.PLAYWRIGHT_PORT ?? 4187)

const viewports = [
  ['1280x720', { width: 1280, height: 720 }],
  ['1366x768', { width: 1366, height: 768 }],
  ['1440x900', { width: 1440, height: 900 }],
  ['1536x864', { width: 1536, height: 864 }],
  ['1920x1080', { width: 1920, height: 1080 }],
] as const

const profiles = [
  ['chromium', devices['Desktop Chrome'], { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36' }],
  ['firefox', devices['Desktop Firefox'], {}],
  ['webkit', devices['Desktop Safari'], {}],
] as const

export default defineConfig({
  testDir: './tests/e2e',
  outputDir: './test-results/e2e',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: process.env.CI ? 2 : 1,
  timeout: 45_000,
  expect: { timeout: 7_500 },
  reporter: process.env.CI ? [['line'], ['html', { outputFolder: 'playwright-report', open: 'never' }]] : [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    colorScheme: 'light', locale: 'en-US', reducedMotion: 'reduce',
    screenshot: 'only-on-failure', trace: 'retain-on-failure', video: 'retain-on-failure',
  },
  webServer: {
    command: `npm run build && npm run preview -- --host 127.0.0.1 --port ${port}`,
    url: `http://127.0.0.1:${port}`, reuseExistingServer: false, timeout: 120_000,
    env: { VITE_DATA_MODE: 'real' },
  },
  projects: [
    ...profiles.flatMap(([browserName, profile, extra]) => viewports.map(([size, viewport]) => ({
      name: `${browserName}-${size}`, use: { ...profile, ...extra, browserName, viewport },
    }))),
    { name: 'chromium-text-zoom-200', use: { ...devices['Desktop Chrome'], browserName: 'chromium', viewport: { width: 640, height: 360 } } },
    {
      name: 'chrome-1440x900',
      testIgnore: '**/visual.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        browserName: 'chromium',
        channel: 'chrome',
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'msedge-1440x900',
      testIgnore: '**/visual.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        browserName: 'chromium',
        channel: 'msedge',
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
})
