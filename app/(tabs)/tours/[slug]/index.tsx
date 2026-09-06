import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { getTourBySlug } from '../../../../lib/tours';
import { TourDetail } from '../../../../components/TourCard';

export const metadata = ({ params }: { params: { slug: string } }) => {
  const tour = getTourBySlug(params.slug);
  if (!tour) return { title: 'Tour not found — Guanacaste Tours' };

  const url = `https://guanacaste.tours/tours/${tour.slug}`;
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
    '@type': tour.schemaType,
    name: tour.title,
    description: tour.description,
    url: `https://guanacaste.tours/tours/${tour.slug}`,
    image: tour.ogImage ?? tour.images[0]?.src,
    startDate: '2026-01-01T00:00',
    price: { '@type': 'Offer', priceCurrency: 'USD', price: tour.priceFrom, priceValidUntil: '2026-12-31', availability: 'https://schema.org/InStock' },
    duration: tour.durationMinutes ? `${tour.durationMinutes} minutes` : tour.duration,
    tourGuide: { '@type': 'Person', name: 'Guanacaste Tours Guide', url: 'https://guanacaste.tours/about' },
    organizer: { '@type': 'Organization', name: 'Guanacaste Tours', url: 'https://guanacaste.tours' },
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
  const params = useLocalSearchParams<{ slug: string }>();
  const [tour, setTour] = useState<ReturnType<typeof getTourBySlug>>(null);

  useEffect(() => {
    const t = getTourBySlug(params.slug);
    setTour(t);
  }, [params.slug]);

  if (!tour) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Tour not found</Text>
      </View>
    );
  }

  return (
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
  );
}

const styles = StyleSheet.create({
  notFound: { flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', padding: 20 },
  notFoundText: { color: '#6B7280', fontSize: 16, fontWeight: '600' },
});
