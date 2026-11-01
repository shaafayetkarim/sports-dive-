'use client';
import { useState } from 'react';
import type { Image } from '@/lib/types';
export function ProductGallery({ images, title }: { images: Image[]; title: string }) {
  const [active, setActive] = useState(0);
  return (
    <div className="product-gallery">
      <div className="gallery-main">
        {images[active] ? (
          <img src={images[active].url} alt={images[active].altText || title} />
        ) : (
          <div className="no-image">{title}</div>
        )}
      </div>
      {images.length > 1 && (
        <div className="gallery-thumbs">
          {images.map((img, i) => (
            <button
              key={`${img.url}-${i}`}
              aria-label={`View image ${i + 1}`}
              aria-pressed={active === i}
              onClick={() => setActive(i)}
            >
              <img src={img.url} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
