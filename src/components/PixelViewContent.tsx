'use client';

import { useEffect } from 'react';
import { fbPixelEvent } from './MetaPixel';

export function PixelViewContent({
  productName,
  productId,
  value,
  currency,
  category,
}: {
  productName: string;
  productId: string;
  value: number;
  currency: string;
  category?: string;
}) {
  useEffect(() => {
    fbPixelEvent('ViewContent', {
      content_name: productName,
      content_ids: [productId],
      content_type: 'product',
      value,
      currency,
      ...(category ? { content_category: category } : {}),
    });
  }, [productName, productId, value, currency, category]);

  return null;
}

