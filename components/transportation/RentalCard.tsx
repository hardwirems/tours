import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { Icon } from '../Icon';
import { bookingDataSet } from '../../lib/analytics';
import type { RentalProduct } from '../../lib/transportation-data';
import { color, font, space, radius, shadow } from '../../lib/theme';

// A verified local-rental listing (currently only a qualifying golf cart).
export function RentalCard({ product, campaign }: { product: RentalProduct; campaign: string }) {
  const href = `/go/viator/${product.slug}`;
  const cardShadow = Platform.select({ web: { boxShadow: shadow.card } as object, default: {} });
  return (
    <View style={StyleSheet.flatten([styles.card, cardShadow])}>
      <View style={styles.imgWrap}>
        {product.image ? (
          <Image source={{ uri: product.image.url }} style={styles.img} resizeMode="cover"
            accessibilityLabel={product.image.alt}
            {...(Platform.OS === 'web' ? ({ alt: product.image.alt, loading: 'lazy' } as object) : {})} />
        ) : <View style={styles.img} />}
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>{product.title}</Text>
        <View style={styles.metaRow}>
          <View style={styles.rating}>
            <Icon name="star" size={13} color={color.sun} />
            <Text style={styles.ratingText}>{product.rating.toFixed(2)}</Text>
            <Text style={styles.reviews}>({product.reviews.toLocaleString()})</Text>
          </View>
          {product.freeCancellation ? <Text style={styles.tagGood}>Free cancellation</Text> : null}
        </View>
        <TouchableOpacity
          accessibilityRole="link"
          accessibilityLabel={`Check availability on Viator for ${product.title}`}
          href={href} hrefAttrs={{ rel: 'sponsored noopener' }}
          // Conversion tracking is handled site-wide (app/+html.tsx) from these attributes.
          dataSet={bookingDataSet({ itemId: product.code, itemName: product.title, category: 'rental', placement: 'rental_card', list: campaign })}
          style={styles.cta}
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
  imgWrap: { height: 168, backgroundColor: color.primarySoft },
  img: { width: '100%', height: '100%' },
  body: { padding: space[4], gap: space[2] },
  title: { color: color.ink, fontFamily: font.body, fontSize: 15.5, fontWeight: '700', lineHeight: 21 },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { color: color.ink, fontFamily: font.body, fontSize: 14, fontWeight: '700' },
  reviews: { color: color.muted, fontFamily: font.body, fontSize: 13 },
  tagGood: { backgroundColor: '#E8F5EF', borderWidth: 1, borderColor: '#BFE6D6', color: color.success, fontFamily: font.body, fontSize: 11.5, fontWeight: '700', paddingHorizontal: space[2], paddingVertical: 3, borderRadius: radius.sm },
  cta: { marginTop: space[1], backgroundColor: color.coral, borderRadius: radius.md, minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space[2] },
  ctaText: { color: '#fff', fontFamily: font.body, fontSize: 14.5, fontWeight: '700' },
  priceNote: { color: color.muted, fontFamily: font.body, fontSize: 12, textAlign: 'center' },
});
