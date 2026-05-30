import { useMemo, useState } from 'react';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Alert, Linking, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActiveRouteMap } from '@/components/route/active-route-map';
import { NavigationFab } from '@/components/route/navigation-fab';
import { RouteTopBar } from '@/components/route/route-top-bar';
import { TripBottomSheet } from '@/components/route/trip-bottom-sheet';
import AppDialog from '@/components/general/app-dialog';
import { openWazeNavigation, getWazeUrls } from '@/lib/waze-navigation';
import { colors } from '@/styles/colors';

import { useTripTracker } from '@/hooks/use-trip-tracker';
import { useTrip } from '@/hooks/use-trip';
import { useTripNextStop } from '@/hooks/use-trip-next-stop';
import { useBoardPassanger } from '@/hooks/use-board-passanger';
import { useMarkPassangerAbsent } from '@/hooks/use-mark-passanger-absent';
import { useAlightPassanger } from '@/hooks/use-alight-passanger';
import { useSkipStop } from '@/hooks/use-skip-stop';
import { useFinishTrip } from '@/hooks/use-finish-trip';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { PrimaryButton } from '@/components/general/primary-button';

type ActiveDialog =
  | 'confirmPickup'
  | 'confirmDropoff'
  | 'confirmAbsence'
  | 'confirmNotDropoff'
  | 'skipStop'
  | 'routeFinished'
  | null;

export default function DriverActiveRouteScreen() {
  const router = useRouter();
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const insets = useSafeAreaInsets();

  const [navigationMenuOpen, setNavigationMenuOpen] = useState(false);
  const [activeDialog, setActiveDialog] = useState<ActiveDialog>(null);

  const [localMissedDropoffs, setLocalMissedDropoffs] = useState<Set<string>>(new Set());

  const { eta, lastLocation, error: gpsError } = useTripTracker(tripId!);
  const { data: trip } = useTrip(tripId!);
  const { data: nextStop, isLoading: isLoadingNextStop } = useTripNextStop(tripId!);

  const boardMutation = useBoardPassanger();
  const absentMutation = useMarkPassangerAbsent();
  const alightMutation = useAlightPassanger();
  const skipMutation = useSkipStop();
  const finishMutation = useFinishTrip();

  const isMutating =
    boardMutation.isPending ||
    absentMutation.isPending ||
    alightMutation.isPending ||
    skipMutation.isPending ||
    finishMutation.isPending;

  const bottomPadding = Math.max(24, insets.bottom);
  const sheetMaxHeight = 570 + bottomPadding;
  const sheetMinHeight = 310;
  const sheetMaxTranslateY = sheetMaxHeight - sheetMinHeight;

  const sheetTranslateY = useSharedValue(sheetMaxTranslateY);
  const floatingButtonsStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetTranslateY.value }],
  }));

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/driver-home' as never);
    }
  };

  const closeDialog = () => setActiveDialog(null);

  const calculateExpectedArrival = () => {
    if (!eta?.eta_minutes) return '--:--';
    const now = new Date();
    now.setMinutes(now.getMinutes() + eta.eta_minutes);
    return now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const handleOpenWaze = async () => {
    setNavigationMenuOpen(false);
    // O next-stop do backend não devolve coordenadas — navegamos por endereço.
    const address = nextStop?.address_label;
    if (!address) {
      Alert.alert('Navegação', 'Endereço da próxima parada indisponível.');
      return;
    }

    const opened = await openWazeNavigation({ address });
    if (!opened) {
      const urls = getWazeUrls({ address });
      const webUrl = urls.find((url) => url.startsWith('https://'));
      Alert.alert('Navegação', 'Não foi possível abrir o Waze. Deseja abrir a versão web?', [
        { text: 'Abrir Waze Web', onPress: () => webUrl && Linking.openURL(webUrl) },
        { text: 'Cancelar', style: 'cancel' },
      ]);
    }
  };

  const dialogConfig = {
    confirmPickup: {
      title: 'Confirmar embarque?',
      description: 'O passageiro será marcado como embarcado.',
      confirmLabel: 'Confirmar',
      confirmVariant: 'default' as const,
      onConfirm: () => {
        if (nextStop?.trip_passanger_id) {
          boardMutation.mutate({ tripId: tripId!, tripPassangerId: nextStop.trip_passanger_id });
        }
        closeDialog();
      },
    },
    confirmDropoff: {
      title: 'Confirmar desembarque?',
      description: 'O passageiro será marcado como entregue.',
      confirmLabel: 'Confirmar',
      confirmVariant: 'default' as const,
      onConfirm: () => {
        if (nextStop?.trip_passanger_id) {
          alightMutation.mutate({ tripId: tripId!, tripPassangerId: nextStop.trip_passanger_id });
        }
        closeDialog();
      },
    },
    confirmAbsence: {
      title: 'Confirmar ausência?',
      description: 'O passageiro não embarcou e será marcado como ausente.',
      confirmLabel: 'Confirmar',
      confirmVariant: 'destructive' as const,
      onConfirm: () => {
        if (nextStop?.trip_passanger_id) {
          absentMutation.mutate({ tripId: tripId!, tripPassangerId: nextStop.trip_passanger_id });
        }
        closeDialog();
      },
    },
    confirmNotDropoff: {
      title: 'Confirmar não desembarque?',
      description: 'O passageiro será marcado como não entregue.',
      confirmLabel: 'Confirmar',
      confirmVariant: 'destructive' as const,
      onConfirm: () => {
        if (nextStop?.trip_passanger_id) {
          setLocalMissedDropoffs((prev) => new Set(prev).add(nextStop.trip_passanger_id));
        }
        closeDialog();
      },
    },
    skipStop: {
      title: 'Pular parada?',
      description: 'O passageiro não será embarcado.\nA rota seguirá para o próximo destino.',
      confirmLabel: 'Pular',
      confirmVariant: 'destructive' as const,
      onConfirm: () => {
        if (nextStop?.stop_id) {
          skipMutation.mutate({ tripId: tripId!, stopId: nextStop.stop_id });
        }
        closeDialog();
      },
    },
    routeFinished: {
      title: 'Finalizar Rota?',
      description: 'Deseja realmente encerrar a viagem?',
      confirmLabel: 'Encerrar',
      confirmVariant: 'destructive' as const,
      onConfirm: () => {
        finishMutation.mutate(
          { tripId: tripId!, routeId: trip?.route_id ?? '' },
          {
            onSuccess: () => {
              router.replace({
                pathname: '/(driver)/(route)/route-metrics-screen' as never,
                params: { tripId: tripId! },
              });
            },
          },
        );
        closeDialog();
      },
    },
  };

  const currentDialog = activeDialog ? dialogConfig[activeDialog] : null;

  const isArrived =
    (typeof eta?.distance_km === 'number' && eta.distance_km <= 0.5) ||
    (typeof eta?.eta_minutes === 'number' && eta.eta_minutes <= 1);

  const stopArrivalProps = useMemo(() => {
    if (!isArrived || !nextStop) return undefined;

    const isPickup = nextStop.trip_passanger_status.includes('pend');

    return {
      tripType: isPickup ? 'pickup' : 'dropoff',
      countdownSeconds: 120,
      onConfirmPress: () => setActiveDialog(isPickup ? 'confirmPickup' : 'confirmDropoff'),
      onAbsentPress: () => setActiveDialog(isPickup ? 'confirmAbsence' : 'confirmNotDropoff'),
    };
  }, [isArrived, nextStop]);

  const isMapLoading = !lastLocation || isLoadingNextStop;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.screen}>
        {gpsError ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
            <MaterialIcons name="location-off" size={48} color={colors.destructive} />
            <Text style={{ marginTop: 16, color: colors.text, textAlign: 'center', padding: 20 }}>
              {gpsError}
            </Text>
          </View>
        ) : isMapLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ marginTop: 16, color: colors.text }}>Obtendo sinal de GPS...</Text>
          </View>
        ) : (
          <ActiveRouteMap
            currentLocation={{
              latitude: lastLocation.latitude,
              longitude: lastLocation.longitude,
            }}
            nextStopLocation={{
              latitude: lastLocation.latitude,
              longitude: lastLocation.longitude,
            }}
            onRecenterPress={() => {}}
            containerStyle={styles.map}
            recenterButtonStyle={[styles.recenterButtonPosition, floatingButtonsStyle]}
          />
        )}

        <View style={styles.topBarContainer}>
          <RouteTopBar onBackPress={handleBackPress} showMenu={false} />
        </View>

        <Animated.View pointerEvents="box-none" style={[styles.fabContainer, floatingButtonsStyle]}>
          <NavigationFab
            isOpen={navigationMenuOpen}
            onToggle={() => setNavigationMenuOpen(!navigationMenuOpen)}
            onWazePress={handleOpenWaze}
          />
        </Animated.View>

        {nextStop ? (
          <TripBottomSheet
            nextStop={{
              id: nextStop.stop_id,
              address: nextStop.address_label,
            }}
            passenger={{
              id: nextStop.trip_passanger_id,
              name: nextStop.passanger_name,
              phoneNumber: nextStop.passanger_phone,
            }}
            timeRemaining={eta?.eta_minutes ?? 0}
            estimatedArrival={eta ? calculateExpectedArrival() : '--:--'}
            distance={eta ? `${eta.distance_km.toFixed(1)}km` : '--'}
            onSkipStop={() => setActiveDialog('skipStop')}
            translateY={sheetTranslateY}
            stopArrival={stopArrivalProps as any}
          />
        ) : !isLoadingNextStop ? (
          <View
            style={[styles.emptyContainer, { padding: 24, width: '90%', alignItems: 'center' }]}
          >
            <MaterialIcons
              name="flag"
              size={48}
              color={colors.primary}
              style={{ marginBottom: 16 }}
            />
            <Text
              style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}
            >
              Todos os passageiros concluídos!
            </Text>
            <Text style={{ textAlign: 'center', color: colors.text, marginBottom: 24 }}>
              Siga para o destino final e encerre a viagem quando chegar.
            </Text>
            <PrimaryButton
              label="Encerrar Viagem"
              onPress={() => setActiveDialog('routeFinished')}
              icon={<MaterialIcons name="check-circle" size={20} color={colors.white} />}
              style={{ width: '100%' }}
            />
          </View>
        ) : null}

        {currentDialog && (
          <AppDialog
            visible={Boolean(currentDialog)}
            title={currentDialog.title}
            description={currentDialog.description}
            onRequestClose={closeDialog}
            actions={[
              {
                label: 'Cancelar',
                onPress: closeDialog,
                variant: 'cancel',
                icon: 'close',
                disabled: isMutating,
              },
              {
                label: currentDialog.confirmLabel,
                onPress: currentDialog.onConfirm,
                variant: currentDialog.confirmVariant,
                icon: activeDialog === 'skipStop' ? 'chevron-double-right' : 'check',
                loading: isMutating,
                disabled: isMutating,
              },
            ]}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.light,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    height: undefined,
    borderWidth: 0,
  },
  topBarContainer: {
    position: 'absolute',
    top: 52,
    left: 4,
    right: 4,
    zIndex: 20,
  },
  fabContainer: {
    position: 'absolute',
    right: 16,
    bottom: 636,
    alignItems: 'flex-end',
  },
  recenterButtonPosition: {
    marginBottom: 620,
  },
  emptyContainer: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: colors.light,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 4,
  },
});
