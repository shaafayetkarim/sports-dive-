import Link from 'next/link';
import type { Navigation } from '@/lib/types';
export function Footer({ navigation }: { navigation: Navigation }) {
  return (
    <footer>
      <div className="footer-top">
        <div>
          <p className="eyebrow">QUESTIONS OR FEEDBACK?</p>
          <h2>We’re on your team.</h2>
          <a
            href="https://wa.me/8801763572148?text=Hi%20SportsDive%2C%20I%20have%20a%20question"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ask anything ↗
          </a>
        </div>
        <div className="footer-green">
          <p className="eyebrow">GET YOUR GAME ON</p>
          <h2>Find your next favourite.</h2>
          <Link href="/collections/all-products">Explore all products ↗</Link>
        </div>
      </div>
      <div className="footer-links">
        <Link href="/" className="wordmark" aria-label="Sports Dive home">
          <img src="/brand/sports-dive-black.png" alt="Sports Dive" />
        </Link>
        <div>
          <p className="eyebrow">Products</p>
          {navigation.categories.map((c) => (
            <Link href={`/collections/${c.handle}`} key={c.handle}>
              {c.title}
            </Link>
          ))}
        </div>
        <div>
          <p className="eyebrow">About & help</p>
          {navigation.about.map((l) => (
            <Link href={l.href} key={l.href}>
              {l.title}
            </Link>
          ))}
        </div>
        <div>
          <p className="eyebrow">Your bag</p>
          <Link href="/cart">View shopping bag</Link>
          <Link href="/search">Find a product</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Sports Dive</span>
        <span>
          By{' '}
          <a
            href="https://wa.me/8801788707374"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-credit-link"
          >
            Shafayet Karim
          </a>
        </span>
        <a href="#main">Back to top ↑</a>
      </div>
    </footer>
  );
}
