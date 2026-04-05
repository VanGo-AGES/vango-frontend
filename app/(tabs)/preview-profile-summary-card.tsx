import { ScrollView, StyleSheet } from 'react-native';

import { ProfileSummaryCard } from '@/components/ui/profile-summary-card';
import { colors } from '@/styles/colors';

export default function PreviewProfileSummaryCardScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ProfileSummaryCard />
      <ProfileSummaryCard
        user={{
          name: 'Maria Souza',
          location: 'São Paulo, SP',
          avatarUri: 'https://i.pravatar.cc/150?img=5',
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.accent,
    padding: 24,
    gap: 24,
    justifyContent: 'center',
  },
});
