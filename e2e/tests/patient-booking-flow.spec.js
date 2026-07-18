import { test, expect } from '@playwright/test';

test.describe('Patient Booking Flow', () => {
  test('create patient → book appointment → verify dashboard', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Doctor Dashboard')).toBeVisible();
    
    await page.click('a[href="/patients"]');
    await expect(page.getByText('Patient Management')).toBeVisible();
    
    await page.getByRole('button', { name: 'Add Patient' }).click();
    
    const form = page.locator('form');
    await form.getByRole('textbox').first().fill('E2E Test Patient');
    await form.getByRole('spinbutton').first().fill('35');
    await form.locator('select').selectOption('Male');
    
    await form.getByRole('button', { name: 'Create' }).click();
    
    await expect(page.getByText('E2E Test Patient').first()).toBeVisible();
    
    await page.click('a[href="/appointments"]');
    await expect(page.getByText('Appointment Scheduling')).toBeVisible();
    
    await page.getByRole('button', { name: 'Book Appointment' }).click();
    
    const apptForm = page.locator('form');
    
    const patientSelect = apptForm.locator('select').first();
    const doctorSelect = apptForm.locator('select').nth(1);
    
    await patientSelect.waitFor({ state: 'visible', timeout: 10000 });
    await doctorSelect.waitFor({ state: 'visible', timeout: 10000 });
    
    await patientSelect.selectOption({ index: 1 });
    await doctorSelect.selectOption({ index: 1 });
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().slice(0, 16);
    await apptForm.locator('input[type="datetime-local"]').fill(dateStr);
    
    await apptForm.getByRole('button', { name: 'Book' }).click();
    
    await page.waitForTimeout(1500);
    
    await page.click('a[href="/"]');
    await expect(page.getByText('Doctor Dashboard')).toBeVisible();
    
    const totalApptsCard = page.locator('text=Total Appointments').locator('..').locator('p');
    const countText = await totalApptsCard.textContent();
    expect(parseInt(countText)).toBeGreaterThan(0);
  });
});
