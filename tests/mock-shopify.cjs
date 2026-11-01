// Test-only Shopify simulator. Loaded exclusively by playwright.config.ts.
// Never use this preload in development or production hosting.
const Module = require('module');
const fs = require('fs');
const ts = require('typescript');
Module._extensions['.ts'] = (mod, file) =>
  mod._compile(
    ts.transpileModule(fs.readFileSync(file, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    }).outputText,
    file,
  );
const fixtures = require('../src/lib/demo.ts');
const products = fixtures.demoProducts.map((p, i) => ({
  ...p,
  id: `gid://shopify/Product/${i + 1}`,
  variants: {
    ...p.variants,
    nodes: p.variants.nodes.map((v, j) => ({
      ...v,
      id: `gid://shopify/ProductVariant/${i * 100 + j + 1}`,
    })),
  },
}));
const nativeFetch = globalThis.fetch;
const carts = new Map();
let counter = 0;
const money = (amount) => ({ amount: String(amount), currencyCode: 'USD' });
function getCart(id) {
  const cart = carts.get(id);
  if (!cart) return null;
  cart.totalQuantity = cart.lines.nodes.reduce((s, l) => s + l.quantity, 0);
  cart.cost = {
    subtotalAmount: money(
      cart.lines.nodes.reduce((s, l) => s + Number(l.cost.totalAmount.amount), 0),
    ),
  };
  return cart;
}
const connection = (nodes) => ({
  nodes,
  pageInfo: { hasNextPage: false, endCursor: null },
  filters: [
    {
      id: 'size',
      label: 'Size',
      type: 'LIST',
      values: ['S', 'M', 'L', 'XL', '39', '40', '41', '42', '43', 'One size'].map((label) => ({
        id: label,
        label,
        count: 2,
        input: JSON.stringify({ variantOption: { name: 'Size', value: label } }),
      })),
    },
    {
      id: 'colour',
      label: 'Colour',
      type: 'LIST',
      values: ['Navy', 'White'].map((label) => ({
        id: label,
        label,
        count: 12,
        input: JSON.stringify({ variantOption: { name: 'Colour', value: label } }),
      })),
    },
  ],
});
globalThis.fetch = async (input, init) => {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  if (!url.startsWith('https://test-store.myshopify.com/')) return nativeFetch(input, init);
  const { query, variables: v = {} } = JSON.parse(init.body);
  const operation = query.match(/(?:query|mutation)\s+(\w+)/)?.[1];
  let data;
  switch (operation) {
    case 'Navigation':
      data = {
        products: {
          items: fixtures.demoNavigation.categories.map((c) => ({
            title: c.title,
            type: 'COLLECTION',
            resource: { ...c },
            items: [],
          })),
        },
        about: {
          items: fixtures.demoNavigation.about.map((l) => ({
            title: l.title,
            type: 'PAGE',
            resource: { handle: l.href.split('/').pop() },
          })),
        },
      };
      break;
    case 'Products': {
      let nodes = products.filter(
        (p) => !v.query || p.title.toLowerCase().includes(v.query.toLowerCase()),
      );
      if (v.sortKey === 'PRICE')
        nodes.sort(
          (a, b) =>
            (Number(a.priceRange.minVariantPrice.amount) -
              Number(b.priceRange.minVariantPrice.amount)) *
            (v.reverse ? -1 : 1),
        );
      data = { products: connection(nodes) };
      break;
    }
    case 'Product':
      data = { product: products.find((p) => p.handle === v.handle) || null };
      break;
    case 'Collection': {
      let nodes = products.filter(
        (p) =>
          ['all-products', 'bestsellers', 'deals'].includes(v.handle) ||
          p.handle.startsWith(v.handle + '-'),
      );
      if (v.handle === 'deals')
        nodes = nodes.filter((p) => Number(p.compareAtPriceRange.minVariantPrice.amount) > 0);
      for (const f of v.filters || []) {
        if (f.variantOption)
          nodes = nodes.filter((p) =>
            p.variants.nodes.some((variant) =>
              variant.selectedOptions.some(
                (o) => o.name === f.variantOption.name && o.value === f.variantOption.value,
              ),
            ),
          );
        if (f.price)
          nodes = nodes.filter(
            (p) =>
              Number(p.priceRange.minVariantPrice.amount) >= (f.price.min || 0) &&
              Number(p.priceRange.minVariantPrice.amount) <= (f.price.max ?? Infinity),
          );
      }
      if (v.sortKey === 'PRICE')
        nodes.sort(
          (a, b) =>
            (Number(a.priceRange.minVariantPrice.amount) -
              Number(b.priceRange.minVariantPrice.amount)) *
            (v.reverse ? -1 : 1),
        );
      const category = fixtures.demoNavigation.categories.find((c) => c.handle === v.handle);
      data = {
        collection:
          category || ['all-products', 'bestsellers', 'deals'].includes(v.handle)
            ? { title: category?.title || v.handle, description: '', products: connection(nodes) }
            : null,
      };
      break;
    }
    case 'Page':
      data = { page: fixtures.demoPages[v.handle] || null };
      break;
    case 'GetCart':
      data = { cart: getCart(v.id) };
      break;
    case 'Checkout': {
      const cart = getCart(v.id);
      data = {
        cart: cart
          ? {
              totalQuantity: cart.totalQuantity,
              checkoutUrl: 'https://test-store.myshopify.com/checkouts/test',
            }
          : null,
      };
      break;
    }
    default: {
      const key = {
        CreateCart: 'cartCreate',
        AddLines: 'cartLinesAdd',
        UpdateLines: 'cartLinesUpdate',
        RemoveLines: 'cartLinesRemove',
      }[operation];
      if (!key) throw new Error('Unknown test operation ' + operation);
      let id = v.cartId;
      if (operation === 'CreateCart') {
        id = `gid://shopify/Cart/test-${++counter}?key=private-test-secret`;
        carts.set(id, { id, lines: { nodes: [] } });
      }
      const cart = carts.get(id);
      const errors = [];
      if (cart) {
        for (const line of v.lines || v.input?.lines || []) {
          if (line.merchandiseId) {
            let product, variant;
            for (const p of products) {
              const match = p.variants.nodes.find((v) => v.id === line.merchandiseId);
              if (match) {
                product = p;
                variant = match;
                break;
              }
            }
            if (!variant || !variant.availableForSale) {
              errors.push({ message: 'This variant is sold out.' });
              continue;
            }
            const old = cart.lines.nodes.find((l) => l.merchandise.id === variant.id);
            const qty = (old?.quantity || 0) + line.quantity;
            if (qty > 5) {
              errors.push({ message: 'Only 5 items are available.' });
              continue;
            }
            if (old) {
              old.quantity = qty;
              old.cost.totalAmount = money(qty * Number(variant.price.amount));
            } else
              cart.lines.nodes.push({
                id: `gid://shopify/CartLine/${variant.id.split('/').pop()}`,
                quantity: qty,
                merchandise: {
                  id: variant.id,
                  title: variant.title,
                  image: variant.image,
                  product: { title: product.title, handle: product.handle },
                },
                cost: { totalAmount: money(qty * Number(variant.price.amount)) },
              });
          } else {
            const old = cart.lines.nodes.find((l) => l.id === line.id);
            if (old) {
              old.quantity = line.quantity;
              const variant = products
                .flatMap((p) => p.variants.nodes)
                .find((v) => v.id === old.merchandise.id);
              old.cost.totalAmount = money(line.quantity * Number(variant.price.amount));
            }
          }
        }
        if (v.lineIds) cart.lines.nodes = cart.lines.nodes.filter((l) => !v.lineIds.includes(l.id));
      }
      data = { [key]: { cart: getCart(id), userErrors: errors } };
    }
  }
  return new Response(JSON.stringify({ data }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
