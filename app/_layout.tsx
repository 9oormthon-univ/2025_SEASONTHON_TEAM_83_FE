import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/109LeantheWall.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="category-setup" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="challenge" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="my-page" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
        <Stack.Screen name="attendance" options={{ headerShown: false }} />
        <Stack.Screen name="challenge-certification" options={{ headerShown: false }} />
        <Stack.Screen name="badges" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
