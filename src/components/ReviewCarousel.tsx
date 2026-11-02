'use client';

import { useRef, useState, useEffect } from 'react';

export interface CustomerReview {
  name: string;
  bootModel: string;
  image: string;
}

export const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    name: 'Jonathan Fernandez',
    bootModel: "Haaland's Signature Edition Phantom GX",
    image: '/Reviews/Jonthan%20farnandez%20Hallands%20signature%20edition%20phantom%20gx.jfif',
  },
  {
    name: 'Krishna Rani Sarker',
    bootModel: 'Nike Mercurial Vapor',
    image: '/Reviews/Krishna%20Rani%20Sarker.jpeg',
  },
  {
    name: 'Topu Bormon',
    bootModel: 'Mercurial Vapor 16',
    image: '/Reviews/Mad%20energy%20mercurial%20Vapor%2016.jpeg',
  },
  {
    name: 'Mamunul Islam',
    bootModel: 'Stellar Icon F50',
    image: '/Reviews/Mamunul%20islam%20Steller%20icon%20F50.jfif',
  },
  {
    name: 'Rituporna Chakma',
    bootModel: 'Mercurial Vapor 1 RGN',
    image: '/Reviews/Mercurial%20Vapor%20%201%20RGN%20Rituporna%20Chakma.jpeg',
  },
  {
    name: 'Sheikh Morsalin',
    bootModel: 'Mercurial Vapor 16 Elite',
    image: '/Reviews/Mercurial%20Vapor%2016%20elite%20Sheikh%20Morsalin.jpeg',
  },
  {
    name: 'Mitul Marma',
    bootModel: 'Predator Pro',
    image: '/Reviews/mitul%20marma%20Predetor%20Pro.png',
  },
  {
    name: 'Mursed Ali',
    bootModel: 'Phantom GX 2 Elite',
    image: '/Reviews/Mursed%20Ali%20Phantom%20GX2%20Elite.jpeg',
  },
  {
    name: 'Anisur Rahman Zico',
    bootModel: 'Nike Mercurial Vapor 16 Elite',
    image: '/Reviews/Nike%20mercurial%20vapor%2016%20elite%20Anisur%20Rahman%20Zico.jpeg',
  },
  {
    name: 'Rakib Hossain',
    bootModel: 'Nike Mercurial Vapor 17 Elite FG',
    image: '/Reviews/Rakib%20Hossain%20Nike%20Mercural%20Vapor%2017%20Elite%20FG.jpeg',
  },
  {
    name: 'Saad Uddin',
    bootModel: 'Nike Mercurial Vapor 16 Elite',
    image: '/Reviews/Saad%20Uddin%20Nike%20Mercurial%20Vapor%2016%20Elite.jpeg',
  },
  {
    name: 'Suleyman Diabate',
    bootModel: 'Mercurial Vapor 17 Elite',
    image: '/Reviews/Suleyman%20Diabate%20Mercurial%20Vapor%2017%20Elite.jpeg',
  },
  {
    name: 'Sushanta Tripura',
    bootModel: 'F50 Elite',
    image: '/Reviews/Sushanta%20Tripura%20F50%20Elite.jpeg',
  },
];

export function ReviewCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollDistance = clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollDistance : scrollDistance,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="reviews-section" aria-label="Customer Reviews">
      <div className="reviews-header">
        <div>
          <p className="eyebrow">COMMUNITY &amp; PLAYERS</p>
          <h2>OUR CUSTOMERS</h2>
        </div>
        <div className="reviews-controls" aria-label="Carousel navigation">
          <button
            type="button"
            className="reviews-control-btn"
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label="Previous testimonials"
          >
            ←
          </button>
          <button
            type="button"
            className="reviews-control-btn"
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            aria-label="Next testimonials"
          >
            →
          </button>
        </div>
      </div>

      <div className="reviews-carousel" ref={scrollRef}>
        {CUSTOMER_REVIEWS.map((review, i) => (
          <article className="review-card" key={`${review.name}-${i}`}>
            <div className="review-image-wrapper">
              <img
                src={review.image}
                alt={`${review.name} — ${review.bootModel}`}
                loading="lazy"
                className="review-image"
              />
            </div>
            <div className="review-info">
              <h3 className="review-name">{review.name}</h3>
              <p className="review-boot">{review.bootModel}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

