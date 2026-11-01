# Sports Dive — Next.js + Shopify

A local development project styled after your LABFRESH screenshots, using your supplied Sports Dive logo. Includes the actual Brockmann Medium webfont from Atipo, a full-width Products/About mega menu, GSAP ScrollSmoother, collection browsing, product options, search, a persistent bag and Shopify checkout handoff.

## Run it locally

Node.js 20.9+ is required (Node 24 recommended). Extract the ZIP and open this folder in your editor. Run:

```sh
npm ci
```

Copy `.env.example` to `.env.local` in your editor. Or use one of these:

```powershell
# Windows PowerShell
Copy-Item .env.example .env.local
```

```sh
# macOS / Linux
cp .env.example .env.local
```

```sh
npm run dev
```

Open **http://localhost:3000**. Demo mode needs no credentials. It includes 12 explicitly fictional products with local illustrations, USD prices and sample pages. Real cart operations and checkout stay disabled in demo mode. Switch to your Shopify connection to enable them.

## Connect Shopify

Follow **SHOPIFY-ADMIN-SETUP.md** in order. That guide covers permissions, collections, menus, pages, images, filters, inventory, shipping and checkout testing.

Edit `.env.local`:

```dotenv
SHOPIFY_DEMO_MODE=false
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_PRIVATE_TOKEN=YOUR_PRIVATE_STOREFRONT_TOKEN
SHOPIFY_API_VERSION=2026-10
SHOPIFY_PRODUCTS_MENU=sports-dive-products
SHOPIFY_ABOUT_MENU=sports-dive-about
SHOPIFY_COLOUR_OPTION_NAME=Colour
TRUST_PROXY_BUYER_IP=false
```

Use the PRIVATE Storefront token from Shopify's Headless channel. Never use an Admin token here. Restart the dev server after environment changes. No live store was connected during delivery because no store credentials were provided.

## Project map

| File / directory                        | Purpose                                                       |
| --------------------------------------- | ------------------------------------------------------------- |
| `src/app/page.tsx`                      | Homepage, supplied logo hero, featured tabs, category stories |
| `src/app/collections/[handle]/page.tsx` | Collection results, filters, sorting and cursor pagination    |
| `src/app/products/[handle]/page.tsx`    | Product detail and related products                           |
| `src/app/search/page.tsx`               | Live catalogue search                                         |
| `src/app/pages/[handle]/page.tsx`       | Sanitized Shopify-managed About/help pages                    |
| `src/app/cart/page.tsx`                 | Bag, quantity controls, removal and checkout                  |
| `src/app/api/cart/route.ts`             | Server-side cart boundary and validation                      |
| `src/lib/shopify.ts`                    | Private-token Storefront API client and data access           |
| `src/lib/queries.ts`                    | Validated Shopify GraphQL operations                          |
| `src/lib/config.ts`                     | Default category handles, navigation fallbacks, sort mapping  |
| `src/lib/demo.ts`                       | Clearly marked preview products and content                   |
| `src/components/Header.tsx`             | Hover, focus, click and mobile disclosure menus               |
| `src/components/SmoothScroll.tsx`       | GSAP ScrollSmoother lifecycle                                 |
| `src/components/ProductForm.tsx`        | Colour/size combinations and availability                     |
| `src/app/globals.css`                   | Responsive styling and self-hosted font                       |
| `public/brand/sports-dive.png`          | Your supplied logo, unchanged                                 |
| `public/demo`                           | Local demo illustrations, replaced by real Shopify imagery    |
| `public/fonts` / `licenses`             | Brockmann Medium webfont and original licence                 |
| `tests`                                 | Shopify simulator and desktop/mobile browser checks           |

## Design and motion

The reference's white canvas, fine borders, green buttons, wide mega menu, uppercase headings, large product cards, editorial category tiles and split sections are rebuilt as components. The hero uses your logo on a light background. There is no women's navigation or collection. No reviews, ratings, free shipping promises or video controls have been invented.

GSAP ScrollSmoother runs on desktop fine-pointer devices, with native scrolling on phones/touch devices and for reduced-motion preferences. The header and navigation remain outside the transformed scrolling wrapper. Smoother instances are cleaned up on route changes and content size is observed for refreshes. The page is usable if JavaScript animation is unavailable.

The exact font family is Brockmann. The Medium webfont was obtained from the foundry's free Medium package; its original one-website webfont licence is included. See `licenses/Brockmann-webfont-license.pdf` when using this project for additional separate websites. No desktop font is installed by this project.

## What the Shopify admin controls

Shopify manages products, variant options, prices, compare-at prices, photos, stock, collections and collection images. The Products menu reads Shopify collection links, so staff can add or reorder categories without editing Next.js. The About menu reads Shopify page links. Product and page updates are requested without a stale application cache and appear on the next page request/refresh.

The hero copy, announcement, footer layout and homepage section labels live in source code. They are not advertised as editable Shopify theme sections. This headless frontend does not use the Shopify theme editor. Customer login, newsletter signup, product reviews and video playback are not included because they need their own actual services/content. A separate admin dashboard is not needed: use Shopify admin.

## Customer and failure flows

- Category clicks use collection handles, never guessed product-type matching in live mode.
- Size, colour, availability and price filters are server queries, applied before pagination. Enable matching filters in Shopify Search & Discovery.
- Sort/filter links preserve their parameters and reset stale pagination cursors.
- Products load all variant pages. Missing combinations and sold-out variants cannot be added.
- Quantity input is checked on the client and server; Shopify remains the stock and price authority.
- Bag IDs stay in HttpOnly cookies, including their secret key. JSON sent to the browser excludes the cart ID.
- Mutations are serialized within the tab and never retried automatically. Inventory errors surface with the latest available cart state. Other tabs sync when focused.
- Expired bag reads clear the cookie; add can create a new bag; stale update/checkout returns a clear recovery message.
- Network errors, missing products, unpublished collections, empty search and invalid price ranges have visible recovery states.
- A fresh Shopify checkout URL is retrieved when the buyer presses checkout.

Read `ARCHITECTURE.md` for flow details and current limits. No software can be guaranteed error-free; live acceptance checks in the admin guide are required before selling.

## Checks and deployment

```sh
npm run typecheck
npm run build
npm start
```

For automated browser tests:

```sh
npx playwright install chromium
npm run test:e2e
```

The test command builds the app and starts a server with a test-only Shopify simulator. It uses fake credentials and does not create products, change a store or place real orders. Never deploy with `tests/mock-shopify.cjs` preloaded.

Deploy as a Node.js Next.js application, for example on Vercel. It cannot be statically exported. Add the environment variables to the hosting provider, set demo mode to false, and connect the frontend domain through that host. Keep Shopify's checkout domain configured. Do not commit `.env.local`.

For private-token requests in production, configure the real buyer IP through a trusted hosting proxy. `TRUST_PROXY_BUYER_IP=true` enables forwarding from `x-forwarded-for`; enable it only when your proxy overwrites incoming copies of that header. Otherwise adapt `src/lib/shopify.ts` to the host's documented trusted IP header. Configure production rate limits, monitoring and any market-specific currency context before launch.

## Official references

- https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/getting-started
- https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/products-collections/filter-products
- https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/cart/manage
- https://shopify.dev/docs/api/usage/authentication#access-tokens-for-the-storefront-api
- https://gsap.com/docs/v3/Plugins/ScrollSmoother/
- https://www.atipofoundry.com/fonts/brockmann
- https://nextjs.org/docs/app/getting-started/installation
