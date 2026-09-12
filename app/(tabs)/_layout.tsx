import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

// ------------------------------------------------------------
// (tabs) layout — bottom tab bar for native + web.
// ------------------------------------------------------------

const TABS = [
  { name: 'index', label: 'Home', icon: 'home' },
  { name: 'tours', label: 'Tours', icon: 'list' },
  { name: 'compare', label: 'Compare', icon: 'swap-horizontal' },
  { name: 'about', label: 'About', icon: 'information-circle' },
  { name: 'dashboard', label: 'Dashboard', icon: 'analytics' },
] as const;

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0B4155',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E7EB',
          borderTopWidth: 1,
          paddingBottom: 4,
          paddingTop: 4,
          height: 56,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 2,
        },
        headerShown: false,
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.label,
            tabBarIcon: ({ size, color }: { size: number; color: string }) => (
              <Ionicons name={tab.icon} size={size} color={color} />
            ),
          }}
        />
      ))}

      {/* Dynamic content routes — reachable + indexable, hidden from the tab bar. */}
      <Tabs.Screen name="tours/[slug]/index" options={{ href: null }} />
      <Tabs.Screen name="categories/[category]/index" options={{ href: null }} />
      <Tabs.Screen name="destinations/[place]/index" options={{ href: null }} />
    </Tabs>
  );
}