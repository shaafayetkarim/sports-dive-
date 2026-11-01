'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useCart } from './CartProvider';
import { Icon } from './Icons';
import type { Navigation } from '@/lib/types';
export function Header({ navigation }: { navigation: Navigation }) {
  const path = usePathname();
  const [open, setOpen] = useState<'products' | 'about' | null>(null),
    [mobile, setMobile] = useState(false),
    [scrolled, setScrolled] = useState(false);
  const header = useRef<HTMLElement>(null);
  const { cart } = useCart();
  useEffect(() => {
    setOpen(null);
    setMobile(false);
  }, [path]);
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 32);
    scroll();
    window.addEventListener('scroll', scroll, { passive: true });
    return () => window.removeEventListener('scroll', scroll);
  }, []);
  function close() {
    setOpen(null);
    setMobile(false);
  }
  const transparent = path === '/' && !scrolled && !open && !mobile;
  return (
    <>
      <header
        className={`site-header ${transparent ? 'on-hero' : ''} ${open || mobile ? 'expanded' : ''}`}
        ref={header}
        onMouseLeave={() => {
          if (window.matchMedia('(hover:hover)').matches) setOpen(null);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            close();
            (header.current?.querySelector(`[data-nav="${open}"]`) as HTMLElement)?.focus();
          }
        }}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(null);
        }}
      >
        <div className="announcement">
          <Link href="/collections/all-products">YOUR NEXT GAME STARTS HERE</Link>
        </div>
        <div className="header-row">
          <Link href="/" className="wordmark" aria-label="Sports Dive home">
            <img src="/brand/sports-dive.png" alt="Sports Dive" />
          </Link>
          <nav aria-label="Main navigation" className={mobile ? 'mobile-open' : ''}>
            {(['products', 'about'] as const).map((name) => (
              <button
                key={name}
                data-nav={name}
                className={`nav-trigger ${open === name ? 'active' : ''}`}
                aria-expanded={open === name}
                aria-controls={`nav-${name}`}
                onMouseEnter={() => {
                  if (window.matchMedia('(hover:hover)').matches) setOpen(name);
                }}
                onFocus={() => {
                  if (window.matchMedia('(min-width:1000px)').matches) setOpen(name);
                }}
                onClick={() => setOpen(open === name ? null : name)}
              >
                {name === 'products' ? 'Products' : 'About'}
                <Icon name="chevron" />
              </button>
            ))}
          </nav>
          <div className="header-tools">
            <Link href="/search" aria-label="Search products">
              <Icon name="search" />
            </Link>
            <Link
              href="/cart"
              aria-label={`Shopping bag, ${cart?.totalQuantity || 0} items`}
              className="bag-link"
            >
              <Icon name="bag" />
              <span>{cart?.totalQuantity || 0}</span>
            </Link>
            <button
              className="mobile-toggle"
              onClick={() => {
                setMobile(!mobile);
                setOpen(mobile ? null : 'products');
              }}
              aria-label={mobile ? 'Close navigation' : 'Open navigation'}
              aria-expanded={mobile}
            >
              <Icon name={mobile ? 'close' : 'menu'} />
            </button>
          </div>
        </div>
        {open && (
          <div id={`nav-${open}`} className="mega-menu">
            <div className="mega-links">
              <p className="eyebrow">{open === 'products' ? 'The line-up' : 'Sports Dive'}</p>
              {open === 'products' ? (
                <>
                  <Link onClick={close} href="/collections/all-products">
                    All products
                  </Link>
                  <Link onClick={close} href="/collections/bestsellers">
                    Bestsellers
                  </Link>
                  <Link onClick={close} href="/collections/all-products?sort=newest">
                    New arrivals
                  </Link>
                  <Link onClick={close} href="/collections/deals">
                    Deals
                  </Link>
                </>
              ) : (
                navigation.about.map((l) => (
                  <Link onClick={close} href={l.href} key={l.href}>
                    {l.title}
                  </Link>
                ))
              )}
            </div>
            <div className="mega-links">
              <p className="eyebrow">
                {open === 'products' ? 'Browse collections' : 'Find your next move'}
              </p>
              {open === 'products' ? (
                navigation.categories.map((c) => (
                  <Link onClick={close} key={c.handle} href={`/collections/${c.handle}`}>
                    {c.title}
                  </Link>
                ))
              ) : (
                <>
                  <Link onClick={close} href="/collections/all-products">
                    Shop the collection
                  </Link>
                  <p className="muted">
                    For training days.
                    <br />
                    For match days.
                    <br />
                    For every day.
                  </p>
                </>
              )}
            </div>
            <div className="mega-tiles">
              {navigation.categories.slice(0, 4).map((c) => (
                <Link
                  key={c.handle}
                  onClick={close}
                  href={`/collections/${c.handle}`}
                  className="mega-tile"
                >
                  <div className="tile-art">
                    {c.image ? (
                      <img src={c.image.url} alt={c.image.altText || c.title} />
                    ) : (
                      <span>{c.title}</span>
                    )}
                  </div>
                  <div>
                    <h3>{c.title}</h3>
                    <span>
                      {['boots', 'turfs', 'backpacks'].includes(c.handle)
                        ? '100% Authentic Import'
                        : 'Explore the collection'}{' '}
                      <Icon name="arrow" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
      {open && (
        <button
          tabIndex={-1}
          className="menu-backdrop"
          aria-label="Close navigation"
          onClick={close}
        />
      )}
    </>
  );
}
