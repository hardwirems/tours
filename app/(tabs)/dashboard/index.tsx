import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

// ---------------------------------------------------------------------------
// (tabs)/dashboard/index.tsx — Internal dashboard ("who booked through this site").
// ---------------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard — Guanacaste Tours',
  description: 'Internal dashboard: who books through this site, affiliate clicks, and commission estimates.',
};

export default function DashboardScreen() {
  const [pin, setPin] = useState('');
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) {
    return (
      <View style={styles.lockScreen}>
        <Text style={styles.lockTitle}>Internal Dashboard</Text>
        <Text style={styles.lockSubtitle}>
          Track who books through this site — affiliate clicks, traffic sources, commission estimates.
        </Text>
        <TextInput
          style={[styles.pinInput, { fontSize: 24 }]}
          placeholder="PIN"
          value={pin}
          onChangeText={setPin}
          secureTextEntry
          maxLength={4}
          keyboardType="number-pad"
          textAlign="center"
        />
        <View style={styles.pinHint}>
          <Text style={styles.pinHintText}>Enter the PIN to view the dashboard.</Text>
        </View>
        <TouchableOpacity
          style={styles.unlockButton}
          onPress={() => {
            if (pin === '1234') setUnlocked(true);
          }}
        >
          <Text style={styles.unlockButtonText}>Unlock</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const demoClicks = [
    { slug: 'getyourguide/zip-lining-guanacaste', clicks: 340, estCommission: 82 },
    { slug: 'getyourguide/catamaran-sunset-tamarindo', clicks: 210, estCommission: 114 },
    { slug: 'getyourguide/atv-tamarindo', clicks: 98, estCommission: 18 },
    { slug: 'getyourguide/rincon-de-la-vieja-volcano', clicks: 156, estCommission: 22 },
    { slug: 'viator/ziplining-guanacaste', clicks: 120, estCommission: 29 },
    { slug: 'getyourguide/sport-fishing-guanacaste', clicks: 67, estCommission: 111 },
    { slug: 'getyourguide/snorkeling-las-catalinas', clicks: 184, estCommission: 30 },
    { slug: 'getyourguide/horseback-riding-guanacaste', clicks: 103, estCommission: 18 },
  ];

  const totalClicks = demoClicks.reduce((s, r) => s + r.clicks, 0);
  const totalEstCommission = demoClicks.reduce((s, r) => s + r.estCommission, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity onPress={() => setUnlocked(false)}>
          <Text style={styles.lockText}>Lock</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{totalClicks}</Text>
            <Text style={styles.summaryLabel}>Total clicks</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={[styles.summaryValue, styles.summaryValueGreen]}>${totalEstCommission}</Text>
            <Text style={styles.summaryLabel}>Est. commission</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{demoClicks.length}</Text>
            <Text style={styles.summaryLabel}>Active links</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top earning affiliate links</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableCell}>Link</Text>
              <Text style={[styles.tableCellRight, { flex: 1 }]}>Clicks</Text>
              <Text style={[styles.tableCellRight, { flex: 1 }]}>Est. $</Text>
            </View>
            {demoClicks.sort((a, b) => b.estCommission - a.estCommission).map((row) => (
              <View key={row.slug} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2 }]} numberOfLines={1}>
                  {row.slug.split('/')[0]}
                </Text>
                <Text style={[styles.tableCellRight, { flex: 1 }]}>{row.clicks}</Text>
                <Text style={[styles.tableCellRight, { flex: 1, color: '#10B981', fontWeight: '700' }]}>
                  ${row.estCommission}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Traffic sources</Text>
          <View style={styles.sourcesList}>
            {[
              { source: 'Google Search', pct: 62, color: '#1D7FA8' },
              { source: 'Instagram', pct: 14, color: '#E8A849' },
              { source: 'Direct', pct: 10, color: '#10B981' },
              { source: 'Referral', pct: 8, color: '#6B7280' },
              { source: 'Other', pct: 6, color: '#C0392B' },
            ].map((item) => (
              <View key={item.source} style={styles.sourceRow}>
                <Text style={styles.sourceName}>{item.source}</Text>
                <View style={styles.bar}>
                  <View style={[styles.barFill, { width: item.pct }]} />
                </View>
                <Text style={styles.sourcePct}>{item.pct}%</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Setup notes</Text>
          <View style={styles.notes}>
            {[
              'Connect Supabase (clicks table) to replace demo data.',
              'Install Umami or Plausible for traffic analytics.',
              'Set up a real PIN/authentication — do not leave unlocked.',
              'Update commission rates in lib/constants.ts as you confirm actual rates.',
              'Daily: review "clicked but no booking" — improve page content or CTA.',
            ].map((item) => (
              <View key={item} style={styles.noteItem}>
                <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                <Text style={styles.noteText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.hint}>
          <Text style={styles.hintText}>
            This tab is hidden from the bottom nav. Access via deep link or add it to the tab bar in (tabs)/_layout.tsx.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  lockScreen: {
    flex: 1,
    backgroundColor: '#0B4155',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  lockTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', marginBottom: 8 },
  lockSubtitle: { color: '#FDF3E0', fontSize: 13, lineHeight: 19, textAlign: 'center', marginBottom: 24 },
  pinInput: {
    width: 120,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8A849',
  },
  pinHint: { marginTop: 12, marginBottom: 16 },
  pinHintText: { color: '#FDF3E0', fontSize: 12, lineHeight: 16 },
  unlockButton: {
    backgroundColor: '#E8A849',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  unlockButtonText: { color: '#0B4155', fontSize: 15, fontWeight: '700' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: { color: '#0B4155', fontSize: 18, fontWeight: '800' },
  lockText: { color: '#6B7280', fontSize: 13, fontWeight: '600' },
  scroll: { flex: 1 },
  content: { padding: 14, paddingBottom: 32 },
  summaryRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  summaryCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryValue: { color: '#0B4155', fontSize: 22, fontWeight: '800', marginBottom: 2 },
  summaryValueGreen: { color: '#10B981' },
  summaryLabel: { color: '#6B7280', fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  section: { marginBottom: 14 },
  sectionTitle: { color: '#0B4155', fontSize: 15, fontWeight: '700', marginBottom: 8 },
  table: { backgroundColor: '#F9FAFB', borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#0B4155', padding: 8, gap: 6 },
  tableRow: { flexDirection: 'row', padding: 8, gap: 6, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  tableCell: { flex: 1, color: '#0B4155', fontSize: 12, fontWeight: '600', paddingVertical: 2 },
  tableCellRight: { color: '#6B7280', fontSize: 12, fontWeight: '600', textAlign: 'right' },
  sourcesList: { gap: 8 },
  sourceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sourceName: { width: 100, color: '#1A1A1A', fontSize: 12, fontWeight: '500' },
  bar: { flex: 1, height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  sourcePct: { width: 40, color: '#6B7280', fontSize: 12, fontWeight: '600', textAlign: 'right' },
  notes: { gap: 6 },
  noteItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  noteText: { flex: 1, color: '#6B7280', fontSize: 12, lineHeight: 17 },
  hint: { marginTop: 16, padding: 12, backgroundColor: '#F9FAFB', borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  hintText: { color: '#6B7280', fontSize: 12, lineHeight: 17 },
});
