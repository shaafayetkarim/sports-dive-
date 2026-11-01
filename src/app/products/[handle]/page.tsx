import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getProduct, getProducts } from '@/lib/shopify';
import { ProductForm } from '@/components/ProductForm';
import { ProductGallery } from '@/components/ProductGallery';
import { ProductCard } from '@/components/ProductCard';
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
          <p className="eyebrow">{p.productType}</p>
          <h1>{p.title}</h1>
          <ProductForm product={p} />
          <details open>
            <summary>Product details</summary>
            <p className="product-description">
              {p.description || 'More product details will be available soon.'}
            </p>
          </details>
          <details>
            <summary>Shipping & returns</summary>
            <p>
              <Link href="/pages/shipping">Delivery information ↗</Link>
            </p>
            <p>
              <Link href="/pages/returns">Returns & exchanges ↗</Link>
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
