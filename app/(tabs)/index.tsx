import { SITE_URL } from '../../lib/constants';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Platform, useWindowDimensions,
} from 'react-native';
import { TOURS, CATEGORIES } from '../../lib/tours';
import { Link } from 'expo-router';
import { Seo } from '../../components/Seo';
import { DESTINATIONS } from '../../lib/seo-content';
import { color, font, type, space, radius, shadow, layout } from '../../lib/theme';

// ---------------------------------------------------------------------------
// (tabs)/index.tsx — Home. Static-rendered; SEO metadata/jsonLd below.
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
    url: `${SITE_URL}/`,
    siteName: 'Guanacaste Tours',
    images: [
      { url: '/images/og-home.jpg', width: 1200, height: 630, alt: 'Sunset over Tamarindo beach with catamaran — Guanacaste Tours' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guanacaste Tours — Complete Guide to Excursions & Adventures',
    description:
      'The most complete guide to tours and excursions in Guanacaste, Costa Rica. Real prices, real reviews, book direct.',
    images: ['/images/og-home.jpg'],
  },
  icons: { icon: '/favicon.png', apple: '/icon.png' },
  alternates: { canonical: `${SITE_URL}/` },
};

export const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Guanacaste Tours',
  description:
    'The complete guide to tours, excursions, and adventures in Guanacaste, Costa Rica. Book zip-lining, catamaran sails, ATV, whale watching, volcano hikes, sport fishing, snorkeling and more.',
  url: `${SITE_URL}/`,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/tours?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

const cardShadow = Platform.select({ web: { boxShadow: shadow.card } as object, default: {} });

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const narrow = width < 720;
  const heroH = narrow ? 500 : 600;
  const h1Size = narrow ? 34 : 50;
  const h1Line = narrow ? 39 : 55;

  return (
    <>
      <Seo metadata={metadata} jsonLd={jsonLd} />
      <ScrollView style={styles.container} contentContainerStyle={styles.containerContent}>
        {/* Hero */}
        <View style={[styles.hero, { minHeight: heroH }]} nativeID="main">
          <Image source={require('../../assets/hero.jpeg')} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroScrim} />
          <View style={[styles.heroInner, { maxWidth: layout.maxWidth }]}>
            <Text style={styles.heroEyebrow}>Guanacaste · Costa Rica</Text>
            <Text
              accessibilityRole="header"
              aria-level={1}
              style={[styles.heroTitle, { fontSize: h1Size, lineHeight: h1Line }]}
            >
              Find your perfect Guanacaste adventure
            </Text>
            <Text style={styles.heroSubtitle}>
              Zip-lines, catamaran sunsets, volcano hikes, wildlife and more — compare real tours and
              book with trusted operators, all in one place.
            </Text>
            <View style={styles.heroActions}>
              <Link href="/tours" asChild>
                <TouchableOpacity accessibilityRole="button" style={styles.ctaPrimary} activeOpacity={0.9}>
                  <Text style={styles.ctaPrimaryText}>Browse all tours</Text>
                </TouchableOpacity>
              </Link>
              <Link href="/categories/adventure" asChild>
                <TouchableOpacity accessibilityRole="button" style={styles.ctaSecondary} activeOpacity={0.9}>
                  <Text style={styles.ctaSecondaryText}>Explore by activity</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>

        <View style={styles.page}>
          {/* Categories */}
          <View style={styles.section}>
            <Text accessibilityRole="header" aria-level={2} style={styles.sectionTitle}>What kind of trip?</Text>
            <View style={styles.categoryGrid}>
              {Object.entries(CATEGORIES).map(([key, label]) => (
                <Link key={key} href={`/categories/${key}`} asChild>
                  <TouchableOpacity style={styles.categoryCard} activeOpacity={0.85}>
                    <Text style={styles.categoryLabel}>{label}</Text>
                    <Text style={styles.categoryArrow}>→</Text>
                  </TouchableOpacity>
                </Link>
              ))}
            </View>
          </View>

          {/* Featured tours */}
          <View style={styles.section}>
            <Text accessibilityRole="header" aria-level={2} style={styles.sectionTitle}>Top-rated tours in Guanacaste</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardScrollContent}>
              {TOURS.slice(0, 6).map((tour) => (
                <Link key={tour.slug} href={`/tours/${tour.slug}`} asChild>
                  <TouchableOpacity style={[styles.tourPreview, cardShadow]} activeOpacity={0.9}>
                    <Image source={{ uri: tour.images[0]?.src }} style={styles.tourPreviewImage} resizeMode="cover" />
                    <View style={styles.tourPreviewBody}>
                      <Text style={styles.tourPreviewTitle} numberOfLines={2}>{tour.title}</Text>
                      <Text style={styles.tourPreviewMeta}>
                        <Text style={styles.tourPreviewPrice}>From ${tour.priceFrom}</Text> · {tour.duration}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Link>
              ))}
            </ScrollView>
          </View>

          {/* Destinations */}
          <View style={styles.section}>
            <Text accessibilityRole="header" aria-level={2} style={styles.sectionTitle}>Popular destinations</Text>
            <View style={styles.categoryGrid}>
              {DESTINATIONS.map((d) => (
                <Link key={d.slug} href={`/destinations/${d.slug}`} asChild>
                  <TouchableOpacity style={styles.categoryCard} activeOpacity={0.85}>
                    <Text style={styles.categoryLabel}>{d.town}</Text>
                    <Text style={styles.categoryArrow}>→</Text>
                  </TouchableOpacity>
                </Link>
              ))}
            </View>
          </View>

          {/* Trust */}
          <View style={styles.trust}>
            <Text accessibilityRole="header" aria-level={2} style={styles.trustTitle}>Book with confidence</Text>
            <Text style={styles.trustBody}>
              Every tour links to a trusted booking partner — GetYourGuide, Viator and others — with their
              own secure checkout and cancellation terms.
            </Text>
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
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.ground },
  containerContent: { flexGrow: 1, paddingBottom: space[10] },
  page: { width: '100%', maxWidth: layout.maxWidth, marginHorizontal: 'auto' as unknown as number },

  // Hero
  hero: { backgroundColor: color.primary, justifyContent: 'flex-end', overflow: 'hidden' },
  heroImage: { width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 },
  heroScrim: {
    position: 'absolute', bottom: 0, left: 0, right: 0, top: 0,
    ...Platform.select({
      web: { backgroundImage: 'linear-gradient(180deg, rgba(8,47,59,0.15) 0%, rgba(8,47,59,0.35) 45%, rgba(8,47,59,0.86) 100%)' } as object,
      default: { backgroundColor: 'rgba(8,47,59,0.55)' },
    }),
  },
  heroInner: { width: '100%', alignSelf: 'center', paddingHorizontal: layout.gutter, paddingBottom: space[10], paddingTop: space[16] },
  heroEyebrow: {
    color: color.sunLight, fontFamily: font.body, fontSize: type.eyebrow.size, fontWeight: '700',
    letterSpacing: 1.6, textTransform: 'uppercase', marginBottom: space[3],
  },
  heroTitle: { color: color.onDark, fontFamily: font.display, fontWeight: '600', letterSpacing: -0.5, maxWidth: 760, marginBottom: space[4] },
  heroSubtitle: { color: color.onDarkMuted, fontFamily: font.body, fontSize: 17, lineHeight: 26, maxWidth: 560, marginBottom: space[6] },
  heroActions: { flexDirection: 'row', flexWrap: 'wrap', gap: space[3], alignItems: 'center' },
  ctaPrimary: { backgroundColor: color.coral, paddingHorizontal: space[6], paddingVertical: 14, borderRadius: radius.pill, minHeight: 48, justifyContent: 'center' },
  ctaPrimaryText: { color: '#fff', fontFamily: font.body, fontSize: 15, fontWeight: '700', letterSpacing: 0.2 },
  ctaSecondary: {
    backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: space[6], paddingVertical: 14, borderRadius: radius.pill, minHeight: 48, justifyContent: 'center',
  },
  ctaSecondaryText: { color: '#fff', fontFamily: font.body, fontSize: 15, fontWeight: '700', letterSpacing: 0.2 },

  // Sections
  section: { paddingHorizontal: layout.gutter, paddingTop: space[8] },
  sectionTitle: { color: color.ink, fontFamily: font.display, fontSize: 26, fontWeight: '600', letterSpacing: -0.3, marginBottom: space[5] },

  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: space[3] },
  categoryCard: {
    minWidth: 150, flexGrow: 1, flexBasis: 150, backgroundColor: color.surface, borderRadius: radius.md,
    paddingVertical: space[4], paddingHorizontal: space[4], borderWidth: 1, borderColor: color.border,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  categoryLabel: { color: color.primary, fontFamily: font.body, fontSize: 15, fontWeight: '600', flexShrink: 1, paddingRight: space[2] },
  categoryArrow: { color: color.coral, fontFamily: font.body, fontSize: 16, fontWeight: '700' },

  cardScrollContent: { paddingRight: space[4], gap: space[4] },
  tourPreview: { width: 288, backgroundColor: color.surface, borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: color.border },
  tourPreviewImage: { width: '100%', height: 176 },
  tourPreviewBody: { padding: space[4] },
  tourPreviewTitle: { color: color.ink, fontFamily: font.body, fontSize: 15.5, fontWeight: '700', lineHeight: 21, marginBottom: space[2] },
  tourPreviewMeta: { color: color.muted, fontFamily: font.body, fontSize: 13, fontWeight: '500' },
  tourPreviewPrice: { color: color.primary, fontWeight: '700' },

  // Trust
  trust: { marginTop: space[10], marginHorizontal: layout.gutter, backgroundColor: color.surface, borderRadius: radius.xl, borderWidth: 1, borderColor: color.border, padding: space[6] },
  trustTitle: { color: color.ink, fontFamily: font.display, fontSize: 22, fontWeight: '600', marginBottom: space[3] },
  trustBody: { color: color.body, fontFamily: font.body, fontSize: 15, lineHeight: 23, maxWidth: 620, marginBottom: space[5] },
  partnersRow: { flexDirection: 'row', gap: space[2], flexWrap: 'wrap' },
  partnerBadge: { backgroundColor: color.skyLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill },
  partnerLabel: { color: color.sky, fontFamily: font.body, fontSize: 12, fontWeight: '700' },
  disclosure: { color: color.muted, fontFamily: font.body, fontSize: 12.5, marginTop: space[4], lineHeight: 18 },
});
