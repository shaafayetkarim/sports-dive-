# Shopify admin setup and launch checks

Use your EXISTING Shopify store. This project does not create another store.

## 1. API connection

1. Install Shopify's official **Headless** sales channel in Shopify admin.
2. Create a storefront in that channel and obtain its **private Storefront API token**.
3. Allow product listing reads and the cart/checkout permissions shown in Headless. Allow Storefront content reads for the menu/page queries. Use the minimum necessary Storefront permissions; no Admin API access is used by this project.
4. Put the private token and your permanent `your-store.myshopify.com` hostname in `.env.local`.
5. Set `SHOPIFY_DEMO_MODE=false`; restart Next.js.

Do not use a public token in the private token field. Do not prefix this token with `NEXT_PUBLIC_`. Do not paste it into source files, screenshots or Git.

## 2. Products and variants

Create products in Shopify Products. Each needs title, accurate description, price, photography, Active status and publication to Headless. Add real shipping weights where applicable.

Use options named **Size** and **Colour** (or set `SHOPIFY_COLOUR_OPTION_NAME=Color` if your store uses Color). Use clothing sizes for jackets/jerseys/tracksuits, shoe sizes for boots/turfs, and One size where appropriate. The option pills are read from Shopify; no size list is hardcoded in live product pages.

Enable inventory tracking and configure locations and online fulfillment. Turn off **Continue selling when out of stock** if you do not want backorders. The frontend follows Shopify's availableForSale value, including your backorder settings.

Add compare-at prices if you want genuine Sale badges. All prices and checkout totals come from Shopify. Set descriptive image alt text. Add multiple images to enable product card hover imagery and the product detail gallery.

## 3. Collections

Create and publish these collections to the Headless channel. Collection handles must match these routes (or be linked by your menu):

| Title        | Handle         | Suggested setup                                            |
| ------------ | -------------- | ---------------------------------------------------------- |
| All products | `all-products` | All products you intend to sell through this frontend      |
| Jackets      | `jackets`      | Manual selection or automated product-type/tag condition   |
| Jerseys      | `jerseys`      | Manual selection or automated product-type/tag condition   |
| Boots        | `boots`        | Manual selection or automated product-type/tag condition   |
| Turfs        | `turfs`        | Manual selection or automated product-type/tag condition   |
| Tracksuits   | `tracksuits`   | Manual selection or automated product-type/tag condition   |
| Backpacks    | `backpacks`    | Manual selection or automated product-type/tag condition   |
| Bestsellers  | `bestsellers`  | Eligible products; choose Best selling collection sort     |
| Deals        | `deals`        | Only products you actually intend to promote at a discount |

Add a portrait collection image to each sports category. Those images power mega menu tiles and homepage category/editorial sections. For `all-products`, include only intended products; this is a real collection rather than a special API alias. Keep the `tracksuits` and `backpacks` handles for the two homepage feature links, or update those links in `src/app/page.tsx` if you rename them.

Publishing a collection is not enough if its products remain Draft or unpublished. Check both levels. Keep collections out of the menu until they are ready, or intentionally leave them empty and show the empty state.

## 4. Products mega menu

In Shopify **Content → Menus** (older admin versions may show Navigation), create a menu:

- Title: Sports Dive Products
- Handle: `sports-dive-products`

Add COLLECTION links for Jackets, Jerseys, Boots, Turfs, Tracksuits and Backpacks, in the order you want. Link them by selecting Shopify collections; do not enter custom external URLs. You can add another sportswear collection later. One level of nested collection links is supported and flattened into the collection list. Avoid duplicate links.

The top-level frontend items stay **Products** and **About**. There is no Men's or Women's split. If this menu does not exist, the six configured category links are used. An intentionally empty existing menu stays empty.

The first four category images are used as mega-menu/homepage tiles. Adding/reordering menu items changes those tiles automatically.

## 5. About and help pages

Create and publish pages with these handles:

| Page                | Handle     |
| ------------------- | ---------- |
| Our story           | `about`    |
| Shipping & delivery | `shipping` |
| Returns & exchanges | `returns`  |
| Contact             | `contact`  |

Write your actual shipping destinations, charges, return conditions and support contacts. No free shipping/exchanges promise is added. Create any further policy pages you require and link them in the About menu. Shopify checkout policies are configured separately in Shopify Settings; keep their terms consistent with these frontend pages.

Create a second menu titled Sports Dive About, handle `sports-dive-about`. Add PAGE links to your pages. External URLs and unimplemented resource types are deliberately not imported by this starter. The page body is sanitized: standard headings, paragraphs, lists, tables, links and images work; scripts, inline event handlers and arbitrary embeds are removed.

## 6. Filters

Install Shopify's official **Search & Discovery** app. Under Filters, enable:

- Availability
- Price
- Product option: Size
- Product option: Colour (or Color, matching the env value)

The storefront reads available Size/Colour facet values and counts from Shopify. Counts reflect Shopify's filter configuration and context, not the number of results on the current page. Select a size/colour and press Apply filters. Price and availability are sent to the same collection query. Sorting is done on Shopify, before pagination.

Do not launch filters until they have been checked on a real collection. Option names are case-sensitive; Size must be named Size in this starter. Additional arbitrary facets require a small extension to the filter component/data adapter.

## 7. Payment and delivery

Configure payment providers supported for your store/country, shipping zones and rates, Shopify Markets, taxes, stock locations, policies and order notifications in Shopify admin. This frontend does not install a payment gateway and does not include a direct SSLCommerz integration. Shopify hosts the payment/checkout step.

## 8. Run these checks against your own store

1. Open all six category links. Confirm correct products, photos and prices.
2. Change a product title/price in Shopify; refresh the storefront and confirm the change.
3. Move a category in the Shopify menu and confirm it moves on the storefront.
4. Change an About page and confirm the refreshed content.
5. Test size, colour, in-stock, minimum/maximum price, sort and pagination together.
6. Test an unavailable option combination and a sold-out variant.
7. Add an available variant, reload, increase/decrease quantity and remove it.
8. Reduce stock in Shopify while the product page is open; try to add more than available.
9. Open the bag in a second tab and refocus it after changing the first tab.
10. Complete a **test checkout** using Shopify's test payment setup; confirm the order, inventory decrement and notification in Shopify admin. Do not use a real card just to test.
11. Test on a phone, keyboard only, and with reduced motion enabled.
12. Test production HTTPS, trusted buyer IP forwarding, payment, delivery and policy pages before accepting real orders.

Connection details were not supplied for delivery, so these live acceptance checks have not yet been completed.
