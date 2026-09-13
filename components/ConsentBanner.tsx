import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

// ---------------------------------------------------------------------------
// Lightweight cookie-consent banner wired to Google Consent Mode.
// GA4 defaults to analytics_storage:'denied' (set in app/+html.tsx). This banner
// flips it to 'granted' on Accept and remembers the choice. Web-only; a no-op
// on native. Cloudflare Web Analytics is cookieless and unaffected either way.
// ---------------------------------------------------------------------------

const KEY = 'cookie_consent';

function applyConsent(value: 'granted' | 'denied') {
  try { localStorage.setItem(KEY, value); } catch (e) {}
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag === 'function') {
    w.gtag('consent', 'update', { analytics_storage: value });
  }
}

export function ConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    try {
      const v = localStorage.getItem(KEY);
      if (v !== 'granted' && v !== 'denied') setShow(true);
    } catch (e) {
      /* storage blocked — don't nag; leave analytics denied */
    }
  }, []);

  if (!show) return null;

  return (
    <View style={styles.bar}>
      <Text style={styles.text}>
        We use cookies for analytics to see how visitors use the site. Cloudflare traffic stats are
        always on and cookieless; Google Analytics runs only if you accept.
      </Text>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.decline}
          onPress={() => { applyConsent('denied'); setShow(false); }}
          accessibilityRole="button"
        >
          <Text style={styles.declineText}>Decline</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.accept}
          onPress={() => { applyConsent('granted'); setShow(false); }}
          accessibilityRole="button"
        >
          <Text style={styles.acceptText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'fixed' as 'absolute', bottom: 0, left: 0, right: 0, zIndex: 9999,
    backgroundColor: '#0B4155', paddingVertical: 12, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    flexWrap: 'wrap', gap: 12,
  },
  text: { color: '#FDF3E0', fontSize: 13, lineHeight: 18, flexShrink: 1, minWidth: 200, maxWidth: 720 },
  actions: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  decline: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#FDF3E0' },
  declineText: { color: '#FDF3E0', fontSize: 13, fontWeight: '600' },
  accept: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 8, backgroundColor: '#E0533D' },
  acceptText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
});
