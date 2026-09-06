import { SITE_URL } from '../../lib/constants';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Platform } from 'react-native';
import { TOURS, CATEGORIES } from '../../lib/tours';
import { router } from 'expo-router';

// ---------------------------------------------------------------------------
// (tabs)/index.tsx — Home tab.
// On web: SSR home page. Exports metadata for Google/GPTBot/ClaudeBot.
// ---------------------------------------------------------------------------

export const metadata = {
  title: 'Guanacaste Tours — The Complete Guide to Excursions & Adventures in Costa Rica',
  description:
    'Book the best tours and excursions in Guanacaste, Costa Rica. Zip-lining, catamaran sunsets, ATV, whale watching, volcano hikes, sport fishing, snorkeling, and more. Real prices, real reviews, real booking links.',
  openGraph: {
    title: 'Guanacaste Tours — Complete Guide to Excursions & Adventures in Costa Rica',
    description:
      'The most complete guide to tours and excursions in Guanacaste, Costa Rica. Book zip-lining, catamaran sails, ATV tours, whale watching, volcano hikes, sport fishing and more.',
    type: 'website',
    locale: 'en_US',
    url: `${SITE_URL}`,
    siteName: 'Guanacaste Tours',
    images: [
      {
        url: '/images/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'Sunset over Tamarindo beach with catamaran — Guanacaste Tours',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guanacaste Tours — Complete Guide to Excursions & Adventures',
    description:
      'The most complete guide to tours and excursions in Guanacaste, Costa Rica. Real prices, real reviews, book direct.',
    images: ['/images/og-home.jpg'],
  },
  icons: {
    icon: '/favicon.png',
    apple: '/icon.png',
  },
  alternates: {
    canonical: `${SITE_URL}`,
  },
};

export const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Guanacaste Tours',
  description:
    'The complete guide to tours, excursions, and adventures in Guanacaste, Costa Rica. Book zip-lining, catamaran sails, ATV, whale watching, volcano hikes, sport fishing, snorkeling and more.',
  url: `${SITE_URL}`,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.containerContent}>
      {/* Hero */}
      <View style={styles.hero}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1591756413813-37aed080bbc4?w=1200&q=80' }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.heroOverlay}>
          <Text style={styles.heroEyebrow}>Guanacaste, Costa Rica</Text>
          <Text style={styles.heroTitle}>Your complete guide to tours & excursions</Text>
          <Text style={styles.heroSubtitle}>
            Zip-lining, catamaran sunsets, ATV, whale watching, volcano hikes, sport fishing — all in one place.
          </Text>
        </View>
      </View>

      {/* Search bar */}
      <View style={styles.searchSection}>
        <Text style={styles.sectionTitle}>What kind of tour?</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContent}>
          {Object.entries(CATEGORIES).map(([key, label]) => (
              <TouchableOpacity key={key} style={styles.chip} onPress={() => router.push(`/tours?category=${key}`)}>
              <Text style={styles.chipText}>{label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Featured tours */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top-rated tours in Guanacaste</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardScrollContent} style={styles.cardScroll}>
          {TOURS.slice(0, 6).map((tour) => (
            <TouchableOpacity key={tour.slug} style={styles.tourPreview} onPress={() => router.push(`/tours/${tour.slug}`)}>
              <Image
                source={{ uri: tour.images[0]?.src }}
                style={styles.tourPreviewImage}
                resizeMode="cover"
              />
              <Text style={styles.tourPreviewTitle} numberOfLines={2}>{tour.title}</Text>
              <Text style={styles.tourPreviewMeta}>From ${tour.priceFrom} · {tour.duration}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Browse by category</Text>
        <View style={styles.categoryGrid}>
          {Object.entries(CATEGORIES).map(([key, label]) => (
            <TouchableOpacity key={key} style={styles.categoryCard} onPress={() => router.push(`/tours?category=${key}`)}>
              <Text style={styles.categoryLabel}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Trust / affiliate partners */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Book through trusted partners</Text>
        <View style={styles.partnersRow}>
          {['GetYourGuide', 'Viator', 'Booking.com', 'Discover Cars'].map((label) => (
            <View key={label} style={styles.partnerBadge}>
              <Text style={styles.partnerLabel}>{label}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.disclosure}>
          We may earn a commission when you book through our links — at no extra cost to you.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  containerContent: { flexGrow: 1, paddingBottom: 32 },
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  hero: { height: 260, backgroundColor: '#0B4155' },
  heroImage: { width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 },
  heroOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 20, backgroundColor: 'rgba(11, 65, 85, 0.65)',
  },
  heroEyebrow: { color: '#FDF3E0', fontSize: 13, fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 },
  heroTitle: { color: '#FFFFFF', fontSize: 26, fontWeight: '800', lineHeight: 32, marginBottom: 8 },
  heroSubtitle: { color: '#FDF3E0', fontSize: 15, lineHeight: 22, opacity: 0.92, marginBottom: 16 },
  searchSection: { padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  section: { padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  sectionTitle: { color: '#0B4155', fontSize: 18, fontWeight: '800', marginBottom: 14 },
  chipsContent: { paddingVertical: 4 },
  chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E6F4FE', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, marginRight: 8, gap: 6 },
  chipText: { color: '#0B4155', fontSize: 13, fontWeight: '600' },
  cardScroll: { maxHeight: 220 },
  cardScrollContent: { paddingRight: 12 },
  tourPreview: { width: 300, backgroundColor: '#FFFFFF', borderRadius: 12, overflow: 'hidden', marginRight: 12, ...Platform.select({ web: { WebkitBoxShadow: '0 4px 12px rgba(11,65,85,0.08)', boxShadow: '0 4px 12px rgba(11,65,85,0.08)' } }) },
  tourPreviewImage: { width: '100%', height: 180 },
  tourPreviewTitle: { color: '#0B4155', fontSize: 15, fontWeight: '700', lineHeight: 21, marginBottom: 8, paddingHorizontal: 14 },
  tourPreviewMeta: { color: '#6B7280', fontSize: 12, fontWeight: '500', paddingHorizontal: 14, paddingBottom: 14, paddingTop: 2 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categoryCard: { width: '31%', backgroundColor: '#F9FAFB', borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
  categoryLabel: { color: '#0B4155', fontSize: 13, fontWeight: '600', marginTop: 6, textAlign: 'center' },
  partnersRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  partnerBadge: { backgroundColor: '#E6F4FE', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: 1, borderColor: '#1D7FA8' },
  partnerLabel: { color: '#1D7FA8', fontSize: 11, fontWeight: '700' },
  disclosure: { color: '#6B7280', fontSize: 12, marginTop: 10, lineHeight: 17 },
});
