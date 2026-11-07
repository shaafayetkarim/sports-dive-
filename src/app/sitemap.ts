import type { MetadataRoute } from 'next';
import { SITE_URL, CATEGORIES, ABOUT_LINKS } from '../lib/config';
import { getProducts } from '../lib/shopify';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}`,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/collections/all-products`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/pages/contact`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${SITE_URL}/collections/${c.handle}`,
    lastModified,
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  const aboutRoutes: MetadataRoute.Sitemap = ABOUT_LINKS.map((link) => ({
    url: `${SITE_URL}${link.href}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const productsRes = await getProducts();
    const products = productsRes && 'nodes' in productsRes ? productsRes.nodes : [];
    productRoutes = products.map((p) => ({
      url: `${SITE_URL}/products/${p.handle}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch {
    productRoutes = [];
  }

  return [...staticRoutes, ...categoryRoutes, ...aboutRoutes, ...productRoutes];
}
