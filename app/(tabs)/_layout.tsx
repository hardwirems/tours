import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

// ------------------------------------------------------------------
// (tabs) layout — bottom tab bar for native + web.
// ------------------------------------------------------------------

const TABS = [
  { name: 'index', label: 'Home', icon: 'home' },
  { name: 'tours', label: 'Tours', icon: 'list' },
  { name: 'compare', label: 'Compare', icon: 'swap-horizontal' },
  { name: 'about', label: 'About', icon: 'information-circle' },
  { name: 'dashboard', label: 'Dashboard', icon: 'analytics' },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TabsLayout() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.label,
            tabBarIcon: (props: any) => (
              <Ionicons name={tab.icon as keyof typeof Ionicons.glyphMap} size={props.size} color={props.color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
