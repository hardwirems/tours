import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Image } from 'react-native';
import { Icon } from './Icon';
import { Link } from 'expo-router';
import { Tour, CATEGORY_LABELS, AFFILIATE_LABELS, AFFILIATE_PROGRAMS, AffiliateProgram } from '../lib/tours';
import { AffiliateDisclosure } from './AffiliateDisclosure';
import { SiteFooter } from './SiteFooter';
import { color, font, space, radius, shadow, layout } from '../lib/theme';

const webCardShadow = Platform.select({ web: { boxShadow: shadow.card } as object, default: {} });
const cap = (s?: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

// ---------------------------------------------------------------------------
// TourCard — listing card (home, /tours, /categories, /destinations).
// ---------------------------------------------------------------------------

interface TourCardProps { tour: Tour; onPress: () => void; featured?: boolean }

export function TourCard({ tour, onPress, featured = false }: TourCardProps) {
  const location = tour.towns?.[0] ?? 'Guanacaste';
  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={onPress}
      accessibilityRole="link"
      accessibilityLabel={`${tour.title} in ${location}, from $${tour.priceFrom}`}
      href={`/tours/${tour.slug}`}
      style={[styles.card, webCardShadow, featured && styles.cardFeatured]}
    >
      <View style={styles.imageWrapper}>
        <Image source={{ uri: tour.images[0]?.src }} style={styles.image} resizeMode="cover" />
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{CATEGORY_LABELS[tour.category]}</Text>
        </View>
        {tour.rating != null && (
          <View style={styles.ratingBadge} accessibilityLabel={`Rated ${tour.rating} on Viator`}>
            <Icon name="star" size={12} color={color.sun} />
            <Text style={styles.ratingText}>{tour.rating}</Text>
          </View>
        )}
      </View>

      <View style={styles.body}>
        <Text style={styles.location} numberOfLines={1}>
          <Icon name="location-outline" size={12} color={color.sky} /> {location}
        </Text>
        <Text style={styles.title} numberOfLines={2}>{tour.title}</Text>
        <View style={styles.metaRow}>
          <Icon name="time-outline" size={14} color={color.muted} />
          <Text style={styles.metaText}>{tour.duration}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceFrom}>from </Text>
          <Text style={styles.priceValue}>${tour.priceFrom}</Text>
          <Text style={styles.viewLink}>View tour →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// TourGrid — responsive grid for listing / category / destination pages.
// ---------------------------------------------------------------------------

interface TourGridProps { tours: Tour[]; onPress: (tour: Tour) => void; emptyMessage?: string }

export function TourGrid({ tours, onPress, emptyMessage = 'No tours found in this category.' }: TourGridProps) {
  if (tours.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="search-outline" size={44} color={color.muted} />
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }
  return (
    <View style={styles.grid}>
      {tours.map((tour) => (
        <TourCard key={tour.slug} tour={tour} onPress={() => onPress(tour)} />
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// TourDetail — full experience page (hero, content + booking sidebar).
// ---------------------------------------------------------------------------

interface TourDetailProps {
  tour: Tour; onBook: () => void; onBack: () => void; onOpenBookingLink: () => void;
}

function Fact({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={styles.dFactRow}>
      <View style={styles.dFactIcon}><Icon name={icon} size={16} color={color.primary} /></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.dFactLabel}>{label}</Text>
        <Text style={styles.dFactValue}>{value}</Text>
      </View>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.dSection}>
      <Text accessibilityRole="header" aria-level={2} style={styles.dSectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

export function TourDetail({ tour, onBook }: TourDetailProps) {
  // Layout is CSS-driven (see globals.css [data-td]): the booking card lives in a
  // single, stable DOM position (the aside) and CSS flex `order` places it at the
  // top on mobile and as a sticky right column at >=980px. Rendering identical DOM
  // on server and client avoids a hydration mismatch (React #418) and layout shift.
  const location = tour.towns?.[0] ?? 'Guanacaste';
  const included = tour.includes ?? tour.whatIncluded ?? [];
  const partner =
    (tour.primaryAffiliate && AFFILIATE_PROGRAMS[tour.primaryAffiliate]?.name) || 'our booking partner';
  const bookHref = `/go/${tour.primaryAffiliate ?? 'getyourguide'}/${tour.slug}`;
  const goBook = () => {
    if (typeof window !== 'undefined' && window.location) {
      window.location.href = bookHref;
    } else { onBook(); }
  };

  const bookingCard = (
    <View style={[styles.dBookCard, webCardShadow]}>
      <View style={styles.dPriceRow}>
        <Text style={styles.dPriceFrom}>from </Text>
        <Text style={styles.dPriceValue}>${tour.priceFrom}</Text>
        <Text style={styles.dPriceUnit}> {tour.priceNote || 'per person'}</Text>
      </View>
      <TouchableOpacity
        accessibilityRole="link"
        accessibilityLabel={`Check availability and book on ${partner}`}
        href={bookHref}
        hrefAttrs={{ rel: 'sponsored noopener' }}
        style={styles.dBookBtn}
        onPress={goBook}
        activeOpacity={0.9}
      >
        <Text style={styles.dBookBtnText}>Check availability & book</Text>
      </TouchableOpacity>
      <Text style={styles.dBookNote}>You'll finish booking securely on {partner}.</Text>
      <View style={styles.dFacts}>
        <Fact icon="time-outline" label="Duration" value={tour.duration} />
        <Fact icon="fitness-outline" label="Difficulty" value={cap(tour.difficulty)} />
        {tour.minAge != null ? <Fact icon="person-outline" label="Minimum age" value={`${tour.minAge}+`} /> : null}
        <Fact icon="language-outline" label="Languages" value={tour.languages?.join(' · ') ?? 'English'} />
        <Fact icon="car-outline" label="Pickup" value={tour.pickup === 'hotel' ? 'Hotel pickup' : tour.pickup === 'meeting-point' ? 'Meeting point' : 'Hotel or meeting point'} />
      </View>
      <AffiliateDisclosure program={tour.primaryAffiliate as AffiliateProgram | undefined} mini />
    </View>
  );

  return (
    <ScrollView style={styles.dScroll} contentContainerStyle={styles.dScrollContent} nativeID="main">
      {/* Hero */}
      <View style={styles.dHero}>
        <Image source={{ uri: tour.images[0]?.src }} style={styles.dHeroImg} resizeMode="cover" />
        <View style={styles.dHeroScrim} />
        <View style={[styles.dHeroInner, { maxWidth: layout.maxWidth }]}>
          <Text style={styles.dCategory}>{CATEGORY_LABELS[tour.category]}</Text>
          <Text accessibilityRole="header" aria-level={1} style={styles.dTitle}>{tour.title}</Text>
          <View style={styles.dHeroMeta}>
            <Text style={styles.dHeroMetaItem}><Icon name="location-outline" size={14} color="#fff" /> {location}</Text>
            {tour.rating != null ? (
              <Text style={styles.dHeroMetaItem}>
                <Icon name="star" size={14} color={color.sun} /> {tour.rating}
                {tour.reviewCount != null ? ` (${tour.reviewCount} reviews on Viator)` : ' on Viator'}
              </Text>
            ) : null}
            <Text style={styles.dHeroMetaItem}><Icon name="time-outline" size={14} color="#fff" /> {tour.duration}</Text>
          </View>
        </View>
      </View>

      {/* Breadcrumb */}
      <View style={[styles.dCrumbWrap, { maxWidth: layout.maxWidth }]}>
        <Link href="/" asChild><TouchableOpacity accessibilityRole="link"><Text style={styles.dCrumbLink}>Home</Text></TouchableOpacity></Link>
        <Text style={styles.dCrumbSep}>/</Text>
        <Link href="/tours" asChild><TouchableOpacity accessibilityRole="link"><Text style={styles.dCrumbLink}>Tours</Text></TouchableOpacity></Link>
        <Text style={styles.dCrumbSep}>/</Text>
        <Text style={styles.dCrumbCurrent} numberOfLines={1}>{tour.title}</Text>
      </View>

      {/* Body */}
      <View style={[styles.dBody, { maxWidth: layout.maxWidth }]} dataSet={{ td: 'body' }}>
        <View style={styles.dMain} dataSet={{ td: 'main' }}>
          <Section title="About this tour">
            <Text style={styles.dParagraph}>{tour.description}</Text>
          </Section>

          {included.length > 0 ? (
            <Section title="What's included">
              <View style={styles.dCheckList}>
                {included.map((item) => (
                  <View key={item} style={styles.dCheckItem}>
                    <Icon name="checkmark-circle" size={16} color={color.success} />
                    <Text style={styles.dCheckText}>{item}</Text>
                  </View>
                ))}
              </View>
            </Section>
          ) : null}

          {tour.whatToBring?.length ? (
            <Section title="What to bring">
              <View style={styles.dCheckList}>
                {tour.whatToBring.map((item) => (
                  <View key={item} style={styles.dCheckItem}>
                    <Icon name="ellipse" size={7} color={color.sky} style={{ marginTop: 7 }} />
                    <Text style={styles.dCheckText}>{item}</Text>
                  </View>
                ))}
              </View>
            </Section>
          ) : null}

          {tour.itinerary?.length ? (
            <Section title="Itinerary">
              {tour.itinerary.map((step, i) => (
                <View key={step} style={styles.dStep}>
                  <View style={styles.dStepNum}><Text style={styles.dStepNumText}>{i + 1}</Text></View>
                  <Text style={styles.dStepText}>{step}</Text>
                </View>
              ))}
            </Section>
          ) : null}

          {tour.seasonalNote ? (
            <View style={styles.dNote}>
              <Icon name="partly-sunny-outline" size={18} color={color.sky} />
              <Text style={styles.dNoteText}>{tour.seasonalNote}</Text>
            </View>
          ) : null}

          {tour.tips?.length ? (
            <Section title="Good to know">
              {tour.tips.map((tip) => (
                <View key={tip} style={styles.dCheckItem}>
                  <Icon name="bulb-outline" size={15} color={color.sun} />
                  <Text style={styles.dCheckText}>{tip}</Text>
                </View>
              ))}
            </Section>
          ) : null}

          {tour.faq.length > 0 ? (
            <Section title="Frequently asked questions">
              {tour.faq.map((item) => (
                <View key={item.question} style={styles.dFaq}>
                  <Text style={styles.dFaqQ}>{item.question}</Text>
                  <Text style={styles.dFaqA}>{item.answer}</Text>
                </View>
              ))}
            </Section>
          ) : null}
        </View>

        <View style={styles.dSidebar} dataSet={{ td: 'aside' }}>{bookingCard}</View>
      </View>

      <SiteFooter />
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  // Listing card
  card: {
    flexGrow: 1, flexBasis: 300, maxWidth: 460,
    backgroundColor: color.surface, borderRadius: radius.lg, overflow: 'hidden',
    borderWidth: 1, borderColor: color.border,
  },
  cardFeatured: { borderColor: color.sun, borderWidth: 2 },
  imageWrapper: { height: 190, backgroundColor: color.border, position: 'relative' },
  image: { width: '100%', height: '100%' },
  categoryBadge: {
    position: 'absolute', top: 10, left: 10,
    backgroundColor: 'rgba(8,47,59,0.82)', paddingHorizontal: 9, paddingVertical: 4, borderRadius: radius.pill,
  },
  categoryBadgeText: { color: '#fff', fontFamily: font.body, fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  ratingBadge: {
    position: 'absolute', top: 10, right: 10, flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill, gap: 3,
  },
  ratingText: { color: color.ink, fontFamily: font.body, fontSize: 12, fontWeight: '700' },
  body: { padding: space[4] },
  location: { color: color.sky, fontFamily: font.body, fontSize: 12.5, fontWeight: '600', marginBottom: space[2] },
  title: { color: color.ink, fontFamily: font.body, fontSize: 16, fontWeight: '700', lineHeight: 22, marginBottom: space[3], minHeight: 44 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: space[3] },
  metaText: { color: color.muted, fontFamily: font.body, fontSize: 13, fontWeight: '500' },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', borderTopWidth: 1, borderTopColor: color.border, paddingTop: space[3] },
  priceFrom: { color: color.muted, fontFamily: font.body, fontSize: 13 },
  priceValue: { color: color.primary, fontFamily: font.body, fontSize: 18, fontWeight: '700' },
  viewLink: { color: color.coral, fontFamily: font.body, fontSize: 13, fontWeight: '700', marginLeft: 'auto' },
  emptyContainer: { alignItems: 'center', paddingVertical: space[10], paddingHorizontal: space[5] },
  emptyText: { color: color.muted, fontFamily: font.body, fontSize: 15, marginTop: space[3] },
  grid: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'stretch', gap: space[4], paddingHorizontal: space[5], paddingVertical: space[2] },

  // Detail
  dScroll: { flex: 1, backgroundColor: color.ground },
  dScrollContent: { flexGrow: 1 },
  // Contained, photo-friendly aspect so the tour photo shows nearly in full (a
  // full-bleed ultra-wide band cropped the subject); title/rating stay overlaid.
  dHero: { width: '100%', maxWidth: 1100, alignSelf: 'center', aspectRatio: 1.9, minHeight: 300, marginTop: space[5], borderRadius: radius.lg, backgroundColor: color.primary, justifyContent: 'flex-end', overflow: 'hidden' },
  dHeroImg: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  dHeroScrim: {
    ...StyleSheet.absoluteFillObject,
    ...Platform.select({ web: { backgroundImage: 'linear-gradient(180deg, rgba(8,47,59,0.1) 30%, rgba(8,47,59,0.82) 100%)' } as object, default: { backgroundColor: 'rgba(8,47,59,0.5)' } }),
  },
  dHeroInner: { width: '100%', alignSelf: 'center', paddingHorizontal: layout.gutter, paddingBottom: space[6] },
  dCategory: { color: color.sunLight, fontFamily: font.body, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: space[2] },
  dTitle: { color: '#fff', fontFamily: font.display, fontSize: 34, fontWeight: '600', lineHeight: 40, letterSpacing: -0.4, maxWidth: 780, marginBottom: space[3] },
  dHeroMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: space[5] },
  dHeroMetaItem: { color: '#fff', fontFamily: font.body, fontSize: 14, fontWeight: '600' },

  dCrumbWrap: { width: '100%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: space[2], paddingHorizontal: layout.gutter, paddingVertical: space[4] },
  dCrumbLink: { color: color.sky, fontFamily: font.body, fontSize: 13, fontWeight: '600' },
  dCrumbSep: { color: color.faint, fontFamily: font.body, fontSize: 13 },
  dCrumbCurrent: { color: color.muted, fontFamily: font.body, fontSize: 13, flexShrink: 1 },

  // Mobile-first base; the row layout + sticky sidebar are applied by CSS at >=980px.
  dBody: { width: '100%', alignSelf: 'center', paddingHorizontal: layout.gutter },
  dMain: { width: '100%' },
  dSidebar: { width: '100%' },

  dBookCard: { backgroundColor: color.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: color.border, padding: space[5], marginBottom: space[6] },
  dPriceRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: space[4] },
  dPriceFrom: { color: color.muted, fontFamily: font.body, fontSize: 14 },
  dPriceValue: { color: color.primary, fontFamily: font.display, fontSize: 32, fontWeight: '600' },
  dPriceUnit: { color: color.muted, fontFamily: font.body, fontSize: 13 },
  dBookBtn: { backgroundColor: color.coral, borderRadius: radius.pill, paddingVertical: 15, alignItems: 'center' },
  dBookBtnText: { color: '#fff', fontFamily: font.body, fontSize: 16, fontWeight: '700' },
  dBookNote: { color: color.muted, fontFamily: font.body, fontSize: 12.5, textAlign: 'center', marginTop: space[3] },
  dFacts: { marginTop: space[5], gap: space[3], borderTopWidth: 1, borderTopColor: color.border, paddingTop: space[4] },
  dFactRow: { flexDirection: 'row', alignItems: 'center' },
  dFactIcon: { width: 34, height: 34, borderRadius: radius.md, backgroundColor: color.skyLight, alignItems: 'center', justifyContent: 'center', marginRight: space[3] },
  dFactLabel: { color: color.muted, fontFamily: font.body, fontSize: 11.5, fontWeight: '600' },
  dFactValue: { color: color.ink, fontFamily: font.body, fontSize: 14.5, fontWeight: '600' },

  dSection: { marginBottom: space[8] },
  dSectionTitle: { color: color.ink, fontFamily: font.display, fontSize: 22, fontWeight: '600', letterSpacing: -0.2, marginBottom: space[4] },
  dParagraph: { color: color.body, fontFamily: font.body, fontSize: 16, lineHeight: 26 },
  dCheckList: { gap: space[3] },
  dCheckItem: { flexDirection: 'row', alignItems: 'flex-start', gap: space[3] },
  dCheckText: { flex: 1, color: color.body, fontFamily: font.body, fontSize: 15, lineHeight: 23 },
  dStep: { flexDirection: 'row', gap: space[3], marginBottom: space[4] },
  dStepNum: { width: 26, height: 26, borderRadius: 13, backgroundColor: color.primary, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  dStepNumText: { color: '#fff', fontFamily: font.body, fontSize: 13, fontWeight: '700' },
  dStepText: { flex: 1, color: color.body, fontFamily: font.body, fontSize: 15, lineHeight: 23 },
  dNote: { flexDirection: 'row', gap: space[3], backgroundColor: color.skyLight, borderRadius: radius.md, padding: space[4], marginBottom: space[8] },
  dNoteText: { flex: 1, color: color.primary, fontFamily: font.body, fontSize: 14.5, lineHeight: 22 },
  dFaq: { marginBottom: space[4], paddingBottom: space[4], borderBottomWidth: 1, borderBottomColor: color.border },
  dFaqQ: { color: color.ink, fontFamily: font.body, fontSize: 16, fontWeight: '700', marginBottom: space[2] },
  dFaqA: { color: color.body, fontFamily: font.body, fontSize: 15, lineHeight: 23 },
});
