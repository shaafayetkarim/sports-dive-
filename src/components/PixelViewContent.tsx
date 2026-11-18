'use client';

import { useEffect } from 'react';
import { fbPixelEvent, extractId, getPixelContentIds } from './MetaPixel';

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
    const cleanId = extractId(productId);
    fbPixelEvent('ViewContent', {
      content_name: productName,
      content_ids: getPixelContentIds(productId),
      content_type: 'product',
      contents: [{ id: cleanId, quantity: 1, item_price: value }],
      value,
      currency,
      ...(category ? { content_category: category } : {}),
    });
  }, [productName, productId, value, currency, category]);

  return null;
}

