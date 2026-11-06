import Link from 'next/link';
import { getProducts, getCollection, getNavigation } from '@/lib/shopify';
import { ProductCard } from '@/components/ProductCard';
import { VIDEOS } from '@/lib/config';
import { ReviewCarousel } from '@/components/ReviewCarousel';
import { VideoBackground } from '@/components/VideoBackground';
export const dynamic = 'force-dynamic';
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ featured?: string }>;
}) {
  const { featured: tab } = await searchParams;
  const featured = ['bestsellers', 'deals'].includes(tab || '') ? tab! : 'new';
  const [navigation, result] = await Promise.all([
    getNavigation(),
    featured === 'new' ? getProducts() : getCollection(featured),
  ]);
  const products = (result && ('nodes' in result ? result.nodes : result.products.nodes)) || [];
  return (
    <>
      <section className="hero">
        <VideoBackground className="hero-video" src={VIDEOS.hero} />
        <div className="hero-overlay" />
        <div className="hero-copy">
          <h1>
            DON'T BREAK UP
            <br />
            WITH SPORTS
          </h1>
          <p>YOUR KIT. YOUR GAME. YOUR NEXT MOVE.</p>
          <Link className="button" href="/collections/all-products">
            SHOP PRODUCTS <span>↗</span>
          </Link>
        </div>
        <span className="hero-index">SPORTS DIVE / THE COLLECTION</span>
      </section>
      <div className="benefits">
        <div>
          <span className="benefit-icon">↗</span>
          <p>
            ONE PLACE FOR YOUR KIT<small>From warmup to the final whistle.</small>
          </p>
        </div>
        <div>
          <span className="benefit-icon">◎</span>
          <p>
            FIND YOUR FIT<small>Choose your size. Make it yours.</small>
          </p>
        </div>
        <div>
          <span className="benefit-icon">↔</span>
          <p>
            EVERY KIND OF GAME<small>Matchday. Training. Everyday.</small>
          </p>
        </div>
      </div>
      <section className="featured-section" id="featured">
        <div className="feature-tabs" aria-label="Featured collections">
          {[
            ['new', 'NEW'],
            ['bestsellers', 'BESTSELLERS'],
            ['deals', 'DEALS'],
          ].map(([value, label]) => (
            <Link
              key={value}
              scroll={false}
              href={`/?featured=${value}#featured`}
              aria-current={featured === value ? 'page' : undefined}
              className={featured === value ? 'selected' : ''}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="product-grid home-products">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {products.length === 0 && (
          <div className="empty-state">
            <h2>This collection is warming up.</h2>
            <p>New products will appear here when they’re available.</p>
            <Link className="text-link" href="/collections/all-products">
              Explore all products →
            </Link>
          </div>
        )}
        <div className="section-end">
          <Link
            className="text-link"
            href={
              featured === 'new'
                ? '/collections/all-products?sort=newest'
                : `/collections/${featured}`
            }
          >
            EXPLORE THE COLLECTION →
          </Link>
        </div>
      </section>
      <section className="category-section">
        <div className="section-heading">
          <h2>FIND YOUR NEXT MOVE</h2>
          <span>THE SPORTS DIVE LINE-UP</span>
        </div>
        <div className="editorial-grid">
          {navigation.categories.slice(0, 4).map((c) => (
            <Link className="editorial-card" href={`/collections/${c.handle}`} key={c.handle}>
              <div className="editorial-image">
                {c.image ? (
                  <img src={c.image.url} alt={c.image.altText || c.title} loading="lazy" />
                ) : (
                  <div className="no-image">{c.title}</div>
                )}
              </div>
              <div className="editorial-caption">
                <h3>{c.title}</h3>
                <span>
                  {['boots', 'turfs', 'backpacks'].includes(c.handle)
                    ? '100% AUTHENTIC IMPORT'
                    : 'EXPLORE'}{' '}
                  <span>↗</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="story-split">
        <Link className="story-visual" href="/collections/jackets" aria-label="Explore jackets">
          <VideoBackground className="story-video" src={VIDEOS.a} />
        </Link>
        <div className="story-copy">
          <p className="eyebrow">BUILT AROUND YOUR GAME</p>
          <h2>
            SHOW UP.
            <br />
            GEAR UP.
            <br />
            GO AGAIN.
          </h2>
          <p>
            Your next session starts with your kit. Explore premium jackets built for training, sideline, and everyday style.
          </p>
          <Link className="button" href="/collections/jackets">
            EXPLORE JACKETS ↗
          </Link>
        </div>
      </section>
      <section className="story-split reverse">
        <div className="story-copy">
          <p className="eyebrow">100% AUTHENTIC GLOBAL SOURCING</p>
          <h2>
            ATTENTION
            <br />
            TO DETAIL.
          </h2>
          <p>
            We import originals from any brand around the world 100 percent authentic. Boots for the pitch, turfs for the court, and backpacks for everything in between.
          </p>
        </div>
        <Link className="story-visual" href="/collections/boots" aria-label="Explore boots and turfs">
          <VideoBackground className="story-video" src={VIDEOS.b} />
        </Link>
      </section>
      <section className="brand-statement">
        <p className="eyebrow">SPORTS DIVE</p>
        <h2>
          YOUR GAME.
          <br />
          YOUR WAY.
        </h2>
        <Link href="/pages/about" className="text-link">
          MEET SPORTS DIVE ↗
        </Link>
      </section>
      <ReviewCarousel />
    </>
  );
}
