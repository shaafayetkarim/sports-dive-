'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from './CartProvider';
import { money, type Product } from '@/lib/types';
export function ProductForm({ product }: { product: Product }) {
  const initial =
    product.variants.nodes.find((v) => v.availableForSale) || product.variants.nodes[0];
  const [selection, setSelection] = useState<Record<string, string>>(
    Object.fromEntries(initial?.selectedOptions.map((o) => [o.name, o.value]) || []),
  );
  const [quantity, setQuantity] = useState(1),
    [added, setAdded] = useState(false);
  const { run, busy, error, loading } = useCart();
  const variant = product.variants.nodes.find((v) =>
    v.selectedOptions.every((o) => selection[o.name] === o.value),
  );
  function select(name: string, value: string) {
    setSelection((s) => ({ ...s, [name]: value }));
    setAdded(false);
  }
  return (
    <div className="product-form">
      <p className="product-price">
        {money(variant?.price || product.priceRange.minVariantPrice)}
        {variant?.compareAtPrice &&
          Number(variant.compareAtPrice.amount) > Number(variant.price.amount) && (
            <del>{money(variant.compareAtPrice)}</del>
          )}
      </p>
      {product.options.map((option) => (
        <fieldset key={option.name}>
          <legend>
            {option.name}: <span className="muted">{selection[option.name]}</span>
          </legend>
          <div className="option-pills">
            {option.optionValues.map((v) => (
              <button
                type="button"
                className={selection[option.name] === v.name ? 'chosen' : ''}
                aria-pressed={selection[option.name] === v.name}
                key={v.name}
                onClick={() => select(option.name, v.name)}
              >
                {v.name}
              </button>
            ))}
          </div>
        </fieldset>
      ))}
      <label className="quantity-label" htmlFor="quantity">
        Quantity
      </label>
      <input
        id="quantity"
        type="number"
        min="1"
        max="99"
        value={Number.isNaN(quantity) ? '' : quantity}
        onChange={(e) => {
          setQuantity(e.target.valueAsNumber);
          setAdded(false);
        }}
      />
      <p className={`stock-message ${variant?.availableForSale ? 'available' : ''}`}>
        {!variant
          ? 'This combination is unavailable. Try another size or colour.'
          : variant.availableForSale
            ? 'Available to add to your bag'
            : 'This variant is sold out.'}
      </p>
      <button
        className="button add-button"
        disabled={
          loading ||
          busy ||
          !variant?.availableForSale ||
          !Number.isInteger(quantity) ||
          quantity < 1 ||
          quantity > 99
        }
        onClick={async () => {
          setAdded(false);
          setAdded(await run({ action: 'add', variantId: variant?.id, quantity }));
        }}
      >
        {busy ? 'ADDING…' : variant?.availableForSale ? 'ADD TO BAG ↗' : 'UNAVAILABLE'}
      </button>
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
      {added && (
        <p role="status" className="added-message">
          Added to your bag. <Link href="/cart">View bag →</Link>
        </p>
      )}
    </div>
  );
}
