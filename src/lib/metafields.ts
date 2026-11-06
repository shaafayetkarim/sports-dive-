import type { Metafield } from './types';

const LABEL_MAP: Record<string, string> = {
  'outerwear-clothing-features': 'Features',
  'target-gender': 'Gender',
  'age-group': 'Age Group',
  'sleeve-length-type': 'Sleeve Length',
  'clothing-fit': 'Fit',
  size: 'Available Sizes',
  fit: 'Fit',
  neckline: 'Neckline',
  'collar-style': 'Collar',
  'top-length-type': 'Length',
  pattern: 'Pattern',
  fabric: 'Fabric',
  material: 'Material',
  'care-instructions': 'Care Instructions',
  season: 'Season',
  sport: 'Sport',
  'closure-type': 'Closure',
  'jacket-style': 'Jacket Style',
  hooded: 'Hood',
  'lining-material': 'Lining',
  'water-resistance-level': 'Water Resistance',
  'boot-type': 'Boot Type',
  'stud-type': 'Stud Type',
  'surface-type': 'Playing Surface',
  'shoe-width': 'Width',
  'upper-material': 'Upper',
  'outsole-material': 'Sole',
  cushioning: 'Cushioning',
  details: 'Details',
  specifications: 'Specifications',
  care: 'Care Instructions',
  origin: 'Country of Origin',
  features: 'Key Features',
};

// Preferred display order for specs
const KEY_ORDER: string[] = [
  'category',
  'shopify:outerwear-clothing-features',
  'shopify:target-gender',
  'shopify:sleeve-length-type',
  'shopify:size',
  'shopify:neckline',
  'shopify:clothing-fit',
  'shopify:collar-style',
  'shopify:top-length-type',
  'shopify:pattern',
  'shopify:fabric',
  'shopify:material',
  'shopify:care-instructions',
  'shopify:season',
  'shopify:sport',
  'shopify:closure-type',
  'shopify:jacket-style',
  'shopify:hooded',
  'shopify:lining-material',
  'shopify:water-resistance-level',
  'shopify:boot-type',
  'shopify:stud-type',
  'shopify:surface-type',
  'shopify:upper-material',
  'shopify:outsole-material',
  'shopify:cushioning',
];

export function formatMetafieldLabel(key: string): string {
  return (
    LABEL_MAP[key] ||
    key
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export function parseMetafieldValue(metafield: Metafield): string | null {
  if (!metafield) return null;

  // List of metaobject references (most common for Shopify taxonomy attributes)
  if (metafield.references?.nodes?.length) {
    const labels = metafield.references.nodes
      .map((node) => {
        const f = node.fields?.find((f) => f.key === 'label' || f.key === 'name');
        return f ? f.value : null;
      })
      .filter(Boolean) as string[];
    if (labels.length) return labels.join(', ');
  }

  // Single metaobject reference
  if (metafield.reference?.fields) {
    const f = metafield.reference.fields.find((f) => f.key === 'label' || f.key === 'name');
    if (f) return f.value;
  }

  // Raw value
  if (metafield.value) {
    const val = metafield.value.trim();
    // JSON list / object – filter out raw GID strings
    if (val.startsWith('[') || val.startsWith('{')) {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) {
          const nonGids = parsed.filter(
            (item): item is string =>
              typeof item === 'string' && !item.startsWith('gid://'),
          );
          return nonGids.length ? nonGids.join(', ') : null;
        }
      } catch {
        // not valid JSON — fall through
      }
    }
    if (val.startsWith('gid://')) return null;
    return val;
  }

  return null;
}

export type ProductSpec = { label: string; value: string; key: string };

export function getProductSpecs(
  categoryName: string | null | undefined,
  metafields: Metafield[] | null | undefined,
): ProductSpec[] {
  const map = new Map<string, ProductSpec>();

  if (categoryName) {
    map.set('category', { label: 'Category', value: categoryName, key: 'category' });
  }

  for (const m of metafields ?? []) {
    if (!m) continue;
    const value = parseMetafieldValue(m);
    if (value) {
      const key = `${m.namespace}:${m.key}`;
      map.set(key, {
        label: formatMetafieldLabel(m.key),
        value,
        key,
      });
    }
  }

  // Sort by preferred order, then alphabetically for unlisted keys
  const ordered: ProductSpec[] = [];
  for (const k of KEY_ORDER) {
    if (map.has(k)) {
      ordered.push(map.get(k)!);
      map.delete(k);
    }
  }
  // Append remaining (custom namespace, etc.)
  ordered.push(...map.values());

  return ordered;
}
