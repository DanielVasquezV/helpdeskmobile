import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors[colorScheme === 'dark' ? 'dark' : 'light'].background },
          headerTintColor: Colors[colorScheme === 'dark' ? 'dark' : 'light'].text,
          headerTitleAlign: 'center',
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="detail/[id]" options={{ title: 'Detalle del Ticket' }} />
      </Stack>
    </ThemeProvider>
  );
}