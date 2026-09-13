import { SITE_URL } from '../../../lib/constants';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Icon } from '../../../components/Icon';
import { TOURS, CATEGORY_LABELS, searchTours, getToursByCategory, getToursByTown, Tour, TourCategory } from '../../../lib/tours';
import { TourGrid } from '../../../components/TourCard';
import { Seo } from '../../../components/Seo';
import { SiteFooter } from '../../../components/SiteFooter';
import { color, font, space, radius, layout } from '../../../lib/theme';

export const metadata = {
  title: 'All Tours in Guanacaste, Costa Rica — Browse & Book',
  description:
    'Browse every tour and excursion in Guanacaste, Costa Rica. Filter by category (zip-lining, catamaran, ATV, volcano, wildlife, culture) or town (Tamarindo, Playa Flamingo, Liberia, Playa Hermosa).',
  openGraph: {
    title: 'All Tours in Guanacaste, Costa Rica',
    description:
      'Browse every tour and excursion in Guanacaste. Filter by activity type or town — zip-lining, catamaran, ATV, whale watching, volcano hikes and more.',
    type: 'website',
    url: `${SITE_URL}/tours/`,
    siteName: 'Guanacaste Tours',
  },
  // Filter/search states (?category, ?town, ?q) canonicalize to the base list.
  alternates: { canonical: `${SITE_URL}/tours/` },
};

export default function ToursScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string; town?: string; q?: string }>();

  const category = params.category;
  const town = params.town;
  const query = params.q ?? '';

  let tours: Tour[] = [...TOURS];

  if (category) {
    tours = getToursByCategory(category as TourCategory);
  } else if (town) {
    tours = getToursByTown(town);
  }

  if (query.trim()) {
    tours = searchTours(query);
  }

  tours.sort((a, b) => {
    const aF = (a.rating ?? 0) > 0 || !!a.bookedRecent ? 1 : 0;
    const bF = (b.rating ?? 0) > 0 || !!b.bookedRecent ? 1 : 0;
    if (bF !== aF) return bF - aF;
    return a.priceFrom - b.priceFrom;
  });

  return (
    <>
    <Seo metadata={metadata} />
    <ScrollView nativeID="main" style={styles.container} contentContainerStyle={styles.containerContent}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Guanacaste · Costa Rica</Text>
        <Text accessibilityRole="header" aria-level={1} style={styles.headerTitle}>
          {category ? CATEGORY_LABELS[category as TourCategory] : town ? `Tours in ${town}` : 'All Guanacaste tours'}
        </Text>
        <Text style={styles.headerSubtitle}>{tours.length} {tours.length === 1 ? 'tour' : 'tours'}</Text>
      </View>

      <View style={styles.searchBar}>
        <Icon name="search" size={18} color="#6B7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search tours, towns, activities..."
          value={query}
          onChangeText={(text) => router.push(`/tours?q=${encodeURIComponent(text)}`)}
        />
        {query.length > 0 && (
          <TouchableOpacity
            accessibilityRole="link"
            accessibilityLabel="Clear search"
            href="/tours"
            onPress={() => router.push('/tours')}
          >
            <Icon name="close-circle" size={20} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filters}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
        >
          <TouchableOpacity
            accessibilityRole="link"
            aria-current={!category ? true : undefined}
            href="/tours"
            style={[styles.chip, !category && styles.chipActive]}
            onPress={() => router.push('/tours')}
          >
            <Text style={[styles.chipText, !category && styles.chipTextActive]}>All</Text>
          </TouchableOpacity>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <TouchableOpacity
              key={key}
              accessibilityRole="link"
              aria-current={category === key ? true : undefined}
              href={`/tours?category=${key}`}
              style={[styles.chip, category === key && styles.chipActive]}
              onPress={() => router.push(`/tours?category=${key}`)}
            >
              <Text style={[styles.chipText, category === key && styles.chipTextActive]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.townFilters}>
        <Text style={styles.townLabel}>By town:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
        >
          {['Tamarindo', 'Playa Flamingo', 'Liberia', 'Playa Hermosa'].map((t) => (
            <TouchableOpacity
              key={t}
              accessibilityRole="link"
              aria-current={town === t ? true : undefined}
              href={`/tours?town=${encodeURIComponent(t)}`}
              style={[styles.chipSmall, town === t && styles.chipSmallActive]}
              onPress={() => router.push(`/tours?town=${encodeURIComponent(t)}`)}
            >
              <Text style={[styles.chipSmallText, town === t && styles.chipSmallTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.gridContainer}>
        <TourGrid tours={tours} onPress={(tour: Tour) => router.push(`/tours/${tour.slug}`)} />
      </View>

      <SiteFooter />
    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  containerContent: { flexGrow: 1, paddingBottom: 0 },
  container: { flex: 1, backgroundColor: color.ground },
  header: {
    paddingHorizontal: layout.gutter, paddingTop: space[8], paddingBottom: space[4],
    borderBottomWidth: 1, borderBottomColor: color.border, backgroundColor: color.surface,
  },
  eyebrow: { color: color.sky, fontFamily: font.body, fontSize: 12, fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: space[2] },
  headerTitle: { color: color.ink, fontFamily: font.display, fontSize: 34, fontWeight: '600', letterSpacing: -0.4, marginBottom: space[1] },
  headerSubtitle: { color: color.muted, fontFamily: font.body, fontSize: 14, fontWeight: '600' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: color.surface, marginHorizontal: layout.gutter, marginTop: space[4], marginBottom: space[2],
    paddingHorizontal: space[4], paddingVertical: 12, borderRadius: radius.md, borderWidth: 1, borderColor: color.border, gap: space[2],
  },
  searchInput: { flex: 1, color: color.ink, fontFamily: font.body, fontSize: 15, fontWeight: '500', padding: 0 },
  filters: { paddingHorizontal: layout.gutter, paddingBottom: space[1] },
  chipsContainer: { gap: space[2], paddingBottom: space[1] },
  chip: {
    paddingHorizontal: space[4], paddingVertical: 8, backgroundColor: color.surface, borderRadius: radius.pill, marginRight: space[2],
    borderWidth: 1, borderColor: color.border,
  },
  chipActive: { backgroundColor: color.primary, borderColor: color.primary },
  chipText: { color: color.body, fontFamily: font.body, fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: '#FFFFFF' },
  townFilters: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: layout.gutter, paddingVertical: space[2] },
  townLabel: { color: color.muted, fontFamily: font.body, fontSize: 12, fontWeight: '600', marginRight: space[2] },
  chipSmall: {
    paddingHorizontal: space[3], paddingVertical: 6, backgroundColor: color.surface, borderRadius: radius.pill, marginRight: space[2],
    borderWidth: 1, borderColor: color.border,
  },
  chipSmallActive: { backgroundColor: color.primary, borderColor: color.primary },
  chipSmallText: { color: color.body, fontFamily: font.body, fontSize: 12, fontWeight: '600' },
  chipSmallTextActive: { color: '#FFFFFF' },
  gridContainer: { flex: 1, paddingTop: space[3] },
});
