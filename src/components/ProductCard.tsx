import Link from 'next/link';
import { money, type Product } from '@/lib/types';
export function ProductCard({ product: p }: { product: Product }) {
  const price = p.priceRange.minVariantPrice,
    compare = p.compareAtPriceRange.minVariantPrice;
  const sale = Number(compare.amount) > Number(price.amount);
  const colours = p.options.find((o) => /colou?r/i.test(o.name))?.optionValues || [];
  return (
    <article className="product-card">
      <Link className="card-image" href={`/products/${p.handle}`} aria-label={`View ${p.title}`}>
        {p.featuredImage ? (
          <img src={p.featuredImage.url} alt={p.featuredImage.altText || p.title} loading="lazy" />
        ) : (
          <div className="no-image">{p.category?.name || p.productType || p.title}</div>
        )}
        {p.images.nodes[1] && (
          <img className="alternate-image" src={p.images.nodes[1].url} alt="" loading="lazy" />
        )}
        {!p.availableForSale ? (
          <span className="product-badge">SOLD OUT</span>
        ) : sale ? (
          <span className="product-badge">SALE</span>
        ) : null}
        <span className="card-discover">Discover product ↗</span>
      </Link>
      <div className="card-meta">
        <Link href={`/products/${p.handle}`}>
          <h3>{p.title}</h3>
        </Link>
        <p className="muted">{p.category?.name || p.productType}</p>
        <div>
          {money(price)} {sale && <del>{money(compare)}</del>}
        </div>
        <div className="swatches" aria-label={`Colours: ${colours.map((c) => c.name).join(', ')}`}>
          {colours.slice(0, 7).map((c) => (
            <span
              key={c.name}
              title={c.name}
              style={{
                backgroundColor:
                  {
                    navy: '#213551',
                    white: '#f5f3ed',
                    black: '#171717',
                    green: '#38573c',
                    blue: '#3457a1',
                    red: '#a73339',
                    grey: '#888',
                    gray: '#888',
                  }[c.name.toLowerCase()] || '#d9d2c4',
              }}
            />
          ))}
          {colours.length > 7 && <small>+{colours.length - 7}</small>}
        </div>
      </div>
    </article>
  );
}
