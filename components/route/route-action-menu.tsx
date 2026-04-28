import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

type MaterialIconName = ComponentProps<typeof MaterialIcons>['name'];

export type RouteActionMenuProps = {
  isOpen: boolean;
  variant: 'driver' | 'passenger';
  onToggle: () => void;
  onEditPress?: () => void;
  onDeletePress?: () => void;
  onLeavePress?: () => void;
};

type MenuAction = {
  key: string;
  label: string;
  icon: MaterialIconName;
  onPress?: () => void;
  destructive?: boolean;
};

export function RouteActionMenu({
  isOpen,
  variant,
  onToggle,
  onEditPress,
  onDeletePress,
  onLeavePress,
}: RouteActionMenuProps) {
  const actions: MenuAction[] =
    variant === 'driver'
      ? [
          { key: 'edit', label: 'Editar', icon: 'edit', onPress: onEditPress },
          {
            key: 'delete',
            label: 'Deletar',
            icon: 'delete-outline',
            onPress: onDeletePress,
            destructive: true,
          },
        ]
      : [{ key: 'leave', label: 'Sair', icon: 'u-turn-left', onPress: onLeavePress }];

  return (
    <View style={styles.anchor} accessibilityRole="menu" accessibilityState={{ expanded: isOpen }}>
      <View style={[styles.floating, isOpen && styles.floatingOpen]}>
        <Pressable
          onPress={onToggle}
          accessibilityRole="button"
          accessibilityLabel={isOpen ? 'fechar menu de ações' : 'abrir menu de ações'}
          style={({ pressed }) => [styles.toggle, pressed && styles.pressed]}
        >
          <MaterialIcons name="menu" size={24} color={colors.dark} />
        </Pressable>

        {isOpen && (
          <View style={styles.actionsContainer}>
            {actions.map((action) => (
              <Pressable
                key={action.key}
                onPress={action.onPress}
                accessibilityRole="menuitem"
                accessibilityLabel={action.label.toLowerCase()}
                style={({ pressed }) => [styles.actionItem, pressed && styles.pressed]}
              >
                <View style={action.icon === 'u-turn-left' ? styles.rotatedIconWrapper : undefined}>
                  <MaterialIcons
                    name={action.icon}
                    size={24}
                    color={action.destructive ? colors.destructive : colors.dark}
                  />
                </View>
                <Text
                  style={[
                    styles.actionLabel,
                    action.destructive ? styles.actionLabelDestructive : null,
                  ]}
                >
                  {action.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const TOGGLE_HEIGHT = 48;
const MENU_WIDTH = 72;

const styles = StyleSheet.create({
  anchor: {
    alignSelf: 'flex-start',
    width: MENU_WIDTH,
    height: TOGGLE_HEIGHT + 16, // espaço reservado = só o toggle + padding vertical do pill
    zIndex: 9999, // garante que o componente não seja coberto por outros componentes
  },
  floating: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 9999, // garante que o componente não seja coberto por outros componentes
    width: MENU_WIDTH,
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 32,
    paddingVertical: 8,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  floatingOpen: {
    paddingBottom: 12,
  },
  toggle: {
    width: 56,
    height: TOGGLE_HEIGHT,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsContainer: {
    alignItems: 'stretch',
    gap: 4,
    marginTop: 4,
    width: 56,
  },
  actionItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 4,
    borderRadius: 16,
  },
  actionLabel: {
    ...typography.caption,
    color: colors.dark,
    textAlign: 'center',
  },
  actionLabelDestructive: {
    color: colors.destructive,
  },
  pressed: {
    opacity: 0.6,
  },
  rotatedIconWrapper: {
    transform: [{ rotate: '90deg' }],
  },
});
