import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import AppDialog from '@/components/general/app-dialog';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export type RouteItemStatus = 'default' | 'pending';

export type RouteItemProps = {
  name: string;
  days: string;
  duration: string;
  distance: string;
  status?: RouteItemStatus;
  thumbnailUri?: string;
  thumbnailSource?: ImageSourcePropType;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  pendingBadgeLabel?: string;
  pendingDialogTitle?: string;
  pendingDialogDescription?: string;
};

export function RouteItem({
  name,
  days,
  duration = '30',
  distance = '10',
  status = 'default',
  thumbnailUri,
  thumbnailSource,
  onPress,
  style,
  pendingBadgeLabel = 'CONVITE PENDENTE',
  pendingDialogTitle = 'Convite pendente',
  pendingDialogDescription = 'Você ainda não aceitou esse convite de rota. Ao aceitar, os detalhes completos do trajeto ficarão disponíveis.',
}: RouteItemProps) {
  const [isPendingDialogVisible, setIsPendingDialogVisible] = useState(false);

  const isPending = status === 'pending';

  const handlePress = () => {
    if (isPending) {
      setIsPendingDialogVisible(true);
      return;
    }

    onPress?.();
  };

  const hasImage = !!thumbnailUri || !!thumbnailSource;

  return (
    <>
      <Pressable
        accessibilityRole="button"
        onPress={handlePress}
        style={({ pressed }) => [
          styles.container,
          style,
          pressed && styles.pressed,
          isPending && styles.pendingContainer,
        ]}
      >
        {hasImage ? (
          <Image
            source={thumbnailSource ?? { uri: thumbnailUri }}
            style={styles.thumbnail}
            contentFit="cover"
          />
        ) : (
          <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
            <Icon name="map-marker-path" size={24} color={colors.subtleText} />
          </View>
        )}

        <View style={styles.content}>
          {isPending && (
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingBadgeLabel}>{pendingBadgeLabel}</Text>
            </View>
          )}

          <Text style={[styles.name, isPending && styles.pendingText]} numberOfLines={1}>
            {name}
          </Text>

          <View style={styles.daysRow}>
            <Icon
              name="calendar-month-outline"
              size={16}
              color={isPending ? colors.subtleText : colors.dark}
            />
            <Text style={[styles.days, isPending && styles.pendingText]} numberOfLines={1}>
              {days}
            </Text>
          </View>

          {!isPending && (
            <Text style={styles.meta} numberOfLines={1}>
              {duration} · {distance}
            </Text>
          )}
        </View>

        {!isPending && (
          <Icon name="arrow-right" size={24} color={colors.dark} style={styles.arrow} />
        )}
      </Pressable>

      <AppDialog
        visible={isPendingDialogVisible}
        title={pendingDialogTitle}
        description={pendingDialogDescription}
        onRequestClose={() => setIsPendingDialogVisible(false)}
        actions={[
          {
            label: 'Entendi',
            icon: 'check',
            variant: 'default',
            onPress: () => setIsPendingDialogVisible(false),
          },
        ]}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    //alignItems: 'center',
    gap: 16,
    height: 98,
    //borderRadius: 16,
    //paddingVertical: 8,
    paddingRight: 24,
  },
  pressed: {
    opacity: 0.75,
  },
  pendingContainer: {
    opacity: 0.9,
  },
  thumbnail: {
    width: 90,
    height: 90,
    borderRadius: 12,
    top: 0,
    overflow: 'hidden',
  },
  thumbnailPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 8,
  },
  pendingBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: colors.accent,
    marginBottom: 2,
  },
  pendingBadgeLabel: {
    ...typography.buttonText,
    color: colors.dark,
  },
  name: {
    ...typography.subtitle,
    color: colors.dark,
    height: 28,
    width: '100%',
    lineHeight: 28,
  },
  daysRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 24,
  },
  days: {
    ...typography.small,
    color: colors.dark,
  },
  meta: {
    ...typography.small,
    color: colors.text,
    //marginTop: 2,
    //bottom: 6,
    height: 24,
  },
  pendingText: {
    color: colors.subtleText,
  },
  arrow: {
    position: 'absolute',
    right: 0,
    alignSelf: 'flex-end',
    bottom: 6,
  },
});
