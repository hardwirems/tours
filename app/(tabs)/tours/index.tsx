import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TOURS, CATEGORY_LABELS, searchTours, getToursByCategory, getToursByTown, Tour, TourCategory } from '../../../lib/tours';
import { TourGrid } from '../../../components/TourCard';

export const metadata = {
  title: 'All Tours in Guanacaste, Costa Rica — Browse & Book',
  description:
    'Browse every tour and excursion in Guanacaste, Costa Rica. Filter by category (zip-lining, catamaran, ATV, volcano, wildlife, culture) or town (Tamarindo, Flamingo, Liberia, Papagayo).',
  openGraph: {
    title: 'All Tours in Guanacaste, Costa Rica',
    description:
      'Browse every tour and excursion in Guanacaste. Filter by activity type or town — zip-lining, catamaran, ATV, whale watching, volcano hikes and more.',
    type: 'website',
    url: 'https://guanacaste.tours/tours',
    siteName: 'Guanacaste Tours',
  },
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {category ? CATEGORY_LABELS[category as TourCategory] : town ? town : 'All tours'}
        </Text>
        <Text style={styles.headerSubtitle}>{tours.length} tours found</Text>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#6B7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search tours, towns, activities..."
          value={query}
          onChangeText={(text) => router.push(`/tours?q=${encodeURIComponent(text)}`)}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => router.push('/tours')}>
            <Ionicons name="close-circle" size={20} color="#6B7280" />
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
            style={[styles.chip, !category && styles.chipActive]}
            onPress={() => router.push('/tours')}
          >
            <Text style={[styles.chipText, !category && styles.chipTextActive]}>All</Text>
          </TouchableOpacity>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <TouchableOpacity
              key={key}
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
          {['Tamarindo', 'Flamingo', 'Liberia', 'Papagayo', 'Potrero', 'Brasilito'].map((t) => (
            <TouchableOpacity
              key={t}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    padding: 18, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', backgroundColor: '#FFFFFF',
  },
  headerTitle: { color: '#0B4155', fontSize: 24, fontWeight: '800', marginBottom: 2 },
  headerSubtitle: { color: '#6B7280', fontSize: 13, fontWeight: '500' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', margin: 14, marginBottom: 6,
    paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB', gap: 8,
  },
  searchInput: { flex: 1, color: '#1A1A1A', fontSize: 14, fontWeight: '500', padding: 0 },
  filters: { paddingHorizontal: 14, paddingBottom: 4 },
  chipsContainer: { gap: 6, paddingBottom: 4 },
  chip: {
    paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#F5F5F5', borderRadius: 999, marginRight: 6,
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  chipActive: { backgroundColor: '#0B4155', borderColor: '#0B4155' },
  chipText: { color: '#6B7280', fontSize: 12, fontWeight: '600' },
  chipTextActive: { color: '#FFFFFF' },
  townFilters: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 6 },
  townLabel: { color: '#6B7280', fontSize: 12, fontWeight: '600', marginRight: 8 },
  chipSmall: {
    paddingHorizontal: 10, paddingVertical: 4, backgroundColor: '#F5F5F5', borderRadius: 999, marginRight: 6,
    borderWidth: 1, borderColor: '#E5E7EB',
  },
  chipSmallActive: { backgroundColor: '#0B4155', borderColor: '#0B4155' },
  chipSmallText: { color: '#6B7280', fontSize: 11, fontWeight: '600' },
  chipSmallTextActive: { color: '#FFFFFF' },
  gridContainer: { flex: 1 },
});
