import { useState } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { colors, withAlpha } from '@/styles/colors';
import { RouteActionMenu, type RouteActionMenuProps } from '@/components/route/route-action-menu';

type RouteTopBarProps = {
  onBackPress: () => void;
  variant?: 'driver' | 'passenger';
  onEditPress?: () => void;
  onDeletePress?: () => void;
  onLeavePress?: () => void;
  showMenu?: boolean;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
};

export function RouteTopBar({
  onBackPress,
  variant,
  onEditPress,
  onDeletePress,
  onLeavePress,
  showMenu = true,
  backgroundColor = colors.light,
  style,
}: RouteTopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      <Pressable
        onPress={onBackPress}
        accessibilityRole="button"
        accessibilityLabel="voltar"
        style={({ pressed }) => [styles.backButton, pressed && styles.buttonPressed]}
      >
        <MaterialIcons name="arrow-back" size={24} color={colors.dark} />
      </Pressable>

      {variant && showMenu && (
        <View style={styles.menuWrapper}>
          <RouteActionMenu
            isOpen={menuOpen}
            variant={variant}
            onToggle={handleMenuToggle}
            onEditPress={onEditPress}
            onDeletePress={onDeletePress}
            onLeavePress={onLeavePress}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: 412,
    alignSelf: 'center',
    height: 64,
    paddingVertical: 8,
    paddingHorizontal: 4,

    backgroundColor: colors.light,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 100,
    backgroundColor: withAlpha(colors.accent, 0.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  menuWrapper: {
    transform: [{ scale: 0.85 }],
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
