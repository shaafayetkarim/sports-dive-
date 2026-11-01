import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  timeout: 30000,
  use: {
    baseURL: 'http://127.0.0.1:3105',
    trace: 'retain-on-failure',
    ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH
      ? {
          launchOptions: {
            executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH,
            args: ['--no-sandbox', '--disable-dev-shm-usage'],
          },
        }
      : {}),
  },
  webServer: {
    command:
      'node --require ./tests/mock-shopify.cjs ./node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3105',
    url: 'http://127.0.0.1:3105',
    reuseExistingServer: false,
    env: {
      SHOPIFY_DEMO_MODE: 'false',
      SHOPIFY_STORE_DOMAIN: 'test-store.myshopify.com',
      SHOPIFY_STOREFRONT_PRIVATE_TOKEN: 'test-only-fake-token',
      SHOPIFY_API_VERSION: '2026-10',
    },
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } },
    },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
  ],
});
