'use client';

import { useEffect } from 'react';
import { fbPixelEvent, getPixelContentIds } from './MetaPixel';

export function PixelSearch({
  query,
  contentIds,
}: {
  query: string;
  contentIds?: string[];
}) {
  useEffect(() => {
    if (!query) return;
    const cleanIds = contentIds ? getPixelContentIds(...contentIds) : undefined;
    fbPixelEvent('Search', {
      search_string: query,
      content_type: 'product',
      ...(cleanIds && cleanIds.length > 0 ? { content_ids: cleanIds } : {}),
    });
  }, [query, contentIds]);

  return null;
}

