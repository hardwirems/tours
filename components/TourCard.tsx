import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tour, CATEGORY_LABELS, AFFILIATE_LABELS, AffiliateProgram } from '../lib/tours';
import { AffiliateDisclosure } from './AffiliateDisclosure';
import { color, font, space, radius, shadow } from '../lib/theme';

const webCardShadow = Platform.select({ web: { boxShadow: shadow.card } as object, default: {} });

// ---------------------------------------------------------------------------
// TourCard — the building block for tour listings.
// Image, name, category, price from, duration, difficulty, affiliate CTA.
// Clickable → pushes to tour detail.
// ---------------------------------------------------------------------------

interface TourCardProps {
  tour: Tour
  onPress: () => void
  featured?: boolean
}

export function TourCard({ tour, onPress, featured = false }: TourCardProps) {
  const location = tour.towns?.[0] ?? 'Guanacaste';
  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={onPress}
      accessibilityRole="link"
      accessibilityLabel={`${tour.title} in ${location}, from $${tour.priceFrom}`}
      style={[styles.card, webCardShadow, featured && styles.cardFeatured]}
    >
      <View style={styles.imageWrapper}>
        <Image source={{ uri: tour.images[0]?.src }} style={styles.image} resizeMode="cover" />
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{CATEGORY_LABELS[tour.category]}</Text>
        </View>
        {tour.rating != null && (
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color={color.sun} />
            <Text style={styles.ratingText}>{tour.rating}</Text>
          </View>
        )}
      </View>

      <View style={styles.body}>
        <Text style={styles.location} numberOfLines={1}>
          <Ionicons name="location-outline" size={12} color={color.sky} /> {location}
        </Text>
        <Text style={styles.title} numberOfLines={2}>{tour.title}</Text>

        <View style={styles.metaRow}>
          <Ionicons name="time-outline" size={14} color={color.muted} />
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
// TourGrid — responsive grid of tour cards for category / search pages.
// ---------------------------------------------------------------------------

interface TourGridProps {
  tours: Tour[]
  onPress: (tour: Tour) => void
  emptyMessage?: string
}

export function TourGrid({ tours, onPress, emptyMessage = 'No tours found in this category.' }: TourGridProps) {
  if (tours.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="search-outline" size={44} color="#6B7280" />
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    )
  }

  return (
    <View style={styles.grid}>
      {tours.map((tour) => (
        <TourCard key={tour.slug} tour={tour} onPress={() => onPress(tour)} />
      ))}
    </View>
  )
}

// ---------------------------------------------------------------------------
// TourDetail — full tour content page (used inside tour/[slug]/page.tsx).
// Hero, facts, description, itinerary, FAQ, booking, disclosure.
// ---------------------------------------------------------------------------

interface TourDetailProps {
  tour: Tour
  onBook: () => void
  onBack: () => void
  onOpenBookingLink: () => void
}

export function TourDetail({ tour, onBook, onBack, onOpenBookingLink }: TourDetailProps) {
  return (
    <View style={styles.detailContainer}>
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="chevron-back" size={22} color="#0B4155" />
        <Text style={styles.backText}>All tours</Text>
      </TouchableOpacity>

      {/* Hero image */}
      <View style={styles.detailHero}>
        <Image
          source={{ uri: tour.images[0]?.src }}
          style={styles.detailHeroImage}
          resizeMode="cover"
        />
        <View style={styles.detailHeroOverlay}>
          <Text style={styles.detailCategory}>{CATEGORY_LABELS[tour.category]}</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.detailScroll}
        contentContainerStyle={styles.detailContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title + rating */}
        <View style={styles.detailHeader}>
          <Text style={styles.detailTitle}>{tour.title}</Text>
          {tour.rating != null && (
            <View style={styles.detailRating}>
              <Ionicons name="star" size={16} color="#E8A849" />
              <Text style={styles.detailRatingText}>{tour.rating}</Text>
              {tour.reviewCount != null && (
                <Text style={styles.detailReviews}> ({tour.reviewCount} reviews)</Text>
              )}
            </View>
          )}
        </View>

        {/* Price CTA */}
        <View style={styles.detailPriceCta}>
          <Text style={styles.detailPriceLabel}>From</Text>
          <Text style={styles.detailPriceValue}>${tour.priceFrom}</Text>
          <Text style={styles.detailPriceNote}>{tour.priceNote}</Text>
          <TouchableOpacity
            style={styles.detailBookButton}
            onPress={() => {
              if (typeof window !== 'undefined' && window.location) {
                window.location.href = `/go/${tour.primaryAffiliate ?? 'getyourguide'}/${tour.slug}`;
              } else {
                onOpenBookingLink()
              }
            }}
          >
            <Text style={styles.detailBookButtonText}>Check availability & book →</Text>
          </TouchableOpacity>
        </View>

        {/* Quick facts */}
        <View style={styles.detailFacts}>
          <View style={styles.factRow}>
            <View style={styles.factIcon}>
              <Ionicons name="time-outline" size={16} color="#0B4155" />
            </View>
            <View style={styles.factInfo}>
              <Text style={styles.factLabel}>Duration</Text>
              <Text style={styles.factValue}>{tour.duration}</Text>
            </View>
          </View>
          <View style={styles.factRow}>
            <View style={styles.factIcon}>
              <Ionicons name="fitness-outline" size={16} color="#0B4155" />
            </View>
            <View style={styles.factInfo}>
              <Text style={styles.factLabel}>Difficulty</Text>
              <Text style={styles.factValue}>
                {tour.difficulty.charAt(0).toUpperCase() + tour.difficulty.slice(1)}
              </Text>
            </View>
          </View>
          {tour.minAge != null && (
            <View style={styles.factRow}>
              <View style={styles.factIcon}>
                <Ionicons name="person-outline" size={16} color="#0B4155" />
              </View>
              <View style={styles.factInfo}>
                <Text style={styles.factLabel}>Minimum age</Text>
                <Text style={styles.factValue}>{tour.minAge}+</Text>
              </View>
            </View>
          )}
          <View style={styles.factRow}>
            <View style={styles.factIcon}>
              <Ionicons name="language-outline" size={16} color="#0B4155" />
            </View>
            <View style={styles.factInfo}>
              <Text style={styles.factLabel}>Languages</Text>
              <Text style={styles.factValue}>{tour.languages?.join(' · ') ?? 'English'}</Text>
            </View>
          </View>
          <View style={styles.factRow}>
            <View style={styles.factIcon}>
              <Ionicons name="car-outline" size={16} color="#0B4155" />
            </View>
            <View style={styles.factInfo}>
              <Text style={styles.factLabel}>Pickup</Text>
              <Text style={styles.factValue}>
                {tour.pickup === 'hotel'
                  ? 'Hotel pickup'
                  : tour.pickup === 'meeting-point'
                  ? 'Meeting point'
                  : 'Both'}
              </Text>
            </View>
          </View>
        </View>

        {/* What's included */}
        <View style={styles.detailSection}>
          <Text style={styles.detailSectionTitle}>What's included</Text>
          <View style={styles.checkList}>
            {tour.includes?.map((item) => (
              <View key={item} style={styles.checkItem}>
                <Ionicons name="checkmark-circle" size={15} color="#10B981" />
                <Text style={styles.checkText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* What to bring */}
        <View style={styles.detailSection}>
          <Text style={styles.detailSectionTitle}>What to bring</Text>
          <Text style={styles.detailBullets}>
            {tour.whatToBring.map((item) => `•  ${item}`).join('\n')}
          </Text>
        </View>

        {/* Description */}
        <View style={styles.detailSection}>
          <Text style={styles.detailSectionTitle}>About this tour</Text>
          <Text style={styles.detailDescription}>{tour.description}</Text>
        </View>

        {/* Itinerary */}
        <View style={styles.detailSection}>
          <Text style={styles.detailSectionTitle}>Itinerary</Text>
          {tour.itinerary?.map((step, i) => (
            <View key={step} style={styles.itineraryStep}>
              <View style={styles.itineraryNumber}>
                <Text style={styles.itineraryNumberText}>{i + 1}</Text>
              </View>
              <Text style={styles.itineraryText}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Seasonal note */}
        <View style={styles.seasonalBox}>
          <Ionicons name="cloud-outline" size={16} color="#1D7FA8" />
          <Text style={styles.seasonalText}>{tour.seasonalNote}</Text>
        </View>

        {/* Tips */}
        <View style={styles.detailSection}>
          <Text style={styles.detailSectionTitle}>Tips</Text>
          {tour.tips?.map((tip) => (
            <View key={tip} style={styles.tipItem}>
              <Ionicons name="bulb-outline" size={14} color="#E8A849" />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        {/* FAQ */}
        {tour.faq.length > 0 && (
          <View style={styles.detailSection}>
            <Text style={styles.detailSectionTitle}>Frequently asked questions</Text>
            {tour.faq.map((item) => (
              <View key={item.question} style={styles.faqItem}>
                <Text style={styles.faqQ}>{item.question}</Text>
                <Text style={styles.faqA}>{item.answer}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Booking section with disclosure */}
        <View style={styles.detailBookingSection}>
          <AffiliateDisclosure program={tour.primaryAffiliate as AffiliateProgram | undefined} />
          <TouchableOpacity style={styles.detailBookButtonLarge} onPress={onBook}>
            <Text style={styles.detailBookButtonLargeText}>
              {tour.affiliateLabel} — Book now
            </Text>
          </TouchableOpacity>
        </View>

        {/* Related hint */}
        <View style={styles.relatedSection}>
          <Text style={styles.relatedTitle}>You might also like</Text>
          <Text style={styles.relatedHint}>
            More tours in {CATEGORY_LABELS[tour.category]} coming soon.
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
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
  categoryBadgeText: {
    color: '#fff', fontFamily: font.body, fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5,
  },
  ratingBadge: {
    position: 'absolute', top: 10, right: 10, flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill, gap: 3,
  },
  ratingText: { color: color.ink, fontFamily: font.body, fontSize: 12, fontWeight: '700' },
  body: { padding: space[4] },
  location: { color: color.sky, fontFamily: font.body, fontSize: 12.5, fontWeight: '600', marginBottom: space[2] },
  title: {
    color: color.ink, fontFamily: font.body, fontSize: 16, fontWeight: '700', lineHeight: 22,
    marginBottom: space[3], minHeight: 44,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: space[3] },
  metaText: { color: color.muted, fontFamily: font.body, fontSize: 13, fontWeight: '500' },
  priceRow: {
    flexDirection: 'row', alignItems: 'baseline',
    borderTopWidth: 1, borderTopColor: color.border, paddingTop: space[3],
  },
  priceFrom: { color: color.muted, fontFamily: font.body, fontSize: 13 },
  priceValue: { color: color.primary, fontFamily: font.body, fontSize: 18, fontWeight: '700' },
  viewLink: { color: color.coral, fontFamily: font.body, fontSize: 13, fontWeight: '700', marginLeft: 'auto' },
  emptyContainer: { alignItems: 'center', paddingVertical: space[10], paddingHorizontal: space[5] },
  emptyText: { color: color.muted, fontFamily: font.body, fontSize: 15, marginTop: space[3] },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap', alignItems: 'stretch',
    gap: space[4], paddingHorizontal: space[5], paddingVertical: space[2],
  },
  // --- Detail ---
  detailContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    position: 'absolute',
    top: 44,
    left: 10,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 999,
    paddingHorizontal: 10,
  },
  backText: {
    color: '#0B4155',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 3,
  },
  detailHero: {
    height: 520,
    backgroundColor: '#0B4155',
    position: 'relative',
  },
  detailHeroImage: {
    width: '100%',
    height: '100%',
  },
  detailHeroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(11, 65, 85, 0.72)',
  },
  detailCategory: {
    color: '#FDF3E0',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  detailScroll: {
    flex: 1,
  },
  detailContent: {
    padding: 14,
    paddingBottom: 36,
  },
  detailHeader: {
    marginBottom: 14,
  },
  detailTitle: {
    color: '#0B4155',
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
  },
  detailRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 5,
  },
  detailRatingText: {
    color: '#0B4155',
    fontSize: 14,
    fontWeight: '700',
  },
  detailReviews: {
    color: '#6B7280',
    fontSize: 12,
    marginLeft: 1,
  },
  detailPriceCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF3E0',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E8A849',
  },
  detailPriceLabel: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '500',
  },
  detailPriceValue: {
    color: '#0B4155',
    fontSize: 20,
    fontWeight: '800',
  },
  detailPriceNote: {
    color: '#6B7280',
    fontSize: 11,
    marginLeft: 3,
  },
  detailBookButton: {
    backgroundColor: '#0B4155',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 'auto',
    flex: 1,
    alignItems: 'center',
  },
  detailBookButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  detailFacts: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  factRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  factIcon: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: '#E6F4FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  factInfo: {
    flex: 1,
  },
  factLabel: {
    color: '#6B7280',
    fontSize: 10,
    fontWeight: '500',
    marginBottom: 1,
  },
  factValue: {
    color: '#0B4155',
    fontSize: 13,
    fontWeight: '600',
  },
  detailSection: {
    marginBottom: 14,
  },
  detailSectionTitle: {
    color: '#0B4155',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  checkList: {
    gap: 4,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  checkText: {
    flex: 1,
    color: '#1A1A1A',
    fontSize: 12,
    lineHeight: 17,
  },
  detailBullets: {
    color: '#1A1A1A',
    fontSize: 12,
    lineHeight: 18,
  },
  detailDescription: {
    color: '#1A1A1A',
    fontSize: 12,
    lineHeight: 18,
  },
  itineraryStep: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  itineraryNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#0B4155',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  itineraryNumberText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  itineraryText: {
    flex: 1,
    color: '#1A1A1A',
    fontSize: 12,
    lineHeight: 17,
  },
  seasonalBox: {
    flexDirection: 'row',
    backgroundColor: '#E6F4FE',
    borderRadius: 10,
    padding: 12,
    gap: 8,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1D7FA8',
  },
  seasonalText: {
    flex: 1,
    color: '#0B4155',
    fontSize: 12,
    lineHeight: 17,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 4,
  },
  tipText: {
    flex: 1,
    color: '#1A1A1A',
    fontSize: 11,
    lineHeight: 16,
  },
  faqItem: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  faqQ: {
    color: '#0B4155',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  faqA: {
    color: '#6B7280',
    fontSize: 11,
    lineHeight: 16,
  },
  detailBookingSection: {
    marginTop: 4,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 8,
  },
  detailBookButtonLarge: {
    backgroundColor: '#E8A849',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  detailBookButtonLargeText: {
    color: '#0B4155',
    fontSize: 14,
    fontWeight: '800',
  },
  relatedSection: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  relatedTitle: {
    color: '#0B4155',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  relatedHint: {
    color: '#6B7280',
    fontSize: 12,
    lineHeight: 17,
  },
})
