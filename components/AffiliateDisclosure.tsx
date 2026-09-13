import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Icon } from './Icon';
import { Tour, AffiliateProgram, AFFILIATE_LABELS } from '../lib/tours';

// ---------------------------------------------------------------------------
// AffiliateDisclosure — compact, always-visible affiliate disclosure
// compliant with FTC + Google's requirement for transparency.
// Shown on tour cards (mini) and full tour detail pages.
// ---------------------------------------------------------------------------

interface AffiliateDisclosureProps {
  program?: AffiliateProgram;
  mini?: boolean;
}

export function AffiliateDisclosure({ program, mini = false }: AffiliateDisclosureProps) {
  const label = program ? AFFILIATE_LABELS[program] : null;

  if (mini) {
    return (
      <View style={styles.miniRow}>
        <Icon name="information-circle" size={10} color="#6B7280" />
        <Text style={styles.miniText}>
          We may earn a commission, at no extra cost to you.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Icon name="information-circle" size={18} color="#0B4155" />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>Affiliate disclosure</Text>
        <Text style={styles.cardText}>
          {label && `${label} is one of our affiliate partners. `}
          When you book a tour through a link on this page, we may earn a commission
          at no additional cost to you. This helps us keep the guides free and
          up-to-date. We only recommend tours we've researched and believe are
          worth your time. Prices and availability are set by the operator and
          may change — always check the listing before booking.
        </Text>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// AffiliateDisclosureBar — inline bar placed directly above booking CTAs.
// Most visible placement for compliance + transparency.
// ---------------------------------------------------------------------------

export function AffiliateDisclosureBar({ program }: AffiliateDisclosureProps) {
  const label = program ? AFFILIATE_LABELS[program] : 'our partners';

  return (
    <View style={styles.bar}>
      <Icon name="checkmark-circle" size={13} color="#10B981" />
      <Text style={styles.barText}>
        We may earn a commission when you book through {label}. No extra cost to you.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  miniRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  miniText: {
    color: '#6B7280',
    fontSize: 10,
    lineHeight: 14,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    gap: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    color: '#0B4155',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  cardText: {
    color: '#6B7280',
    fontSize: 12,
    lineHeight: 17,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF3E0',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E8A849',
  },
  barText: {
    color: '#8B6914',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
});
