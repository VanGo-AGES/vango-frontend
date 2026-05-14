import { StyleSheet, Text, View } from 'react-native';

import { ActiveRouteMap } from '@/components/route/active-route-map';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export default function TesteScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Teste do mapa da rota</Text>

      <ActiveRouteMap
        currentLocation={{ latitude: -23.55052, longitude: -46.633308 }}
        nextStopLocation={{ latitude: -23.55872, longitude: -46.65012 }}
        containerStyle={{ height: 400 }} // muda aí a altura muito radicalmente 🤘🥝
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.light,
    paddingTop: 64,
    gap: 12,
  },
  title: {
    ...typography.header3,
    color: colors.dark,
    paddingHorizontal: 16,
  },
  subtitle: {
    ...typography.bodyMedium,
    color: colors.subtleText,
  },
});
