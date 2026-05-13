import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FabIcon from '@/assets/images/fab.svg';
import WazeIcon from '@/assets/images/waze.svg';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

type NavigationFabProps = {
  isOpen: boolean;
  onPress: () => void;
};

export function NavigationFab({ isOpen, onPress }: NavigationFabProps) {
  return (
    <View style={styles.container}>
      {isOpen && (
        <TouchableOpacity
          style={styles.optionButton}
          onPress={onPress}
          activeOpacity={0.8}
          accessibilityRole="button"
        >
          <WazeIcon width={20} height={20} />

          <Text style={styles.optionText}>Waze</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityRole="button"
      >
        <FabIcon width={20} height={20} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 116,
    height: 120,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },

  optionButton: {
    position: 'absolute',
    bottom: 64,

    height: 56,
    borderRadius: 28,
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
    width: 56,
    height: 56,
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
