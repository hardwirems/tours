import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// Tab definitions for the native bottom tab bar.
// These also drive the web nav (same names, different layout on web).

export const VERTICAL_TABS = [
  { name: 'index', label: 'Home', icon: 'home' },
  { name: 'tours', label: 'Tours', icon: 'navigate' },
  { name: 'compare', label: 'Compare', icon: 'swap-horizontal' },
  { name: 'about', label: 'About', icon: 'information-circle' },
];

// Affiliate program slugs used in the /go/ redirect and Cloudflare Worker.
export const AFFILIATE_SLUGS: Record<string, string> = {
  getyourguide: 'gy',
  viator: 'vt',
  bookingcom: 'bc',
  discovercars: 'dc',
  airalo: 'ae',
  expedia: 'ex',
};

// Commission rates (conservative estimates — update as you confirm actual rates).
export const COMMISSION_RATES: Record<string, number> = {
  getyourguide: 0.08,
  viator: 0.08,
  bookingcom: 0.25,
  discovercars: 0.07,
  airalo: 0.20,
  expedia: 0.06,
};

// Cookie + tracking constants.
export const AFFILIATE_COOKIE_NAME = 'guanacaste_ref';
export const AFFILIATE_COOKIE_DAYS = 30;
export const CLICK_TABLE_ID = 'clicks'; // Supabase table name for click tracking.

/** Canonical origin for this site. Override per-environment with EXPO_PUBLIC_SITE_URL. */
export const SITE_URL =
  process.env.EXPO_PUBLIC_SITE_URL ?? 'https://www.guanacasteexperiences.com';

/**
 * Cloudflare Web Analytics beacon token. Get it from the Cloudflare dashboard:
 * Web Analytics -> Add a site -> copy the token from the JS snippet.
 * Paste it here (or set EXPO_PUBLIC_CF_BEACON_TOKEN). Empty = beacon not rendered.
 */
export const CF_BEACON_TOKEN = process.env.EXPO_PUBLIC_CF_BEACON_TOKEN ?? '78806ea072104767b89a184ed06cf388';

/** Google Analytics 4 Measurement ID (public — rendered in page HTML). Empty = gtag not loaded. */
export const GA_MEASUREMENT_ID = process.env.EXPO_PUBLIC_GA_ID ?? 'G-XCDXJQ2412';

/**
 * Google Search Console HTML-tag verification token (only if NOT using DNS
 * verification). Leave empty when verifying via DNS TXT at the registrar.
 */
export const GSC_VERIFICATION = process.env.EXPO_PUBLIC_GSC_VERIFICATION ?? '';
