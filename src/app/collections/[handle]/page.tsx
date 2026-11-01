import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCollection, getNavigation } from '@/lib/shopify';
import { SORTS, type Sort } from '@/lib/config';
import { ProductCard } from '@/components/ProductCard';
import { Filters, SortControl } from '@/components/CollectionControls';
export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  return {
    title: handle
      .split('-')
      .map((s) => s[0]?.toUpperCase() + s.slice(1))
      .join(' '),
  };
}
export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { handle } = await params;
  if (!/^[a-z0-9-]{1,150}$/.test(handle)) notFound();

  const isImportCategory = ['boots', 'turfs', 'backpacks'].includes(handle);
  if (isImportCategory) {
    const nav = await getNavigation();
    const currentTitle =
      { boots: 'Boots', turfs: 'Turfs', backpacks: 'Backpacks' }[handle] ||
      handle[0].toUpperCase() + handle.slice(1);
    return (
      <>
        <div className="collection-title">
          <p className="eyebrow">100% AUTHENTIC GLOBAL SOURCING</p>
          <h1>{currentTitle}</h1>
          <p>We import originals from any brand around the world — 100% authentic.</p>
        </div>
        <div className="collection-toolbar">
          <span>Global Import Service</span>
          <div className="collection-categories">
            <Link
              className={handle === 'all-products' ? 'active' : ''}
              href="/collections/all-products"
            >
              All products
            </Link>
            {nav.categories.map((c) => (
              <Link
                key={c.handle}
                className={handle === c.handle ? 'active' : ''}
                href={`/collections/${c.handle}`}
              >
                {c.title}
              </Link>
            ))}
          </div>
          <div />
        </div>
        <div className="import-showcase">
          <div className="import-hero-card">
            <span className="import-eyebrow">ORIGINAL & VERIFIED</span>
            <h2>We import originals from any brand around the world 100 percent authentic.</h2>
            <p className="import-description">
              Looking for authentic {currentTitle.toLowerCase()} from Nike, Adidas, Puma, Mizuno, or any other brand around the world? We source guaranteed 100% original, brand-new products directly from authorized global retailers and flagship stores.
            </p>
            <div className="import-cta-group">
              <Link href="/pages/contact" className="button">
                REQUEST AN IMPORT <span>↗</span>
              </Link>
              <Link href="/collections/jackets" className="button button-secondary">
                EXPLORE IN-STOCK JACKETS <span>↗</span>
              </Link>
            </div>
          </div>
          <div className="import-features-grid">
            <div className="import-feature-box">
              <span className="import-feature-tag">BRANDS</span>
              <h3>Any Brand Around The World</h3>
              <p>Nike, Adidas, Puma, Mizuno, New Balance, Under Armour, and elite specialist brands worldwide.</p>
            </div>
            <div className="import-feature-box">
              <span className="import-feature-tag">AUTHENTICITY</span>
              <h3>100% Authentic Always</h3>
              <p>Every piece is guaranteed 100% genuine with factory tags, original box, and verifiable serial numbers.</p>
            </div>
            <div className="import-feature-box">
              <span className="import-feature-tag">ON DEMAND</span>
              <h3>Sourced Exactly To Your Size</h3>
              <p>Tell us the model, edition, and size you want. We manage global sourcing, customs clearance, and prompt delivery.</p>
            </div>
          </div>
          <div className="import-process">
            <p className="eyebrow">HOW TO ORDER</p>
            <div className="process-steps">
              <div className="step-item">
                <span className="step-num">01</span>
                <div>
                  <h4>Tell Us What You Want</h4>
                  <p>Send us the brand, model, colorway, and your size.</p>
                </div>
              </div>
              <div className="step-item">
                <span className="step-num">02</span>
                <div>
                  <h4>We Source & Confirm</h4>
                  <p>We check authentic global stock, price, and estimated delivery.</p>
                </div>
              </div>
              <div className="step-item">
                <span className="step-num">03</span>
                <div>
                  <h4>100% Authentic Delivery</h4>
                  <p>Your original imported gear is delivered straight to you.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const raw = await searchParams;
  const get = (k: string) => (typeof raw[k] === 'string' ? (raw[k] as string) : '');
  const sort = (Object.hasOwn(SORTS, get('sort')) ? get('sort') : 'featured') as Sort;
  const values = {
    size: get('size').slice(0, 80),
    colour: get('colour').slice(0, 80),
    available: get('available') === '1' ? '1' : '',
    min: get('min'),
    max: get('max'),
  };
  const number = (v: string) =>
    v !== '' && Number.isFinite(Number(v)) && Number(v) >= 0 ? Number(v) : undefined;
  const min = number(values.min),
    max = number(values.max);
  const invalidRange = min !== undefined && max !== undefined && min > max;
  const [collection, nav] = await Promise.all([
    getCollection(handle, get('after') || undefined, sort, {
      size: values.size || undefined,
      colour: values.colour || undefined,
      available: values.available === '1',
      min,
      max,
    }),
    getNavigation(),
  ]);
  if (!collection) notFound();
  const { products } = collection;
  const nodes = invalidRange ? [] : products.nodes;
  const base = `/collections/${handle}`;
  const next = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) if (value) next.set(key, value);
  next.set('sort', sort);
  if (products.pageInfo.endCursor) next.set('after', products.pageInfo.endCursor);
  return (
    <>
      <div className="collection-title">
        <p className="eyebrow">THE SPORTS DIVE LINE-UP</p>
        <h1>{collection.title}</h1>
        {collection.description && <p>{collection.description}</p>}
      </div>
      <div className="collection-toolbar">
        <span>{nodes.length} products on this page</span>
        <div className="collection-categories">
          <Link
            className={handle === 'all-products' ? 'active' : ''}
            href="/collections/all-products"
          >
            All products
          </Link>
          {nav.categories.map((c) => (
            <Link
              key={c.handle}
              className={handle === c.handle ? 'active' : ''}
              href={`/collections/${c.handle}`}
            >
              {c.title}
            </Link>
          ))}
        </div>
        <SortControl sort={sort} />
      </div>
      <div className="collection-layout">
        <Filters
          key={JSON.stringify(values)}
          base={base}
          filters={products.filters || []}
          values={values}
          sort={sort}
        />
        <div>
          <div className="product-grid collection-products">
            {nodes.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {nodes.length === 0 && (
            <div className="empty-state">
              <h2>{invalidRange ? 'Check your price range.' : 'No products match just yet.'}</h2>
              <p>
                {invalidRange
                  ? 'The minimum price must be lower than the maximum.'
                  : 'Try another size or colour, or clear your filters.'}
              </p>
              <Link className="button" href={base}>
                CLEAR FILTERS
              </Link>
              <Link className="text-link" href="/collections/all-products">
                Explore all products →
              </Link>
            </div>
          )}
          {products.pageInfo.hasNextPage && !invalidRange && (
            <div className="pagination">
              <Link className="button" href={`${base}?${next.toString()}`}>
                NEXT PAGE →
              </Link>
            </div>
          )}
          {get('after') && (
            <div className="pagination">
              <Link href={base}>Back to first page</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
