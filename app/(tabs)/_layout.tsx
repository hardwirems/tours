import { Icon } from '../../components/Icon';
import { Tabs } from 'expo-router';
import { View, Platform } from 'react-native';
import { SiteHeader } from '../../components/SiteHeader';
import { color } from '../../lib/theme';

// ------------------------------------------------------------
// (tabs) layout. Web: sticky top SiteHeader + hidden bottom bar.
// Native: bottom tab bar.
// ------------------------------------------------------------

const TABS = [
  { name: 'index', label: 'Home', icon: 'home' },
  { name: 'tours', label: 'Tours', icon: 'list' },
  { name: 'compare', label: 'Compare', icon: 'swap-horizontal' },
  { name: 'about', label: 'About', icon: 'information-circle' },
  { name: 'dashboard', label: 'Dashboard', icon: 'analytics' },
] as const;

export default function TabsLayout() {
  const isWeb = Platform.OS === 'web';
  return (
    <View style={{ flex: 1, backgroundColor: color.ground }}>
      <SiteHeader />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: color.primary,
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarStyle: isWeb
            ? { display: 'none' }
            : {
                backgroundColor: '#FFFFFF',
                borderTopColor: color.border,
                borderTopWidth: 1,
                paddingBottom: 4,
                paddingTop: 4,
                height: 56,
              },
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginBottom: 2 },
          headerShown: false,
        }}
      >
        {TABS.map((tab) => (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              title: tab.label,
              tabBarIcon: ({ size, color: c }: { size: number; color: string }) => (
                <Icon name={tab.icon} size={size} color={c} />
              ),
            }}
          />
        ))}

        {/* Dynamic + index content routes — reachable + indexable, not tabs. */}
        <Tabs.Screen name="tours/[slug]/index" options={{ href: null }} />
        <Tabs.Screen name="categories/[category]/index" options={{ href: null }} />
        <Tabs.Screen name="destinations/index" options={{ href: null }} />
        <Tabs.Screen name="destinations/[place]/index" options={{ href: null }} />
      </Tabs>
    </View>
  );
}
