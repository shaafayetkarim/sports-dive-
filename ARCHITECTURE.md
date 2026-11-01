# System design

## Boundaries

Next.js renders the storefront and runs the private-token API client on the server. Shopify owns products, prices, stock, menus, collections, pages, orders, delivery settings and checkout. The browser handles selections and asks `/api/cart` for allowed actions. No Admin API credentials or duplicated commerce database are needed.

## Browse and content

Shopify menu → published collection handle → collection query with sort/filter/cursor → product cards → product handle → product options/variants. Product detail loads all variant pages and up to 20 images. Cards use a small summary query and up to 8 images. Pages are sanitized before rendering.

All collection filters are applied by Shopify, not to a 24-product browser slice. Search uses the Storefront products search. Category navigation changes are reflected on the next server navigation/refresh; an already open tab is not a live admin preview.

## Cart boundary

The full Shopify cart ID includes a secret. It stays in an HttpOnly cookie and is never serialized to frontend JSON. The cookie is SameSite=Lax and Secure in production. Cart responses are private and not cached. Only known actions, bounded integer quantities, valid variant ID prefixes and same-origin JSON mutations are accepted.

Before mutation, the server checks for an expired cart and stale line IDs. Add can recreate an expired cart. Update/remove/checkout clear a stale session and ask the buyer to add items again. The API reuses the cart returned by Shopify and surfaces user errors. It never accepts a price from the browser and never automatically retries a mutation after a network failure.

The UI serializes mutations per tab, prevents additions during initial bag loading, ignores an old refresh result after a mutation begins, and refreshes when a tab regains focus. Shopify still arbitrates inventory. Simultaneous writes across different tabs/devices are not globally serialized; the bag is refreshed on focus, and stale line recovery is explicit. Distributed idempotency/locking can be added for a higher-volume deployment.

## Checkout

Button click → server retrieves fresh cart.checkoutUrl → browser navigates to Shopify HTTPS checkout. Shipping, taxes, final availability and payment are finalized there. Payment processing, refunds and order fulfillment happen in Shopify. Customer accounts are outside this starter's scope.

## Failure behavior

| Condition                                   | Behavior                                           |
| ------------------------------------------- | -------------------------------------------------- |
| No credentials and demo mode on             | Clearly labelled demo catalogue, checkout disabled |
| Invalid credentials/network failure         | Customer-facing retry page; no token in browser    |
| Missing/unpublished collection/product/page | Not-found page with browse recovery                |
| No filter/search results                    | Clear filters or browse another category           |
| Invalid min/max range                       | Range correction message, no false product matches |
| Unavailable variant/combination             | Add disabled with explicit status                  |
| Stock changes after render                  | Shopify mutation error with cart reconciliation    |
| Cart expires                                | Cookie cleared; add can create new cart            |
| Stale line from another tab                 | Return fresh cart and recovery message             |
| Mutation connection fails                   | No automatic retry; prompt refresh before retry    |
| Reduced motion/touch device                 | Native scrolling                                   |

## Production work that depends on your store

Connect the live store and complete the admin guide's acceptance checks. Add edge rate limits and operational monitoring. Configure trusted real buyer IP forwarding for private-token requests. Default catalogue prices use the store's default market context; add consistent country/currency context and cart buyer identity before serving multiple markets/currencies. No live inventory/payment outcome can be guaranteed by fixture tests.

The cart supports 100 distinct visible lines, and quantities 1–99 per variant. Legacy carts created outside this storefront with more than 100 lines are outside this starter's limit. Add full cart-line pagination if that is required. Thumbnail count is capped intentionally. Collection nodes are paginated 24 at a time. Search and collection navigation do not show a fabricated global product count.

Demo SVGs are artwork for development, not product photography. Replace them with your Shopify product and collection images. The homepage hero text/announcement remain source-controlled; commerce data and About/help content are Shopify-managed.
