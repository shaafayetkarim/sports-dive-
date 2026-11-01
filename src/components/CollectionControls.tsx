'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Filter } from '@/lib/types';
export function SortControl({ sort }: { sort: string }) {
  const router = useRouter(),
    params = useSearchParams();
  return (
    <label className="sort-control">
      Sort{' '}
      <select
        aria-label="Sort products"
        value={sort}
        onChange={(e) => {
          const next = new URLSearchParams(params.toString());
          next.set('sort', e.target.value);
          next.delete('after');
          router.push(`?${next.toString()}`, { scroll: false });
        }}
      >
        {[
          ['featured', 'Featured'],
          ['newest', 'Newest'],
          ['bestsellers', 'Bestsellers'],
          ['price-asc', 'Price: low to high'],
          ['price-desc', 'Price: high to low'],
          ['title-asc', 'Name: A–Z'],
        ].map(([v, label]) => (
          <option key={v} value={v}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
}
export function Filters({
  filters,
  values,
  sort,
  base,
}: {
  filters: Filter[];
  values: Record<string, string>;
  sort: string;
  base: string;
}) {
  const [open, setOpen] = useState(false);
  const sizes = filters.find((f) => f.label.toLowerCase() === 'size'),
    colours = filters.find((f) => /colou?r/i.test(f.label));
  const active = Object.values(values).some(Boolean);
  return (
    <aside className={`filters ${open ? 'filters-open' : ''}`}>
      <button className="filters-toggle" aria-expanded={open} onClick={() => setOpen(!open)}>
        Filters {active ? '(active)' : ''} <span>{open ? '−' : '+'}</span>
      </button>
      <form action={base} method="get" className="filter-form">
        <div className="filters-heading">
          <span>Filters</span>
          {active && <Link href={base}>Clear all</Link>}
        </div>
        <input type="hidden" name="sort" value={sort} />
        {[sizes, colours].filter(Boolean).map((f) => (
          <details open key={f!.id}>
            <summary>{f!.label}</summary>
            <div className="filter-options">
              <label>
                <input
                  type="radio"
                  name={f === sizes ? 'size' : 'colour'}
                  value=""
                  defaultChecked={!values[f === sizes ? 'size' : 'colour']}
                />
                All
              </label>
              {f!.values.map((v) => (
                <label key={v.id}>
                  <input
                    type="radio"
                    name={f === sizes ? 'size' : 'colour'}
                    value={v.label}
                    defaultChecked={values[f === sizes ? 'size' : 'colour'] === v.label}
                  />
                  <span>
                    {v.label} <span className="muted">({v.count})</span>
                  </span>
                </label>
              ))}
            </div>
          </details>
        ))}
        <details open>
          <summary>Availability</summary>
          <label className="filter-check">
            <input
              type="checkbox"
              name="available"
              value="1"
              defaultChecked={values.available === '1'}
            />
            In stock only
          </label>
        </details>
        <details open>
          <summary>Price</summary>
          <div className="price-inputs">
            <label>
              From
              <input
                aria-label="Minimum price"
                type="number"
                min="0"
                step="0.01"
                name="min"
                defaultValue={values.min}
              />
            </label>
            <label>
              To
              <input
                aria-label="Maximum price"
                type="number"
                min="0"
                step="0.01"
                name="max"
                defaultValue={values.max}
              />
            </label>
          </div>
        </details>
        <button className="button" type="submit">
          APPLY FILTERS ↗
        </button>
      </form>
    </aside>
  );
}
