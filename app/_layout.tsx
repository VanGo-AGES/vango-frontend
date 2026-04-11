import { useFonts } from 'expo-font';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';

import { queryClient } from '@/lib/query-client';
import { fonts } from '@/styles/typography';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: 'exemplo',
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts(fonts);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <PaperProvider>
          <Stack initialRouteName="index">
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="exemplo" options={{ headerShown: false }} />
            <Stack.Screen name="edit-profile-screen" options={{ headerShown: false }} />
            <Stack.Screen name="register-success" options={{ headerShown: false }} />
            <Stack.Screen name="register-basic-info-screen" options={{ headerShown: false }} />
            <Stack.Screen name="create-route/schedule" options={{ headerShown: false }} />
            <Stack.Screen name="dependent-details-screen" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </PaperProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
