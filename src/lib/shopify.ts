import 'server-only';
import { headers } from 'next/headers';
import { cache } from 'react';
import type { Product, ProductConnection, Navigation, StorePage } from './types';
import { demoProducts, demoNavigation, demoPages } from './demo';
import { CATEGORIES, ABOUT_LINKS, SORTS, type Sort } from './config';
import * as Q from './queries';
export const isDemo = () => process.env.SHOPIFY_DEMO_MODE !== 'false';
export async function shopify<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN,
    token = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN,
    version = process.env.SHOPIFY_API_VERSION || '2026-10';
  if (!domain || !token || !/^[-a-z0-9]+\.myshopify\.com$/i.test(domain))
    throw new Error('Store connection unavailable. Please try again shortly.');
  if (!/^\d{4}-(01|04|07|10)$/.test(version))
    throw new Error('Store connection unavailable. Please try again shortly.');
  const h = await headers();
  const buyerIP =
    process.env.TRUST_PROXY_BUYER_IP === 'true'
      ? h.get('x-forwarded-for')?.split(',')[0].trim()
      : undefined;
  const response = await fetch(`https://${domain}/api/${version}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Shopify-Storefront-Private-Token': token,
      ...(buyerIP ? { 'Shopify-Storefront-Buyer-IP': buyerIP } : {}),
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error('Store connection unavailable. Please try again shortly.');
  const body = await response.json();
  if (body.errors?.length)
    throw new Error('Store connection unavailable. Please try again shortly.');
  return body.data as T;
}
export async function getProducts(
  after?: string,
  sortKey = 'CREATED_AT',
  query?: string,
  reverse = true,
): Promise<ProductConnection> {
  if (isDemo()) {
    let nodes = [...demoProducts];
    if (query)
      nodes = nodes.filter((p) =>
        `${p.title} ${p.productType}`.toLowerCase().includes(query.toLowerCase()),
      );
    if (sortKey === 'PRICE')
      nodes.sort(
        (a, b) =>
          Number(a.priceRange.minVariantPrice.amount) - Number(b.priceRange.minVariantPrice.amount),
      );
    if (sortKey === 'PRICE' && reverse) nodes.reverse();
    return { nodes, pageInfo: { hasNextPage: false, endCursor: null } };
  }
  return (
    await shopify<{ products: ProductConnection }>(Q.PRODUCTS, { after, sortKey, query, reverse })
  ).products;
}
export const getProduct = cache(async (handle: string) => {
  if (isDemo()) return demoProducts.find((p) => p.handle === handle) || null;
  const { product } = await shopify<{ product: Product | null }>(Q.PRODUCT, { handle });
  if (product)
    while (product.variants.pageInfo.hasNextPage) {
      const next = await shopify<{ product: Pick<Product, 'variants'> | null }>(Q.MORE_VARIANTS, {
        handle,
        after: product.variants.pageInfo.endCursor,
      });
      if (!next.product) break;
      product.variants.nodes.push(...next.product.variants.nodes);
      product.variants.pageInfo = next.product.variants.pageInfo;
    }
  return product;
});
export type FiltersInput = {
  available?: boolean;
  size?: string;
  colour?: string;
  min?: number;
  max?: number;
};
export async function getCollection(
  handle: string,
  after?: string,
  sort: Sort = 'featured',
  filters: FiltersInput = {},
) {
  if (isDemo()) {
    const category = CATEGORIES.find((c) => c.handle === handle);
    if (!category && !['all-products', 'bestsellers', 'deals'].includes(handle)) return null;
    let nodes = demoProducts.filter((p) => !category || p.productType === category.title);
    if (handle === 'deals')
      nodes = nodes.filter((p) => Number(p.compareAtPriceRange.minVariantPrice.amount) > 0);
    if (filters.size)
      nodes = nodes.filter((p) =>
        p.variants.nodes.some(
          (v) =>
            v.selectedOptions.some((o) => o.name === 'Size' && o.value === filters.size) &&
            (!filters.available || v.availableForSale),
        ),
      );
    if (filters.colour)
      nodes = nodes.filter((p) =>
        p.variants.nodes.some(
          (v) =>
            v.selectedOptions.some((o) => o.name === 'Colour' && o.value === filters.colour) &&
            (!filters.available || v.availableForSale),
        ),
      );
    if (filters.min !== undefined)
      nodes = nodes.filter((p) => Number(p.priceRange.minVariantPrice.amount) >= filters.min!);
    if (filters.max !== undefined)
      nodes = nodes.filter((p) => Number(p.priceRange.minVariantPrice.amount) <= filters.max!);
    if (sort.startsWith('price'))
      nodes.sort(
        (a, b) =>
          (Number(a.priceRange.minVariantPrice.amount) -
            Number(b.priceRange.minVariantPrice.amount)) *
          (sort === 'price-desc' ? -1 : 1),
      );
    if (sort === 'title-asc') nodes.sort((a, b) => a.title.localeCompare(b.title));
    return {
      title:
        category?.title ||
        { 'all-products': 'All products', bestsellers: 'Bestsellers', deals: 'Deals' }[handle] ||
        handle,
      description: '',
      products: {
        nodes,
        pageInfo: { hasNextPage: false, endCursor: null },
        filters: [
          {
            id: 'size',
            label: 'Size',
            type: 'LIST',
            values: [
              ...new Set(
                demoProducts.flatMap(
                  (p) =>
                    p.options.find((o) => o.name === 'Size')?.optionValues.map((v) => v.name) || [],
                ),
              ),
            ].map((label) => ({
              id: label,
              label,
              count: demoProducts.filter((p) =>
                p.variants.nodes.some((v) =>
                  v.selectedOptions.some((o) => o.name === 'Size' && o.value === label),
                ),
              ).length,
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
              count: demoProducts.length,
              input: JSON.stringify({ variantOption: { name: 'Colour', value: label } }),
            })),
          },
        ],
      },
    };
  }
  const inputs: Record<string, unknown>[] = [];
  if (filters.available) inputs.push({ available: true });
  if (filters.size) inputs.push({ variantOption: { name: 'Size', value: filters.size } });
  if (filters.colour)
    inputs.push({
      variantOption: {
        name: process.env.SHOPIFY_COLOUR_OPTION_NAME || 'Colour',
        value: filters.colour,
      },
    });
  if (filters.min !== undefined || filters.max !== undefined)
    inputs.push({
      price: {
        ...(filters.min !== undefined ? { min: filters.min } : {}),
        ...(filters.max !== undefined ? { max: filters.max } : {}),
      },
    });
  return (
    await shopify<{
      collection: { title: string; description: string; products: ProductConnection } | null;
    }>(Q.COLLECTION, {
      handle,
      after,
      filters: inputs,
      sortKey: SORTS[sort].key,
      reverse: SORTS[sort].reverse,
    })
  ).collection;
}
export const getNavigation = cache(async (): Promise<Navigation> => {
  if (isDemo()) return demoNavigation;
  type Item = {
    title: string;
    type: string;
    resource: {
      handle: string;
      title?: string;
      image?: Navigation['categories'][number]['image'];
    } | null;
    items?: Item[];
  };
  const d = await shopify<{ products: { items: Item[] } | null; about: { items: Item[] } | null }>(
    Q.NAVIGATION,
    {
      products: process.env.SHOPIFY_PRODUCTS_MENU || 'sports-dive-products',
      about: process.env.SHOPIFY_ABOUT_MENU || 'sports-dive-about',
    },
  );
  const flat = (items: Item[]): Item[] => items.flatMap((i) => [i, ...(i.items || [])]);
  const categories = flat(d.products?.items || [])
    .filter((i) => i.type === 'COLLECTION' && i.resource)
    .map((i) => ({ title: i.title, handle: i.resource!.handle, image: i.resource!.image || null }));
  const about = (d.about?.items || [])
    .filter((i) => i.type === 'PAGE' && i.resource)
    .map((i) => ({ title: i.title, href: `/pages/${i.resource!.handle}` }));
  return {
    categories: d.products ? categories : CATEGORIES.map((c) => ({ ...c, image: null })),
    about: d.about ? about : ABOUT_LINKS,
  };
});
export async function getPage(handle: string): Promise<StorePage | null> {
  if (isDemo()) return demoPages[handle] || null;
  return (await shopify<{ page: StorePage | null }>(Q.PAGE, { handle })).page;
}
