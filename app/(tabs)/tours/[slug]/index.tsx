import { SITE_URL } from '../../../../lib/constants';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { getTourBySlug, TOURS } from '../../../../lib/tours';
import { useRouteParam } from '../../../../lib/useRouteParam';
import { TourDetail } from '../../../../components/TourCard';
import { Seo } from '../../../../components/Seo';

export const metadata = ({ params }: { params: { slug: string } }) => {
  const tour = getTourBySlug(params.slug);
  if (!tour) return { title: 'Tour not found — Guanacaste Tours' };

  const url = `${SITE_URL}/tours/${tour.slug}/`;
  return {
    title: `${tour.title} — Guanacaste Tours`,
    description: tour.description.slice(0, 160),
    openGraph: {
      title: tour.title,
      description: tour.description.slice(0, 160),
      type: 'website',
      url,
      siteName: 'Guanacaste Tours',
      images: [{ url: tour.ogImage ?? tour.images[0]?.src ?? '/images/og-default.jpg', width: 1200, height: 630, alt: tour.title }],
    },
    twitter: { card: 'summary_large_image', title: tour.title, description: tour.description.slice(0, 160) },
    alternates: { canonical: url },
    robots: { index: true, follow: true },
  };
};

// Offer price-validity window, computed at build so it never goes stale
// (the previous hardcoded priceValidUntil silently expired).
const OFFER_VALID_FROM = new Date().toISOString().slice(0, 10);
const OFFER_VALID_UNTIL = new Date(Date.now() + 365 * 864e5).toISOString().slice(0, 10);

export const jsonLd = ({ params }: { params: { slug: string } }) => {
  const tour = getTourBySlug(params.slug);
  if (!tour) return null;

  const url = `${SITE_URL}/tours/${tour.slug}/`;

  // Product node. Offer must live under `offers` (not `price`) or Google ignores
  // the price. `durationMinutes` is expressed as ISO-8601 on the Offer-less
  // Product only when meaningful; fabricated guide/organizer nodes removed.
  const product: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': tour.schemaType ?? 'Product',
    name: tour.title,
    description: tour.description,
    url,
    image: tour.ogImage ?? tour.images[0]?.src,
    // Merchant listings require a global identifier; tours have no GTIN, so we
    // declare the brand they are listed under (honest, and clears the warning).
    brand: { '@type': 'Brand', name: 'Guanacaste Experiences' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: tour.priceFrom,
      validFrom: OFFER_VALID_FROM,
      priceValidUntil: OFFER_VALID_UNTIL,
      availability: 'https://schema.org/InStock',
      url,
    },
  };

  // NOTE (policy, decided 2026-09-15): no aggregateRating/review markup. Tour
  // ratings come from Viator, not from reviews collected on this site, and
  // Google's review-snippet guidelines prohibit marking up ratings aggregated
  // from another website (manual-action risk). The rating is still shown on-page
  // with explicit "on Viator" attribution (components/TourCard.tsx). Do not
  // re-add rating schema unless the site collects its own first-party reviews.

  // Breadcrumb matches the on-page trail (Home / Tours / <title>).
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Tours', item: `${SITE_URL}/tours/` },
      { '@type': 'ListItem', position: 3, name: tour.title, item: url },
    ],
  };

  // FAQPage must be its own node, not a property of Product, to earn the FAQ
  // rich result.
  const faq =
    tour.faq.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: tour.faq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
          })),
        }
      : null;

  return faq ? [product, breadcrumb, faq] : [product, breadcrumb];
};

export default function TourDetailScreen() {
  const router = useRouter();
  // Resolve synchronously (and hydration-stably) so the tour content renders in
  // the static HTML export and the first client render matches it.
  const slug = useRouteParam('slug');
  const tour = slug ? getTourBySlug(slug) : undefined;

  if (!tour) {
    return (
      <>
        <Seo metadata={{ title: 'Tour not found — Guanacaste Tours', robots: { index: false, follow: true } }} />
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Tour not found</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Seo
        metadata={metadata({ params: { slug: tour.slug } })}
        jsonLd={jsonLd({ params: { slug: tour.slug } })}
      />
      <TourDetail
        tour={tour}
        onBack={() => router.push('/tours')}
        onBook={() => {
          if (typeof window !== 'undefined' && window.location) {
            window.location.href = `/go/${tour.primaryAffiliate}/${tour.slug}`;
          } else if (Platform.OS === 'ios' || Platform.OS === 'android') {
            import('expo-web-browser').then((m) => m.openBrowserAsync(tour.affiliateUrl, { readerMode: false, modalTitle: tour.title }));
          }
        }}
        onOpenBookingLink={() => {
          if (typeof window !== 'undefined' && window.location) {
            window.location.href = `/go/${tour.primaryAffiliate}/${tour.slug}`;
          }
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  notFound: { flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', padding: 20 },
  notFoundText: { color: '#6B7280', fontSize: 16, fontWeight: '600' },
});

export async function generateStaticParams() {
  return TOURS.map((tour) => ({ slug: tour.slug }));
}
