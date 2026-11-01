import { test, expect } from '@playwright/test';
test('navigation, categories, filters, search and managed pages', async ({ page, isMobile }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('img', { name: 'Sports Dive', exact: true })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.fonts.check('14px Brockmann'))).toBeTruthy();
  if (isMobile) await page.getByRole('button', { name: 'Open navigation' }).click();
  else await page.getByRole('button', { name: 'Products', exact: true }).hover();
  await expect(page.locator('#nav-products')).toBeVisible();
  await page
    .locator('#nav-products .mega-links')
    .getByRole('link', { name: 'Jackets', exact: true })
    .click();
  await expect(page.getByRole('heading', { name: 'Jackets', exact: true })).toBeVisible();
  await expect(page.locator('.collection-products .product-card')).toHaveCount(2);
  await page.getByLabel('Sort products').selectOption('price-desc');
  await expect(page).toHaveURL(/sort=price-desc/);
  if (isMobile) await page.getByRole('button', { name: /Filters/ }).click();
  await page.getByLabel('Minimum price').fill('9999');
  await page.getByRole('button', { name: 'APPLY FILTERS' }).click();
  await expect(page.getByRole('heading', { name: 'No products match just yet.' })).toBeVisible();
  await page.getByRole('link', { name: 'CLEAR FILTERS', exact: true }).click();
  await expect(page.locator('.collection-products .product-card')).toHaveCount(2);
  await page.goto('/search?q=Jacket');
  await expect(page.locator('.product-card')).toHaveCount(1);
  await page.goto('/pages/about');
  await expect(page.getByRole('heading', { name: 'For the love of the game.' })).toBeVisible();
  await page.goto('/collections/missing');
  await expect(page.getByRole('heading', { name: 'This page isn’t available.' })).toBeVisible();
  expect(errors).toEqual([]);
});
test('variant selection, cart persistence, inventory errors, update and removal', async ({
  page,
}) => {
  await page.goto('/products/jackets-0');
  await page.getByRole('button', { name: 'M', exact: true }).click();
  await page.getByRole('button', { name: 'White', exact: true }).click();
  await page.getByRole('button', { name: 'ADD TO BAG' }).click();
  await expect(page.getByRole('status')).toContainText('Added to your bag');
  await page.getByRole('link', { name: 'View bag' }).click();
  await expect(page.locator('.cart-line')).toHaveCount(1);
  await expect(page.locator('.cart-line')).toContainText('White / M');
  await page.reload();
  await expect(page.locator('.cart-line')).toHaveCount(1);
  await page.getByRole('button', { name: 'Increase Sideline Jacket quantity' }).click();
  await expect(page.locator('.quantity-controls')).toContainText('2');
  await page.getByRole('button', { name: 'Decrease Sideline Jacket quantity' }).click();
  await expect(page.locator('.quantity-controls')).toContainText('1');
  const response = await page.request.get('/api/cart');
  const json = await response.json();
  expect(JSON.stringify(json)).not.toContain('private-test-secret');
  expect(json.cart.id).toBeUndefined();
  await page.goto('/products/jackets-0');
  await page.getByLabel('Quantity', { exact: true }).fill('6');
  await page.getByRole('button', { name: 'ADD TO BAG' }).click();
  await expect(page.locator('.product-form [role=alert]')).toContainText('Only 5 items');
  await page.goto('/cart');
  await expect(page.locator('.quantity-controls')).toContainText('1');
  await page.getByRole('button', { name: 'Remove', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Your next game starts here.' })).toBeVisible();
});
test('sold out variants and keyboard navigation remain usable', async ({ page, isMobile }) => {
  await page.goto('/products/jackets-1');
  await page.getByRole('button', { name: 'XL', exact: true }).click();
  await expect(page.getByRole('button', { name: 'UNAVAILABLE', exact: true })).toBeDisabled();
  await expect(page.getByText('This variant is sold out.')).toBeVisible();
  await page.goto('/');
  if (isMobile) await page.getByRole('button', { name: 'Open navigation' }).click();
  else await page.getByRole('button', { name: 'About', exact: true }).focus();
  await page.getByRole('button', { name: 'About', exact: true }).click();
  if (!(await page.locator('#nav-about').isVisible()))
    await page.getByRole('button', { name: 'About', exact: true }).click();
  await page.keyboard.press('Escape');
  await expect(page.locator('#nav-about')).toHaveCount(0);
});
test('cart rejects foreign origins and clears expired sessions', async ({ request }) => {
  const foreign = await request.post('/api/cart', {
    headers: { Origin: 'https://evil.example' },
    data: { action: 'add', variantId: 'gid://shopify/ProductVariant/1', quantity: 1 },
  });
  expect(foreign.status()).toBe(403);
  const expired = await request.post('/api/cart', {
    headers: { Origin: 'http://127.0.0.1:3105', Cookie: 'sportswear_cart=expired' },
    data: { action: 'checkout' },
  });
  expect(expired.status()).toBe(409);
  expect((await expired.json()).cart).toBeNull();
});

test('checkout handoff uses Shopify and reduced motion leaves native scrolling', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  expect(
    await page.locator('#smooth-wrapper').evaluate((el) => getComputedStyle(el).position),
  ).not.toBe('fixed');
  await page.goto('/products/jackets-0');
  await page.getByRole('button', { name: 'ADD TO BAG' }).click();
  await expect(page.getByRole('status')).toContainText('Added');
  await page.goto('/cart');
  const response = await page.request.post('/api/cart', {
    headers: { Origin: 'http://127.0.0.1:3105' },
    data: { action: 'checkout' },
  });
  expect(response.ok()).toBeTruthy();
  expect((await response.json()).checkoutUrl).toBe(
    'https://test-store.myshopify.com/checkouts/test',
  );
  await page.route('https://test-store.myshopify.com/checkouts/test', (r) =>
    r.fulfill({ contentType: 'text/html', body: '<h1>Shopify test checkout</h1>' }),
  );
  await page.getByRole('button', { name: 'CHECKOUT', exact: false }).click();
  await expect(page).toHaveURL('https://test-store.myshopify.com/checkouts/test');
});

test('responsive layout and scrolling survive route changes', async ({ page, isMobile }) => {
  await page.goto('/');
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBeTruthy();
  await page.evaluate(() => window.scrollTo(0, 1100));
  await page.waitForTimeout(1300);
  await expect(page.locator('.feature-tabs')).toBeVisible();
  await page.goto('/collections/jackets');
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBeTruthy();
  await page.goto('/products/jackets-0');
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBeTruthy();
});
