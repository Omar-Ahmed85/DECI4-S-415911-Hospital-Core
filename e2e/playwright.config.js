import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!isCI,
  retries: isCI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: isCI
    ? {
        command: 'npm run preview -- --port 5173 --host 0.0.0.0',
        cwd: '../frontend',
        url: 'http://localhost:5173',
        reuseExistingServer: false,
        timeout: 120000,
      }
    : {
        command: 'npm run dev',
        cwd: '../frontend',
        url: 'http://localhost:5173',
        reuseExistingServer: !isCI,
      },
});
