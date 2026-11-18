'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

const PIXEL_ID = '3247003572156693';

/**
 * Extracts numeric ID from Shopify Global ID (e.g. "gid://shopify/Product/123456" -> "123456")
 */
export function extractId(gid: string): string {
  if (!gid) return '';
  return gid.includes('/') ? gid.split('/').pop() || gid : gid;
}

/**
 * Returns matching ID variations (both clean numeric ID and GID) so Meta Commerce
 * Manager / Advantage+ Catalog Ads matches items with 100% accuracy regardless
 * of feed ID format.
 */
export function getPixelContentIds(...rawIds: (string | undefined | null)[]): string[] {
  const ids = new Set<string>();
  for (const raw of rawIds) {
    if (!raw) continue;
    const clean = extractId(raw);
    if (clean) ids.add(clean);
    ids.add(raw);
  }
  return Array.from(ids);
}

/** Safely call fbq – queues events even before the script loads. */
export function fbPixelEvent(
  eventName: string,
  params?: Record<string, unknown>,
) {
  if (typeof window === 'undefined') return;
  const w = window as unknown as {
    fbq?: {
      (...args: unknown[]): void;
      queue?: unknown[];
      callMethod?: (...args: unknown[]) => void;
      loaded?: boolean;
      version?: string;
      push?: unknown;
    };
    _fbq?: unknown;
  };

  // Ensure fbq stub is always available so events are never dropped before script loads
  if (!w.fbq) {
    const n: {
      (...args: unknown[]): void;
      queue: unknown[];
      callMethod?: (...args: unknown[]) => void;
      loaded: boolean;
      version: string;
      push: unknown;
    } = function (...args: unknown[]) {
      if (n.callMethod) {
        n.callMethod.apply(n, args);
      } else {
        n.queue.push(args);
      }
    };
    n.queue = [];
    n.loaded = true;
    n.version = '2.0';
    n.push = n;
    w.fbq = n;
    if (!w._fbq) w._fbq = n;
  }

  if (params) {
    w.fbq('track', eventName, params);
  } else {
    w.fbq('track', eventName);
  }
}

export function MetaPixel() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  // Fire PageView on client-side navigations
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    fbPixelEvent('PageView');
  }, [pathname]);

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
