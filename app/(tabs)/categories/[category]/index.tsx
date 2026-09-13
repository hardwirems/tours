import { SITE_URL } from '../../../../lib/constants';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { CATEGORIES, getToursByCategory, Tour } from '../../../../lib/tours';
import { CATEGORY_CONTENT, HubContent } from '../../../../lib/seo-content';
import { TourGrid } from '../../../../components/TourCard';
import { Seo } from '../../../../components/Seo';
import { SiteFooter } from '../../../../components/SiteFooter';
import { color, font } from '../../../../lib/theme';

function buildMeta(content: HubContent, url: string) {
  return {
    title: content.title,
    description: content.description,
    openGraph: { title: content.h1, description: content.description, type: 'website', url, siteName: 'Guanacaste Tours' },
    twitter: { card: 'summary_large_image' as const, title: content.h1, description: content.description },
    alternates: { canonical: url },
    robots: { index: true, follow: true },
  };
}

function buildJsonLd(content: HubContent, url: string, tours: Tour[]) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Tours', item: `${SITE_URL}/tours/` },
        { '@type': 'ListItem', position: 3, name: content.h1, item: url },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: content.h1,
      numberOfItems: tours.length,
      itemListElement: tours.map((t, i) => ({
        '@type': 'ListItem', position: i + 1, url: `${SITE_URL}/tours/${t.slug}/`, name: t.title,
      })),
    },
  ];
}

export default function CategoryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category: string }>();
  const category = params.category;
  const content = CATEGORY_CONTENT[category];
  const label = CATEGORIES[category];
  const tours = category ? getToursByCategory(category) : [];

  if (!content || !label) {
    return (
      <>
        <Seo metadata={{ title: 'Category not found — Guanacaste Tours', robots: { index: false, follow: true } }} />
        <View style={styles.notFound}><Text style={styles.notFoundText}>Category not found</Text></View>
      </>
    );
  }

  const url = `${SITE_URL}/categories/${category}/`;
  return (
    <>
      <Seo metadata={buildMeta(content, url)} jsonLd={buildJsonLd(content, url, tours)} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Guanacaste, Costa Rica</Text>
          <Text role="heading" aria-level={1} style={styles.h1}>{content.h1}</Text>
          <Text style={styles.intro}>{content.intro}</Text>
          <Text style={styles.count}>{tours.length} {tours.length === 1 ? 'tour' : 'tours'}</Text>
        </View>

        <View style={styles.grid}>
          <TourGrid tours={tours} onPress={(t: Tour) => router.push(`/tours/${t.slug}`)} />
        </View>

        <View style={styles.linksBlock}>
          <Text role="heading" aria-level={2} style={styles.linksTitle}>Browse other categories</Text>
          <View style={styles.linkRow}>
            {Object.entries(CATEGORIES).filter(([k]) => k !== category).map(([k, l]) => (
              <Link key={k} href={`/categories/${k}`} style={styles.chipLink}>{l}</Link>
            ))}
          </View>
          <Link href="/tours" style={styles.allLink}>See all Guanacaste tours →</Link>
        </View>
        <SiteFooter />
      </ScrollView>
    </>
  );
}

export function generateStaticParams() {
  return Object.keys(CATEGORIES).map((category) => ({ category }));
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.ground },
  content: { flexGrow: 1, paddingBottom: 0 },
  header: { padding: 20, paddingTop: 32, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  eyebrow: { color: '#1D7FA8', fontFamily: font.body, fontSize: 12, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 6 },
  h1: { color: color.ink, fontFamily: font.display, fontSize: 32, fontWeight: '600', letterSpacing: -0.4, lineHeight: 38, marginBottom: 12 },
  intro: { color: '#374151', fontSize: 15, lineHeight: 23, maxWidth: 680 },
  count: { color: '#6B7280', fontSize: 13, fontWeight: '600', marginTop: 12 },
  grid: { flex: 1 },
  linksBlock: { padding: 20, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  linksTitle: { color: '#0B4155', fontSize: 16, fontWeight: '800', marginBottom: 12 },
  linkRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chipLink: { color: '#0B4155', backgroundColor: '#E6F4FE', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, fontSize: 13, fontWeight: '600', marginRight: 6, marginBottom: 6, textDecorationLine: 'none' },
  allLink: { color: '#1D7FA8', fontSize: 14, fontWeight: '700', marginTop: 14, textDecorationLine: 'none' },
  notFound: { flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', padding: 20 },
  notFoundText: { color: '#6B7280', fontSize: 16, fontWeight: '600' },
});
