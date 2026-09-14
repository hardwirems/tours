import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { Icon } from '../Icon';
import { track } from '../../lib/analytics';
import type { TransferProduct } from '../../lib/transportation-data';
import { color, font, space, radius, shadow } from '../../lib/theme';

// ---------------------------------------------------------------------------
// TransferCard — a native product card for a verified Viator airport transfer.
// Shows only verified data (title, route, service, rating/reviews, duration,
// free-cancellation). Price is intentionally omitted: Viator "from" prices for
// private transfers are per-person and would mislead — live pricing is on Viator.
// CTA routes through /go/viator/<slug> (rel="sponsored noopener") for tracking +
// correct affiliate attribution.
// ---------------------------------------------------------------------------

const ZONE_SHORT: Record<string, string> = {
  guanacaste: 'your Guanacaste hotel',
  'papagayo-coco': 'Papagayo & Coco',
  'flamingo-conchal': 'Flamingo & Conchal',
  tamarindo: 'Tamarindo',
  'nosara-samara': 'Nosara & Sámara',
  'liberia-riu': 'Liberia & RIU',
  'la-fortuna': 'La Fortuna',
};

const cardShadow = Platform.select({ web: { boxShadow: shadow.card } as object, default: {} });

function duration(p: TransferProduct): string | null {
  if (p.durationMin == null) return null;
  if (p.durationMax && p.durationMax !== p.durationMin) return `~${p.durationMin}–${p.durationMax} min`;
  const m = p.durationMin;
  return m >= 60 ? `~${Math.round((m / 60) * 10) / 10} hr` : `~${m} min`;
}

export function TransferCard({ product, campaign, eager = false }: { product: TransferProduct; campaign: string; eager?: boolean }) {
  const dest = ZONE_SHORT[product.zone] ?? 'Guanacaste';
  const href = `/go/viator/${product.slug}`;
  const dur = duration(product);
  const onBook = () => track('click_viator_booking', {
    category: 'airport_transfer', airport: product.origin, destination: product.zone,
    route: `${product.origin}-${product.zone}`, product_code: product.code, service: product.service, campaign,
  });

  return (
    <View style={StyleSheet.flatten([styles.card, cardShadow])}>
      <View style={styles.imgWrap}>
        {product.image ? (
          <Image
            source={{ uri: product.image.url }}
            style={styles.img}
            resizeMode="cover"
            accessibilityLabel={product.image.alt}
            {...(Platform.OS === 'web' ? ({ alt: product.image.alt, loading: eager ? 'eager' : 'lazy' } as object) : {})}
          />
        ) : <View style={styles.img} />}
        <View style={styles.routeBadge}><Text style={styles.routeBadgeText}>{product.origin} → {dest}</Text></View>
      </View>

      <View style={styles.body}>
        <View style={styles.tagRow}>
          <Text style={styles.tag}>{product.service === 'private' ? 'Private' : 'Shared'}</Text>
          {product.tripType !== 'either' ? <Text style={styles.tag}>{product.tripType === 'round-trip' ? 'Round-trip' : 'One-way'}</Text> : null}
          {product.freeCancellation ? <Text style={[styles.tag, styles.tagGood]}>Free cancellation</Text> : null}
        </View>

        <Text style={styles.title} numberOfLines={2}>{product.title}</Text>

        <View style={styles.metaRow}>
          <View style={styles.rating}>
            <Icon name="star" size={13} color={color.sun} />
            <Text style={styles.ratingText}>{product.rating.toFixed(2)}</Text>
            <Text style={styles.reviews}>({product.reviews.toLocaleString()})</Text>
          </View>
          {dur ? <Text style={styles.dur}>{dur}</Text> : null}
        </View>

        <TouchableOpacity
          accessibilityRole="link"
          accessibilityLabel={`Check availability on Viator for ${product.title}`}
          href={href}
          hrefAttrs={{ rel: 'sponsored noopener' }}
          style={styles.cta}
          onPress={onBook}
          activeOpacity={0.9}
        >
          <Text style={styles.ctaText}>Check availability on Viator</Text>
          <Icon name="arrow-forward" size={15} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.priceNote}>Live price &amp; availability on Viator</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexGrow: 1, flexBasis: 300, maxWidth: 420, backgroundColor: color.surface, borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: color.border },
  imgWrap: { height: 168, backgroundColor: color.primarySoft, position: 'relative' },
  img: { width: '100%', height: '100%' },
  routeBadge: { position: 'absolute', left: space[3], bottom: space[3], backgroundColor: 'rgba(8,47,59,0.86)', borderRadius: radius.pill, paddingHorizontal: space[3], paddingVertical: 5 },
  routeBadgeText: { color: '#fff', fontFamily: font.body, fontSize: 12.5, fontWeight: '700' },
  body: { padding: space[4], gap: space[2] },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space[2] },
  tag: { backgroundColor: color.surfaceAlt, borderWidth: 1, borderColor: color.border, color: color.body, fontFamily: font.body, fontSize: 11.5, fontWeight: '700', paddingHorizontal: space[2], paddingVertical: 3, borderRadius: radius.sm },
  tagGood: { backgroundColor: '#E8F5EF', borderColor: '#BFE6D6', color: color.success },
  title: { color: color.ink, fontFamily: font.body, fontSize: 15.5, fontWeight: '700', lineHeight: 21 },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: space[1] },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { color: color.ink, fontFamily: font.body, fontSize: 14, fontWeight: '700' },
  reviews: { color: color.muted, fontFamily: font.body, fontSize: 13 },
  dur: { color: color.muted, fontFamily: font.body, fontSize: 13, fontWeight: '600' },
  cta: { marginTop: space[2], backgroundColor: color.coral, borderRadius: radius.md, minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space[2] },
  ctaText: { color: '#fff', fontFamily: font.body, fontSize: 14.5, fontWeight: '700' },
  priceNote: { color: color.muted, fontFamily: font.body, fontSize: 12, textAlign: 'center' },
});
