import Link from 'next/link';
import { getProducts } from '@/lib/shopify';
import { ProductCard } from '@/components/ProductCard';
export const metadata = { title: 'Search' };
export default async function Search({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; after?: string }>;
}) {
  const params = await searchParams;
  const q = (typeof params.q === 'string' ? params.q : '').trim().slice(0, 100);
  const products = q
    ? await getProducts(
        typeof params.after === 'string' ? params.after : undefined,
        'RELEVANCE',
        q,
        false,
      )
    : null;
  return (
    <section className="search-page">
      <p className="eyebrow">FIND YOUR NEXT FAVOURITE</p>
      <h1>What’s your game?</h1>
      <form action="/search" className="search-form">
        <label className="sr-only" htmlFor="search">
          Search products
        </label>
        <input
          id="search"
          name="q"
          placeholder="Jackets, boots, turfs, backpacks…"
          defaultValue={q}
          maxLength={100}
          required
        />
        <button type="submit" className="button">
          SEARCH ↗
        </button>
      </form>
      {products && (
        <>
          <p className="search-summary">
            {products.nodes.length} results on this page for “{q}”
          </p>
          <div className="product-grid">
            {products.nodes.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {products.nodes.length === 0 && (
            <div className="empty-state">
              <h2>No matching products.</h2>
              <p>Try a product name or category.</p>
              <Link href="/collections/all-products">Browse all products →</Link>
            </div>
          )}
          {products.pageInfo.hasNextPage && (
            <Link
              className="button"
              href={`/search?q=${encodeURIComponent(q)}&after=${encodeURIComponent(products.pageInfo.endCursor || '')}`}
            >
              NEXT PAGE →
            </Link>
          )}
        </>
      )}
    </section>
  );
}
