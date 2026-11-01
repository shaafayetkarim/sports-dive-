# Delivery validation — Sports Dive v2

- Production Next.js build: passed.
- TypeScript checks: passed.
- All generated GraphQL operations validated against Shopify Storefront API 2026-10.
- Twelve Playwright checks passed across desktop Chromium and an iPhone-sized touch viewport.
- Checked navigation/hover/mobile disclosure, collection selection, filters and empty results, sorting, search, Shopify pages, product options, sold-out variants, persistent cart, quantity changes/removal, stock errors, private cart-ID handling, foreign-origin rejection, expired sessions, checkout URL handoff, reduced motion and scrolling across routes.
- Desktop and mobile layouts visually inspected. No horizontal document overflow at 1440px desktop or 390px mobile.
- Browser tests use a server-side Shopify simulator with fake credentials. No real store was accessed or changed, and no live payment was made.

Before launch, complete the live-store checks in SHOPIFY-ADMIN-SETUP.md. Store credentials, inventory settings, permissions, market context, shipping and payment configuration must be verified against your actual store. No claim of an error-free production system is made.

The archive excludes node_modules, build outputs, browser test traces and real environment files. Use npm ci after extraction.
