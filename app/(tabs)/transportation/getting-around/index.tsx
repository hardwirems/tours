import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Link } from 'expo-router';
import { SITE_URL } from '../../../../lib/constants';
import { Seo } from '../../../../components/Seo';
import { SiteFooter } from '../../../../components/SiteFooter';
import { Icon } from '../../../../components/Icon';
import { Breadcrumbs, TransferDisclosure } from '../../../../components/transportation/TransportUI';
import { RentalCard } from '../../../../components/transportation/RentalCard';
import { LOCAL_RENTALS } from '../../../../lib/transportation-data';
import { LOCAL_CATEGORIES } from '../../../../lib/transportation-content';
import { campaignId } from '../../../../lib/analytics';
import { color, font, space, radius, shadow, layout } from '../../../../lib/theme';

export const metadata = {
  title: 'Getting Around Guanacaste — Golf Carts, Scooters & Rentals',
  description:
    'Honest guidance on getting around Guanacaste: golf carts, e-bikes, scooters, ATVs and rental cars — what’s worth it and what’s actually bookable.',
  openGraph: { title: 'Getting Around Guanacaste Locally', description: 'Golf carts, scooters, rental cars and more — honest, verified guidance.', type: 'website', url: `${SITE_URL}/transportation/getting-around/`, siteName: 'Guanacaste Experiences' },
  alternates: { canonical: `${SITE_URL}/transportation/getting-around/` },
};
export const jsonLd = [
  { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'Transportation', item: `${SITE_URL}/transportation/` },
    { '@type': 'ListItem', position: 3, name: 'Getting around', item: `${SITE_URL}/transportation/getting-around/` },
  ] },
];

const cardShadow = Platform.select({ web: { boxShadow: shadow.card } as object, default: {} });

export default function GettingAround() {
  const campaign = campaignId({ section: 'local', category: 'getting_around' });
  return (
    <>
      <Seo metadata={metadata} jsonLd={jsonLd} />
      <ScrollView nativeID="main" style={styles.container} contentContainerStyle={styles.content}>
        <View style={[styles.page, { maxWidth: layout.maxWidth }]}>
          <View style={styles.header}>
            <Breadcrumbs trail={[{ name: 'Home', href: '/' }, { name: 'Transportation', href: '/transportation' }, { name: 'Getting around' }]} />
            <Text style={styles.eyebrow}>Once you’re here</Text>
            <Text accessibilityRole="header" aria-level={1} style={styles.h1}>Getting around Guanacaste</Text>
            <Text style={styles.lead}>
              In walkable beach towns you often don’t need a full rental car. Here’s an honest look at local options —
              including what we can book for you through Viator, and what you’re better off arranging locally. We’d
              rather tell you the truth than fill a page with listings we can’t stand behind.
            </Text>
          </View>

          {LOCAL_RENTALS.length > 0 ? (
            <View style={styles.block}>
              <Text accessibilityRole="header" aria-level={2} style={styles.h2}>Bookable now: golf-cart rental</Text>
              <Text style={styles.note}>A fun, low-speed way to get around flat towns like Tamarindo. This listing meets our quality bar (rating and verified reviews).</Text>
              <View style={styles.grid}>{LOCAL_RENTALS.map((r) => <RentalCard key={r.code} product={r} campaign={campaign} />)}</View>
              <TransferDisclosure />
            </View>
          ) : null}

          <View style={styles.block}>
            <Text accessibilityRole="header" aria-level={2} style={styles.h2}>Other ways to get around</Text>
            <Text style={styles.note}>What each option suits — and an honest note on booking. Where we can’t verify quality inventory, we say so.</Text>
            <View style={styles.grid}>
              {LOCAL_CATEGORIES.filter((c) => c.slug !== 'golf-cart-rentals').map((c) => (
                <Link key={c.slug} href={`/transportation/${c.slug}`} asChild>
                  <TouchableOpacity accessibilityRole="link" accessibilityLabel={c.name} style={StyleSheet.flatten([styles.catCard, cardShadow])} activeOpacity={0.92}>
                    <View style={styles.catHead}>
                      <Text style={styles.catTitle}>{c.name}</Text>
                      <Text style={StyleSheet.flatten([styles.badge, c.hasQualifyingInventory ? styles.badgeGood : styles.badgeMuted])}>
                        {c.hasQualifyingInventory ? 'Bookable' : 'Info only'}
                      </Text>
                    </View>
                    <Text style={styles.catDesc} numberOfLines={3}>{c.viatorStatus}</Text>
                    <Text style={styles.catLink}>Read more →</Text>
                  </TouchableOpacity>
                </Link>
              ))}
            </View>
          </View>

          <View style={styles.block}>
            <Text accessibilityRole="header" aria-level={2} style={styles.h2}>Prefer to plan the whole trip?</Text>
            <Text style={styles.p}>
              Our in-depth guide to <Link href="/blog/getting-around-guanacaste-transport" style={styles.inlineLink}>getting around Guanacaste</Link> compares
              airports, private transfers, shared shuttles and rental cars, and helps you decide whether you need a car at all.
              Arriving soon? Start with a <Link href="/transportation/airport-transfers/lir" style={styles.inlineLink}>Liberia Airport transfer</Link>.
            </Text>
            <View style={styles.futureNote}>
              <Icon name="information-circle" size={16} color={color.primary} />
              <Text style={styles.futureText}>Some categories (rental cars, e-bikes, most scooters) aren’t part of the Viator marketplace. We’re evaluating a dedicated, reputable rentals partner to fill those gaps — and we won’t add one without vetting it first.</Text>
            </View>
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
  page: { width: '100%', alignSelf: 'center', paddingHorizontal: layout.gutter },
  header: { paddingTop: space[6], paddingBottom: space[5], gap: space[3] },
  eyebrow: { color: color.sky, fontFamily: font.body, fontSize: 12, fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase' },
  h1: { color: color.ink, fontFamily: font.display, fontSize: 34, fontWeight: '600', letterSpacing: -0.4 },
  lead: { color: color.body, fontFamily: font.body, fontSize: 16, lineHeight: 25, maxWidth: 700 },
  block: { marginTop: space[8], gap: space[3] },
  h2: { color: color.ink, fontFamily: font.display, fontSize: 25, fontWeight: '600' },
  note: { color: color.muted, fontFamily: font.body, fontSize: 14.5, maxWidth: 680, lineHeight: 21 },
  p: { color: color.body, fontFamily: font.body, fontSize: 15.5, lineHeight: 24, maxWidth: 720 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space[4] },
  catCard: { flexGrow: 1, flexBasis: 280, maxWidth: 360, backgroundColor: color.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: color.border, padding: space[4], gap: space[2] },
  catHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space[2] },
  catTitle: { flex: 1, color: color.ink, fontFamily: font.body, fontSize: 16, fontWeight: '700' },
  badge: { fontFamily: font.body, fontSize: 10.5, fontWeight: '700', paddingHorizontal: space[2], paddingVertical: 3, borderRadius: radius.sm, overflow: 'hidden', textTransform: 'uppercase', letterSpacing: 0.5 },
  badgeGood: { backgroundColor: '#E8F5EF', color: color.success },
  badgeMuted: { backgroundColor: color.surfaceAlt, color: color.muted },
  catDesc: { color: color.body, fontFamily: font.body, fontSize: 13.5, lineHeight: 20 },
  catLink: { color: color.coral, fontFamily: font.body, fontSize: 13.5, fontWeight: '700' },
  inlineLink: { color: color.sky, fontWeight: '700' },
  futureNote: { flexDirection: 'row', gap: space[2], alignItems: 'flex-start', backgroundColor: color.skyLight, borderRadius: radius.md, padding: space[3], maxWidth: 720, marginTop: space[2] },
  futureText: { flex: 1, color: color.primaryDeep, fontFamily: font.body, fontSize: 13.5, lineHeight: 20 },
});
