import { useEffect, useMemo, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { Alert, Linking, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActiveRouteMap } from '@/components/route/active-route-map';
import { NavigationFab } from '@/components/route/navigation-fab';
import { RouteTopBar } from '@/components/route/route-top-bar';
import { TripBottomSheet } from '@/components/route/trip-bottom-sheet';
import AppDialog from '@/components/general/app-dialog';
import { useRouteStops } from '@/hooks/use-route-stops';
import { openWazeNavigation, getWazeUrls } from '@/lib/waze-navigation';
import { colors } from '@/styles/colors';

const ROUTE_ID = 'route-1';
const TRIP_TYPE: 'pickup' | 'dropoff' = 'pickup';

const MOCK_CURRENT_LOCATION = {
  latitude: -30.0346,
  longitude: -51.2177,
};

const MOCK_NEXT_STOP_LOCATION = {
  latitude: -30.0378,
  longitude: -51.2232,
};

const MOCK_NEXT_STOP = {
  id: 'stop-1',
  address: 'Av. Bento Gonçalves, 500',
};

const MOCK_PASSENGER = {
  id: 'passenger-1',
  name: 'Mateus Cunha',
  avatarUrl: undefined,
  phoneNumber: '51999999999',
};

type TripStatus = 'driving' | 'arrival' | 'stopCompleted' | 'completed';

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
  const insets = useSafeAreaInsets();
  const [navigationMenuOpen, setNavigationMenuOpen] = useState(false);
  const [tripStatus, setTripStatus] = useState<TripStatus>('driving');
  const [activeDialog, setActiveDialog] = useState<ActiveDialog>(null);

  const { stops, currentStopId, setCurrentStopId } = useRouteStops({ routeId: ROUTE_ID });

  const routeStops = useMemo(() => stops.filter((stop) => stop.type === 'stop'), [stops]);

  const currentStopIndex = useMemo(
    () => routeStops.findIndex((stop) => stop.id === currentStopId),
    [routeStops, currentStopId],
  );

  const currentStop = currentStopIndex >= 0 ? routeStops[currentStopIndex] : routeStops[0];

  const nextStop = currentStop;

  useEffect(() => {
    if (tripStatus !== 'driving') return;

    const arrivalTimeout = setTimeout(() => {
      setTripStatus('arrival');
    }, 5000);

    return () => clearTimeout(arrivalTimeout);
  }, [tripStatus, currentStopId]);

  const bottomPadding = Math.max(24, insets.bottom);
  const sheetMaxHeight = 570 + bottomPadding;
  const sheetMinHeight = 310;
  const sheetMaxTranslateY = sheetMaxHeight - sheetMinHeight;

  const sheetTranslateY = useSharedValue(sheetMaxTranslateY);

  const floatingButtonsStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetTranslateY.value }],
  }));

  const handleBackPress = () => {
    router.push('/driver-home');
  };

  const handleNavigationPress = () => {
    setNavigationMenuOpen((current) => !current);
  };

  const handleRecenterPress = () => undefined;

  const handleSkipStop = () => {
    setActiveDialog('skipStop');
  };

  const advanceToNextStop = () => {
    const nextRouteStop = routeStops[currentStopIndex + 1];

    if (!nextRouteStop) {
      setTripStatus('completed');
      setActiveDialog('routeFinished');
      return;
    }

    setCurrentStopId(nextRouteStop.id);
    setTripStatus('driving');
    setActiveDialog(null);
  };

  const closeDialog = () => {
    setActiveDialog(null);
  };

  const handleOpenWaze = async () => {
    setNavigationMenuOpen(false);

    const lat = nextStop?.latitude;
    const lng = nextStop?.longitude;
    let opened = false;

    if (typeof lat === 'number' && typeof lng === 'number') {
      opened = await openWazeNavigation({ latitude: lat, longitude: lng });
    } else {
      const nextStopAddress = nextStop?.address?.trim();

      if (!nextStopAddress) {
        Alert.alert('Navegação', 'Não foi possível identificar a próxima parada.');
        return;
      }

      opened = await openWazeNavigation({ address: nextStopAddress });
    }

    if (!opened) {
      const urls = getWazeUrls({
        latitude: lat ?? undefined,
        longitude: lng ?? undefined,
        address: nextStop?.address ?? undefined,
      });

      const webUrl = urls.find((url) => url.startsWith('https://'));

      Alert.alert(
        'Navegação',
        'Não foi possível abrir o Waze neste dispositivo. Deseja abrir a versão web?',
        [
          {
            text: 'Abrir Waze Web',
            onPress: () => {
              if (webUrl) {
                Linking.openURL(webUrl);
              } else {
                Alert.alert('Navegação', 'URL de fallback não disponível.');
              }
            },
          },
          { text: 'Cancelar', style: 'cancel' },
        ],
      );
    }
  };

  const dialogConfig = {
    confirmPickup: {
      title: 'Confirmar embarque?',
      description: 'O passageiro será marcado como embarcado.',
      confirmLabel: 'Confirmar',
      confirmVariant: 'default' as const,
      onConfirm: advanceToNextStop,
    },
    confirmDropoff: {
      title: 'Confirmar desembarque?',
      description: 'O passageiro será marcado como entregue.',
      confirmLabel: 'Confirmar',
      confirmVariant: 'default' as const,
      onConfirm: advanceToNextStop,
    },
    confirmAbsence: {
      title: 'Confirmar ausência?',
      description: 'O passageiro não embarcou e será marcado como ausente.',
      confirmLabel: 'Confirmar',
      confirmVariant: 'destructive' as const,
      onConfirm: advanceToNextStop,
    },
    confirmNotDropoff: {
      title: 'Confirmar não desembarque?',
      description: 'O passageiro será marcado como não entregue.',
      confirmLabel: 'Confirmar',
      confirmVariant: 'destructive' as const,
      onConfirm: advanceToNextStop,
    },
    skipStop: {
      title: 'Pular parada?',
      description:
        'O passageiro desta parada não será embarcado.\nA rota seguirá para o próximo destino.',
      confirmLabel: 'Pular',
      confirmVariant: 'destructive' as const,
      onConfirm: advanceToNextStop,
    },
    routeFinished: {
      title: 'Rota finalizada!',
      description: 'Todas as paradas foram concluídas com sucesso.',
      confirmLabel: 'Ok',
      confirmVariant: 'default' as const,
      onConfirm: closeDialog,
    },
  };

  const currentDialog = activeDialog ? dialogConfig[activeDialog] : null;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.screen}>
        <ActiveRouteMap
          currentLocation={MOCK_CURRENT_LOCATION}
          nextStopLocation={MOCK_NEXT_STOP_LOCATION}
          onRecenterPress={handleRecenterPress}
          containerStyle={styles.map}
          recenterButtonStyle={[styles.recenterButtonPosition, floatingButtonsStyle]}
        />

        <View style={styles.topBarContainer}>
          <RouteTopBar onBackPress={handleBackPress} showMenu={false} />
        </View>

        <Animated.View pointerEvents="box-none" style={[styles.fabContainer, floatingButtonsStyle]}>
          <NavigationFab
            isOpen={navigationMenuOpen}
            onToggle={handleNavigationPress}
            onWazePress={handleOpenWaze}
          />
        </Animated.View>

        {currentStop && (
          <TripBottomSheet
            nextStop={{
              id: currentStop.id,
              address: currentStop.address,
            }}
            passenger={{
              id: currentStop.id,
              name: currentStop.passengerName ?? 'Passageiro',
              avatarUrl: undefined,
              phoneNumber: '51999999999',
            }}
            timeRemaining={tripStatus === 'arrival' ? 0 : 6}
            estimatedArrival="18h43"
            distance="1.4km"
            onSkipStop={handleSkipStop}
            translateY={sheetTranslateY}
            stopArrival={
              tripStatus === 'arrival'
                ? {
                    tripType: TRIP_TYPE,
                    countdownSeconds: 120,
                    onConfirmPress: () =>
                      setActiveDialog(TRIP_TYPE === 'pickup' ? 'confirmPickup' : 'confirmDropoff'),
                    onAbsentPress: () =>
                      setActiveDialog(
                        TRIP_TYPE === 'pickup' ? 'confirmAbsence' : 'confirmNotDropoff',
                      ),
                  }
                : undefined
            }
          />
        )}

        {currentDialog && (
          <AppDialog
            visible={Boolean(currentDialog)}
            title={currentDialog.title}
            description={currentDialog.description}
            onRequestClose={closeDialog}
            actions={
              activeDialog === 'routeFinished'
                ? [
                    {
                      label: currentDialog.confirmLabel,
                      onPress: currentDialog.onConfirm,
                      variant: currentDialog.confirmVariant,
                    },
                  ]
                : [
                    {
                      label: 'Cancelar',
                      onPress: closeDialog,
                      variant: 'cancel',
                      icon: 'close',
                    },
                    {
                      label: currentDialog.confirmLabel,
                      onPress: currentDialog.onConfirm,
                      variant: currentDialog.confirmVariant,
                      icon: activeDialog === 'skipStop' ? 'chevron-double-right' : 'check',
                    },
                  ]
            }
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
});
