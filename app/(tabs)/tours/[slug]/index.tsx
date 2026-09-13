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

  return {
    '@context': 'https://schema.org',
    '@type': tour.schemaType ?? 'Product',
    name: tour.title,
    description: tour.description,
    url: `${SITE_URL}/tours/${tour.slug}/`,
    image: tour.ogImage ?? tour.images[0]?.src,
    startDate: '2026-01-01T00:00',
    price: { '@type': 'Offer', priceCurrency: 'USD', price: tour.priceFrom, priceValidUntil: '2026-12-31', availability: 'https://schema.org/InStock' },
    duration: tour.durationMinutes ? `${tour.durationMinutes} minutes` : tour.duration,
    tourGuide: { '@type': 'Person', name: 'Guanacaste Tours Guide', url: `${SITE_URL}/about` },
    organizer: { '@type': 'Organization', name: 'Guanacaste Tours', url: `${SITE_URL}` },
    aggregateRating: tour.rating != null && tour.reviewCount != null
      ? { '@type': 'AggregateRating', ratingValue: tour.rating, reviewCount: tour.reviewCount }
      : undefined,
    FAQPage: {
      '@type': 'FAQPage',
      mainEntity: tour.faq.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
    },
  };
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
