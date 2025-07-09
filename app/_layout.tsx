// app/_layout.tsx (Versi Sederhana)

import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'PlusJakartaSans': require('../assets/fonts/PlusJakartaSans-VariableFont_wght.ttf'),
    'PlusJakartaSans-Italic': require('../assets/fonts/PlusJakartaSans-Italic-VariableFont_wght.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="detail/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}