import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TOURS, CATEGORY_LABELS, Tour } from '../../../lib/tours';
import { TourCard } from '../../../components/TourCard';

// ---------------------------------------------------------------------------
// (tabs)/compare/index.tsx — Compare tours side-by-side.
// ---------------------------------------------------------------------------

export const metadata = {
  title: 'Compare Tours in Guanacaste — Side by Side',
  description:
    'Compare Guanacaste tours side by side — duration, price, difficulty, what\'s included, and booking options. Pick any tours to compare before you book.',
  openGraph: {
    title: 'Compare Tours in Guanacaste',
    description: 'Compare Guanacaste tours side by side — duration, price, difficulty, what\'s included, and booking options.',
    type: 'website',
    url: 'https://guanacaste.tours/compare',
    siteName: 'Guanacaste Tours',
  },
};

export default function CompareScreen() {
  const router = useRouter();

  const tourA = TOURS.find((t: Tour) => t.slug === 'zip-lining-guanacaste')!;
  const tourB = TOURS.find((t: Tour) => t.slug === 'catamaran-sunset-tamarindo')!;

  const compareRows = [
    { label: 'Duration', a: tourA.duration, b: tourB.duration },
    { label: 'Price from', a: `$${tourA.priceFrom}`, b: `$${tourB.priceFrom}` },
    { label: 'Price note', a: tourA.priceNote, b: tourB.priceNote },
    { label: 'Difficulty', a: tourA.difficulty, b: tourB.difficulty },
    { label: 'Minimum age', a: String(tourA.minAge ?? '—'), b: String(tourB.minAge ?? '—') },
    { label: 'Languages', a: tourA.tags.slice(0, 3).join(', '), b: tourB.tags.slice(0, 3).join(', ') },
    { label: 'Pickup', a: 'Hotel pickup available', b: 'Hotel pickup available' },
    { label: 'Rating', a: String(tourA.rating ?? '—'), b: String(tourB.rating ?? '—') },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Compare tours</Text>
        <Text style={styles.headerSubtitle}>Pick any two to see them side by side</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TourCard tour={tourA} onPress={() => router.push(`/tours/${tourA.slug}`)} featured />

        <View style={styles.vsDivider}>
          <Ionicons name="swap-horizontal" size={22} color="#E8A849" />
          <Text style={styles.vsText}>VS</Text>
        </View>

        <TourCard tour={tourB} onPress={() => router.push(`/tours/${tourB.slug}`)} featured />

        <View style={styles.tableHeader}>
          <Text style={styles.tableTitle}>Side-by-side comparison</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRowHeader}>
            <Text style={[styles.tableWhiteCell, { flex: 1 }]}>{tourA.title}</Text>
            <Text style={[styles.tableWhiteCell, { flex: 1 }]}>{tourB.title}</Text>
          </View>

          {compareRows.map((row, i) => (
            <View key={row.label} style={[styles.tableRow, i % 2 === 0 && styles.tableRowAlt]}>
              <Text style={styles.tableLabel}>{row.label}</Text>
              <Text style={styles.tableCell}>{row.a}</Text>
              <Text style={styles.tableCell}>{row.b}</Text>
            </View>
          ))}
        </View>

        <View style={styles.ctaSection}>
          <Text style={styles.ctaText}>Ready to book? Compare more tours or go to the full listing.</Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => router.push(`/tours/${tourA.slug}`)}
          >
            <Text style={styles.ctaButtonText}>View {tourA.title} →</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ctaButtonSecondary}
            onPress={() => router.push('/tours')}
          >
            <Text style={styles.ctaButtonSecondaryText}>Browse all tours</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { padding: 18, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', backgroundColor: '#FFFFFF' },
  headerTitle: { color: '#0B4155', fontSize: 24, fontWeight: '800', marginBottom: 2 },
  headerSubtitle: { color: '#6B7280', fontSize: 13, fontWeight: '500' },
  scroll: { flex: 1 },
  content: { padding: 14, paddingBottom: 32 },
  vsDivider: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'center',
    backgroundColor: '#F9FAFB', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 999,
    marginVertical: 6, borderWidth: 1, borderColor: '#E5E7EB', gap: 4,
  },
  vsText: { color: '#8B6914', fontSize: 11, fontWeight: '800' },
  tableHeader: { marginTop: 14, marginBottom: 8 },
  tableTitle: { color: '#0B4155', fontSize: 16, fontWeight: '700' },
  table: { backgroundColor: '#F9FAFB', borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden' },
  tableRowHeader: { flexDirection: 'row', padding: 10, backgroundColor: '#0B4155' },
  tableRow: { flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  tableRowAlt: { backgroundColor: '#FDFBF8' },
  tableCell: { flex: 1, color: '#0B4155', fontSize: 12, fontWeight: '600', paddingVertical: 2 },
  tableWhiteCell: { flex: 1, color: '#FFFFFF', fontSize: 11, fontWeight: '700', paddingVertical: 2 },
  tableLabel: { width: 80, color: '#6B7280', fontSize: 11, fontWeight: '600', paddingVertical: 2 },
  ctaSection: { marginTop: 18, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  ctaText: { color: '#6B7280', fontSize: 13, lineHeight: 18, marginBottom: 12, textAlign: 'center' },
  ctaButton: { backgroundColor: '#0B4155', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginBottom: 8 },
  ctaButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  ctaButtonSecondary: { backgroundColor: '#F5F5F5', paddingVertical: 14, borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center' },
  ctaButtonSecondaryText: { color: '#0B4155', fontSize: 14, fontWeight: '600' },
});
