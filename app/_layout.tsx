import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0B4155' },
          animation: 'slide_from_right',
        }}
      >
        {children}
      </Stack>
    </>
  );
}
