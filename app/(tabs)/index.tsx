import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <MaterialCommunityIcons name="check-decagram" size={120} color={colors.dark} />
        <Text style={styles.title}>Tudo certo!</Text>
        <Text style={styles.subtitle}>Cadastro realizado com sucesso</Text>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>→ Continuar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    ...typography.header2,
    color: colors.dark,
    marginTop: 8,
  },
  subtitle: {
    ...typography.body,
    color: colors.dark,
  },
  button: {
    backgroundColor: colors.dark,
    borderRadius: 32,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonText: {
    ...typography.body,
    color: colors.primary,
  },
});
