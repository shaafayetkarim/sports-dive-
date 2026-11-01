'use client';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';
import { money } from '@/lib/types';
export default function CartPage() {
  const { cart, busy, error, run, loading, refresh } = useCart();
  return (
    <section className="cart-page">
      <div className="section-heading">
        <h1>
          Your bag <span className="muted">({cart?.totalQuantity || 0})</span>
        </h1>
        <Link className="text-link" href="/collections/all-products">
          CONTINUE SHOPPING ↗
        </Link>
      </div>
      {error && (
        <div role="alert" className="form-error">
          {error}{' '}
          <button className="text-button" disabled={busy || loading} onClick={refresh}>
            Refresh bag
          </button>
        </div>
      )}
      {loading ? (
        <p role="status">Loading your bag…</p>
      ) : !cart?.totalQuantity ? (
        <div className="empty-state">
          <h2>Your next game starts here.</h2>
          <p>Your bag is empty. Find something for your line-up.</p>
          <Link className="button" href="/collections/all-products">
            EXPLORE PRODUCTS ↗
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-lines">
            {cart.lines.nodes.map((line) => (
              <article className="cart-line" key={line.id}>
                <Link className="cart-image" href={`/products/${line.merchandise.product.handle}`}>
                  {line.merchandise.image ? (
                    <img
                      src={line.merchandise.image.url}
                      alt={line.merchandise.image.altText || line.merchandise.product.title}
                    />
                  ) : (
                    <span>SPORTS DIVE</span>
                  )}
                </Link>
                <div className="cart-item-info">
                  <Link href={`/products/${line.merchandise.product.handle}`}>
                    {line.merchandise.product.title}
                  </Link>
                  <p className="muted">{line.merchandise.title}</p>
                  <div className="quantity-controls">
                    <button
                      aria-label={`Decrease ${line.merchandise.product.title} quantity`}
                      disabled={busy || line.quantity <= 1}
                      onClick={() =>
                        run({ action: 'update', lineId: line.id, quantity: line.quantity - 1 })
                      }
                    >
                      −
                    </button>
                    <span>{line.quantity}</span>
                    <button
                      aria-label={`Increase ${line.merchandise.product.title} quantity`}
                      disabled={busy || line.quantity >= 99}
                      onClick={() =>
                        run({ action: 'update', lineId: line.id, quantity: line.quantity + 1 })
                      }
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="text-button remove-button"
                    disabled={busy}
                    onClick={() => run({ action: 'remove', lineId: line.id })}
                  >
                    Remove
                  </button>
                </div>
                <strong className="line-price">{money(line.cost.totalAmount)}</strong>
              </article>
            ))}
          </div>
          <aside className="cart-summary">
            <p className="eyebrow">ORDER SUMMARY</p>
            <div>
              <span>Subtotal</span>
              <strong>{money(cart.cost.subtotalAmount)}</strong>
            </div>
            <p className="muted">Shipping, taxes and discounts are calculated at checkout.</p>
            <button
              className="button"
              disabled={busy || loading}
              onClick={() => run({ action: 'checkout' })}
            >
              {busy ? 'PLEASE WAIT…' : 'CHECKOUT ↗'}
            </button>
            <p>Payment is completed securely through Shopify checkout.</p>
            <Link href="/pages/returns">Returns & exchanges</Link>
          </aside>
        </div>
      )}
    </section>
  );
}
