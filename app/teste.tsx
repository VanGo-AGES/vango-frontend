import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';

import { ActiveRouteMap } from '@/components/route/active-route-map';

export default function Teste() {
  const currentLocation = { latitude: -30.0379, longitude: -51.2233 };
  const nextStopLocation = { latitude: -30.0402, longitude: -51.2291 };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <ActiveRouteMap
          currentLocation={currentLocation}
          nextStopLocation={nextStopLocation}
          containerStyle={styles.map}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
