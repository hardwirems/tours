import { SITE_URL } from '../../../lib/constants';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Icon } from '../../../components/Icon';
import { Seo } from '../../../components/Seo';
import { SiteFooter } from '../../../components/SiteFooter';

// ---------------------------------------------------------------------------
// (tabs)/about/index.tsx — About page.
// E-E-A-T: who runs this, why, how we research, affiliate disclosure,
// contact info, physical address (strongly recommended for trust/SEO).
// ---------------------------------------------------------------------------

export const metadata = {
  title: 'About Guanacaste Tours — Our Story, How We Research & Our Promise',
  description:
    'Who runs Guanacaste Tours, how we research every tour, our affiliate disclosure, and how to contact us. Built for travelers who want honest, well-researched recommendations.',
  openGraph: {
    title: 'About Guanacaste Tours',
    description:
      'Who runs Guanacaste Tours, how we research every tour, our affiliate disclosure, and how to contact us.',
    type: 'website',
    url: `${SITE_URL}/about/`,
    siteName: 'Guanacaste Tours',
  },
  alternates: { canonical: `${SITE_URL}/about/` },
};

export const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Guanacaste Tours',
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
  description:
    'A specialist guide to tours, excursions, and adventures in Guanacaste, Costa Rica, with researched recommendations and direct booking links to trusted operators.',
};

export default function AboutScreen() {
  return (
    <>
    <Seo metadata={metadata} jsonLd={jsonLd} />
    <ScrollView style={styles.container} contentContainerStyle={styles.containerContent}>
      {/* Header image */}
      <View style={styles.hero}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1589985261513-84652?w=1200&q=80' }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.heroOverlay}>
          <Text style={styles.heroEyebrow}>About us</Text>
          <Text style={styles.heroTitle}>Honest guides to Guanacaste's best tours</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Our story */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our story</Text>
          <Text style={styles.body}>
            Guanacaste Tours exists for one reason: travelers deserve honest, well-researched
            recommendations for the tours and excursions they'll actually book. Too many travel
            sites are thin affiliate stubs — a short paragraph, a price pulled from a listing
            page, a booking button. That's not useful, and it doesn't earn your trust.
          </Text>
          <Text style={styles.body}>
            We build real guides: what the tour is, what you'll actually see and do, when to
            go, what to bring, how much it costs, and which operator to book with. Every page
            is written with the traveler in mind — not the commission.
          </Text>
        </View>

        {/* How we research */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How we research tours</Text>
          <Text style={styles.body}>
            Every tour on this site is researched using a consistent process:
          </Text>
          <View style={styles.list}>
            {[
              'We read operator websites, recent reviews (last 6–12 months), and traveler reports.',
              'We check prices directly from operator listings and note when they change.',
              'We verify what\'s included vs. what costs extra — no surprises.',
              'We note seasonal differences (dry vs. green season, whale season, turtle nesting, etc.).',
              'We flag safety, weight limits, age minimums, and difficulty honestly.',
              'We only recommend tours we believe are worth your time and money.',
            ].map((item) => (
              <View key={item} style={styles.listItem}>
                <Icon name="checkmark-circle" size={16} color="#10B981" />
                <Text style={styles.listItemText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Affiliate disclosure — full version */}
        <View style={styles.disclosureSection}>
          <Text style={styles.disclosureTitle}>Affiliate disclosure</Text>
          <Text style={styles.disclosureBody}>
            We are an affiliate of several tour booking platforms including GetYourGuide, Viator,
            Booking.com, and others. When you book a tour through a link on this site, we may earn
            a commission at no additional cost to you.
          </Text>
          <Text style={styles.disclosureBody}>
            This commission helps us keep the guides free, updated, and ad-free. We only recommend
            tours we've researched and believe are worth your time. The commission does not affect
            the price you pay or the experience you get. Prices and availability are set by the
            operator and may change — always check the listing before booking.
          </Text>
          <Text style={styles.disclosureBody}>
            We disclose affiliate relationships in two places: a short note on every tour card,
            and a full disclosure on each tour's detail page, directly above the booking button.
            This is consistent with FTC guidelines and Google's expectations for affiliate sites.
          </Text>
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <Text style={styles.body}>
            Have a question, a suggestion, or a tour you think should be on this list?
            Reach out — we read every message.
          </Text>
          <View style={styles.contactRow}>
            <Icon name="mail-outline" size={16} color="#0B4155" />
            <Text style={styles.contactText}>rosenbeck17@gmail.com</Text>
          </View>
          <View style={styles.contactRow}>
            <Icon name="location-outline" size={16} color="#0B4155" />
            <Text style={styles.contactText}>Guanacaste, Costa Rica</Text>
          </View>
          <View style={styles.contactRow}>
            <Icon name="calendar-outline" size={16} color="#0B4155" />
            <Text style={styles.contactText}>Published: August 2026 · Updated monthly</Text>
          </View>
        </View>

        {/* Editorial standards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Editorial standards</Text>
          <Text style={styles.body}>
            We are committed to honest, helpful, and transparent content. We do not accept
            payment from operators to appear on this site. If an operator offers us a free tour
            or discount for review, we say so on that tour's page and it does not affect our
            recommendation. Our only income is affiliate commission — no sponsorships, no
            advertorials, no paid placements.
          </Text>
        </View>
      </ScrollView>
      <SiteFooter />
    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  hero: {
    height: 200,
    backgroundColor: '#0B4155',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 18,
    backgroundColor: 'rgba(11, 65, 85, 0.7)',
  },
  heroEyebrow: {
    color: '#FDF3E0',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 18,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#0B4155',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 10,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  body: {
    color: '#1A1A1A',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 10,
  },
  list: {
    gap: 6,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  listItemText: {
    flex: 1,
    color: '#1A1A1A',
    fontSize: 13,
    lineHeight: 19,
  },
  disclosureSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  disclosureTitle: {
    color: '#0B4155',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  disclosureBody: {
    color: '#6B7280',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    paddingVertical: 4,
  },
  contactText: {
    color: '#0B4155',
    fontSize: 14,
    fontWeight: '600',
  },
});
