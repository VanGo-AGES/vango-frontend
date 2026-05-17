import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FabIcon from '@/assets/images/fab.svg';
import WazeIcon from '@/assets/images/waze.svg';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

type NavigationFabProps = {
  isOpen: boolean;
  onToggle: () => void;
  onWazePress: () => void;
};

export function NavigationFab({ isOpen, onToggle, onWazePress }: NavigationFabProps) {
  return (
    <View style={styles.container}>
      {isOpen && (
        <TouchableOpacity
          style={styles.optionButton}
          onPress={onWazePress}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="abrir Waze"
        >
          <WazeIcon width={20} height={20} />

          <Text style={styles.optionText}>Waze</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={onToggle}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={isOpen ? 'fechar menu de navegação' : 'abrir menu de navegação'}
      >
        <FabIcon width={20} height={20} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    gap: 8,
  },

  optionButton: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: colors.light,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  optionText: {
    ...typography.body,
    color: colors.dark,
  },

  fab: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
});
