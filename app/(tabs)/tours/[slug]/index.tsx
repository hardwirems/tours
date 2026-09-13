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
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: tour.priceFrom,
      priceValidUntil: '2026-12-31',
      availability: 'https://schema.org/InStock',
      url,
    },
  };

  // NOTE (policy, decided 2026-09-13): this aggregateRating reflects the
  // OPERATOR's (Viator) ratings, not reviews collected by this site. Google's
  // review-snippet policy expects first-party ratings, so this carries some risk
  // of a manual action. Owner elected to KEEP the stars for the search-CTR
  // benefit. To reverse later, drop this block and keep the rating on-page with
  // clear "rated on Viator" attribution.
  if (tour.rating != null && tour.reviewCount != null) {
    product.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: tour.rating,
      reviewCount: tour.reviewCount,
    };
  }

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
