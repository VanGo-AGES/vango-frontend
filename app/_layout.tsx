import { useFonts } from 'expo-font';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';

import { queryClient } from '@/lib/query-client';
import { fonts } from '@/styles/typography';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: 'index',
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts(fonts);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <PaperProvider>
            <Stack initialRouteName="index">
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="exemplo" options={{ headerShown: false }} />

              {/* auth */}
              <Stack.Screen name="(auth)/splash" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)/onboarding" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)/register-success" options={{ headerShown: false }} />

              {/* shared */}
              <Stack.Screen
                name="(shared)/register-profile-selection-screen"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="(shared)/register-basic-info-screen"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="(shared)/register-driver-details-screen"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="(shared)/register-passenger-details"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="(shared)/edit-profile-screen" options={{ headerShown: false }} />

              {/* driver */}
              <Stack.Screen name="(driver)/driver-home" options={{ headerShown: false }} />
              <Stack.Screen
                name="(driver)/profile-driver-screen"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="(driver)/vehicle-details-screen"
                options={{ headerShown: false }}
              />

              {/* driver > route */}
              <Stack.Screen
                name="(driver)/(route)/create-route-info-screen"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="(driver)/(route)/create-route-origin-screen"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="(driver)/(route)/create-route-destination-screen"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="(driver)/(route)/route-invite-code-screen"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="(driver)/(route)/schedule" options={{ headerShown: false }} />
              {/* passenger */}
              <Stack.Screen
                name="(passenger)/passenger-home-screen"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="(passenger)/profile-passenger-screen"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="(passenger)/dependent-details-screen"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="(passenger)/enter-route-code-screen"
                options={{ headerShown: false }}
              />
            </Stack>
            <StatusBar style="auto" />
          </PaperProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
