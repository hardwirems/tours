import { SITE_URL } from '../../../lib/constants';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { getToursByTown } from '../../../lib/tours';
import { DESTINATIONS } from '../../../lib/seo-content';
import { Seo } from '../../../components/Seo';
import { SiteFooter } from '../../../components/SiteFooter';
import { color, font, space, radius, shadow, layout } from '../../../lib/theme';

export const metadata = {
  title: 'Guanacaste Destinations — Tours by Beach Town & Area',
  description:
    'Browse tours and things to do by destination in Guanacaste, Costa Rica — Tamarindo, Playa Flamingo, Playa Hermosa, Liberia and Sámara.',
  openGraph: {
    title: 'Guanacaste Destinations',
    description: 'Tours and things to do by beach town and area across Guanacaste, Costa Rica.',
    type: 'website',
    url: `${SITE_URL}/destinations/`,
    siteName: 'Guanacaste Tours',
  },
  alternates: { canonical: `${SITE_URL}/destinations/` },
};

export const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Destinations', item: `${SITE_URL}/destinations/` },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Guanacaste destinations',
    numberOfItems: DESTINATIONS.length,
    itemListElement: DESTINATIONS.map((d, i) => ({
      '@type': 'ListItem', position: i + 1, url: `${SITE_URL}/destinations/${d.slug}/`, name: d.town,
    })),
  },
];

const cardShadow = Platform.select({ web: { boxShadow: shadow.card } as object, default: {} });

export default function DestinationsIndex() {
  const router = useRouter();
  return (
    <>
      <Seo metadata={metadata} jsonLd={jsonLd} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={[styles.page, { maxWidth: layout.maxWidth }]}>
          <View style={styles.header}>
            <Text style={styles.eyebrow}>Guanacaste · Costa Rica</Text>
            <Text accessibilityRole="header" aria-level={1} style={styles.h1}>Explore Guanacaste by destination</Text>
            <Text style={styles.lead}>
              From the surf town of Tamarindo to the calm bays of Flamingo and the volcano gateway of
              Liberia — pick a base and see the tours nearby.
            </Text>
          </View>

          <View style={styles.grid}>
            {DESTINATIONS.map((d) => {
              const tours = getToursByTown(d.town);
              const img = tours[0]?.images[0]?.src;
              return (
                <Link key={d.slug} href={`/destinations/${d.slug}`} asChild>
                  <TouchableOpacity
                    accessibilityRole="link"
                    accessibilityLabel={`${d.town} — ${tours.length} tours`}
                    style={StyleSheet.flatten([styles.card, cardShadow])}
                    activeOpacity={0.92}
                  >
                    <View style={styles.imageWrap}>
                      {img ? <Image source={{ uri: img }} style={styles.image} resizeMode="cover" /> : <View style={styles.image} />}
                      <View style={styles.imageScrim} />
                      <Text style={styles.cardTown}>{d.town}</Text>
                    </View>
                    <View style={styles.cardBody}>
                      <Text style={styles.cardCount}>{tours.length} {tours.length === 1 ? 'tour' : 'tours'}</Text>
                      <Text style={styles.cardLink}>View destination →</Text>
                    </View>
                  </TouchableOpacity>
                </Link>
              );
            })}
          </View>
        </View>
        <SiteFooter />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.ground },
  content: { flexGrow: 1, paddingBottom: space[12] },
  page: { width: '100%', alignSelf: 'center' },
  header: { paddingHorizontal: layout.gutter, paddingTop: space[8], paddingBottom: space[6] },
  eyebrow: { color: color.sky, fontFamily: font.body, fontSize: 12, fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: space[2] },
  h1: { color: color.ink, fontFamily: font.display, fontSize: 34, fontWeight: '600', letterSpacing: -0.4, marginBottom: space[3] },
  lead: { color: color.body, fontFamily: font.body, fontSize: 16, lineHeight: 25, maxWidth: 640 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space[4], paddingHorizontal: layout.gutter },
  card: { flexGrow: 1, flexBasis: 300, maxWidth: 460, backgroundColor: color.surface, borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: color.border },
  imageWrap: { height: 200, backgroundColor: color.primary, position: 'relative', justifyContent: 'flex-end' },
  image: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%', backgroundColor: color.primarySoft },
  imageScrim: { ...StyleSheet.absoluteFillObject, ...Platform.select({ web: { backgroundImage: 'linear-gradient(180deg, rgba(8,47,59,0) 40%, rgba(8,47,59,0.8) 100%)' } as object, default: { backgroundColor: 'rgba(8,47,59,0.3)' } }) },
  cardTown: { color: '#fff', fontFamily: font.display, fontSize: 24, fontWeight: '600', padding: space[4] },
  cardBody: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: space[4] },
  cardCount: { color: color.muted, fontFamily: font.body, fontSize: 14, fontWeight: '600' },
  cardLink: { color: color.coral, fontFamily: font.body, fontSize: 14, fontWeight: '700' },
});
