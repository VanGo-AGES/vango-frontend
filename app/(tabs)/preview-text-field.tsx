import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppTextField } from '@/components/app-text-field';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export default function PreviewTextFieldScreen() {
  const [value, setValue] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>AppTextField</Text>

        <Text style={styles.sectionLabel}>Placeholder</Text>
        <AppTextField label="Telefone" placeholder="+55 51 99999-9999" />

        <Text style={styles.sectionLabel}>Input</Text>
        <AppTextField
          label="Telefone"
          placeholder="+55 51 99999-9999"
          value={value}
          onChangeText={setValue}
        />

        <Text style={styles.sectionLabel}>Error</Text>
        <AppTextField
          label="Telefone"
          placeholder="+55 51 99999-9999"
          value="+55 51 99999-999"
          error="Telefone Inválido"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  content: {
    padding: 24,
    gap: 24,
  },
  title: {
    ...typography.header3,
    color: colors.dark,
    marginBottom: 8,
  },
  sectionLabel: {
    ...typography.preTitle,
    color: colors.subtleText,
    marginBottom: -16,
  },
});
