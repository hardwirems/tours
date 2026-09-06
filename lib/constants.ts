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
