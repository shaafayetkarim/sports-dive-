import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getProduct, getProducts } from '@/lib/shopify';
import { ProductForm } from '@/components/ProductForm';
import { ProductGallery } from '@/components/ProductGallery';
import { ProductCard } from '@/components/ProductCard';
import { getProductSpecs } from '@/lib/metafields';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const p = await getProduct((await params).handle);
  return { title: p?.title || 'Product not found', description: p?.description.slice(0, 155) };
}
export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const p = await getProduct((await params).handle);
  if (!p) notFound();
  let related: Awaited<ReturnType<typeof getProducts>>['nodes'] = [];
  try {
    related = (await getProducts()).nodes.filter((v) => v.id !== p.id).slice(0, 4);
  } catch {}
  const categoryLabel = p.category?.name || p.productType || null;
  const specs = getProductSpecs(p.category?.name || null, p.metafields);
  return (
    <>
      <div className="breadcrumbs">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/collections/all-products">Products</Link>
        <span>/</span>
        <span>{p.title}</span>
      </div>
      <section className="product-detail">
        <ProductGallery
          images={p.images.nodes.length ? p.images.nodes : p.featuredImage ? [p.featuredImage] : []}
          title={p.title}
        />
        <div className="product-info">
          {categoryLabel && <p className="eyebrow">{categoryLabel}</p>}
          <h1>{p.title}</h1>
          <ProductForm product={p} />
          <details open>
            <summary>Product details</summary>
            <p className="product-description">
              {p.description || 'More product details will be available soon.'}
            </p>
          </details>
          {specs.length > 0 && (
            <details>
              <summary>Specifications</summary>
              <dl className="product-specs">
                {specs.map((s) => {
                  const items = s.value.split(', ');
                  const isMulti = items.length > 1;
                  return (
                    <div key={s.key} className="spec-row">
                      <dt>{s.label}</dt>
                      <dd>
                        {isMulti ? (
                          <span className="spec-tags">
                            {items.map((item) => (
                              <span key={item} className="spec-tag">{item}</span>
                            ))}
                          </span>
                        ) : (
                          s.value
                        )}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </details>
          )}
          <details>
            <summary>Shipping &amp; returns</summary>
            <p>
              <Link href="/pages/shipping">Delivery information ↗</Link>
            </p>
            <p>
              <Link href="/pages/returns">Returns &amp; exchanges ↗</Link>
            </p>
          </details>
          <details>
            <summary>Ask anything</summary>
            <p>
              Need sizing advice, custom pre-orders, or more details about this item?
            </p>
            <p>
              <a
                href={`https://wa.me/8801763572148?text=${encodeURIComponent(`Hi SportsDive, I have a question about ${p.title}: `)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Chat on WhatsApp ↗
              </a>
            </p>
          </details>
        </div>
      </section>
      {related.length > 0 && (
        <section className="related-section">
          <div className="section-heading">
            <h2>COMPLETE YOUR LINE-UP</h2>
          </div>
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
