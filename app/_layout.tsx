import { WorkSans_500Medium, WorkSans_700Bold, useFonts } from '@expo-google-fonts/work-sans';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';

import { queryClient } from '@/lib/query-client';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: 'exemplo',
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ WorkSans_500Medium, WorkSans_700Bold });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <Stack initialRouteName="index">
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="exemplo" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </PaperProvider>
    </QueryClientProvider>
  );
}
