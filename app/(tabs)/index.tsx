import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...typography.header3,
    color: colors.dark,
  },
});
