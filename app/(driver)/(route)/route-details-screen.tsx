import AppDialog, { type DialogAction } from '@/components/general/app-dialog';
import { EmptyState } from '@/components/general/empty-state';
import { PrimaryButton } from '@/components/general/primary-button';
import { RoutePassengerSection } from '@/components/route/passenger/route-passenger-section';
import { RouteHeroHeader } from '@/components/route/route-hero-header';
import { RouteStopList, type Stop } from '@/components/route/route-stop-list';
import { RouteTopBar } from '@/components/route/route-top-bar';
import { useDeleteRoute } from '@/hooks/use-delete-route';
import { useRemovePassanger } from '@/hooks/use-remove-passanger';
import { useRouteAbsences } from '@/hooks/use-route-absences';
import { useRouteDetail } from '@/hooks/use-route-detail';
import { useRoutePassangers } from '@/hooks/use-route-passangers';
import { useStartTrip } from '@/hooks/use-start-trip';
import { useVehicle } from '@/hooks/use-vehicle';
import { ApiError } from '@/services/api';
import { isRouteToday, splitStopsByAbsence } from '@/services/route.service';
import { getDriverCurrentTrip } from '@/services/trip.service';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import type { PassengerStatus } from '@/components/route/passenger/route-passenger-card';
import type { AddressResponse, RoutePassangerResponse, StopResponse } from '@/types/route.types';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

type DialogType = 'start_route' | 'delete_route' | 'delete_stop' | null;

const FALLBACK_DURATION_MINUTES = 30;
const FALLBACK_DISTANCE_KM = 10;
const MOCK_ORIGIN = { latitude: -30.0277, longitude: -51.1632 }; // Shopping Iguatemi
const MOCK_DESTINATION = { latitude: -30.0495, longitude: -51.2287 }; // Shopping Praia de Belas

function formatRecurrenceLabel(recurrence: string): string {
  return recurrence
    .split(',')
    .map((day) => day.trim())
    .filter(Boolean)
    .map((day) => day.charAt(0).toUpperCase() + day.slice(1))
    .join(' • ');
}

function formatExpectedTime(value: string): string {
  return value.length >= 5 ? value.slice(0, 5) : value;
}

function formatAddress(address: AddressResponse): string {
  return [address.street, address.number].filter(Boolean).join(', ');
}

function pickPassangerName(p: RoutePassangerResponse): string {
  return p.dependent_name ?? p.user_name;
}

function buildUiStops(
  origin: AddressResponse,
  destination: AddressResponse,
  stops: StopResponse[],
  passangerByRpId: Map<string, RoutePassangerResponse>,
): Stop[] {
  const sortedStops = [...stops].sort((a, b) => a.order_index - b.order_index);

  return [
    {
      id: `origin-${origin.id}`,
      type: 'origin',
      address: formatAddress(origin),
    },
    ...sortedStops.map<Stop>((stop) => {
      const passanger = passangerByRpId.get(stop.route_passanger_id);
      return {
        id: stop.route_passanger_id,
        type: 'stop',
        passengerName: passanger ? pickPassangerName(passanger) : undefined,
        address: formatAddress(stop.address),
      };
    }),
    {
      id: `destination-${destination.id}`,
      type: 'destination',
      address: formatAddress(destination),
    },
  ];
}

function mapPassangerStatusToCard(
  passanger: RoutePassangerResponse,
  absentRpIds: Set<string>,
): PassengerStatus {
  if (passanger.status !== 'accepted') {
    return 'none';
  }
  if (absentRpIds.has(passanger.id)) {
    return 'absent';
  }
  return 'confirmed';
}

export default function RouteDetailsScreen() {
  const router = useRouter();
  const { routeId } = useLocalSearchParams<{ routeId: string }>();
  const { height: screenHeight } = useWindowDimensions();
  const heroHeight = Math.max(220, Math.min(300, Math.round(screenHeight * 0.3)));

  const {
    data: route,
    isLoading: isRouteLoading,
    isError: isRouteError,
    refetch: refetchRoute,
  } = useRouteDetail(routeId);

  const recurrence = route?.recurrence;
  const isToday = recurrence ? isRouteToday(recurrence) : false;
  const isInProgress = route?.status === 'em_andamento';

  const {
    data: passangers = [],
    isLoading: isPassangersLoading,
    refetch: refetchPassangers,
  } = useRoutePassangers(routeId);
  const { data: absences = [] } = useRouteAbsences({ routeId, recurrence });

  // Refaz o fetch sempre que a tela ganha foco — garante que novas
  // solicitações de passageiros apareçam sem precisar sair e voltar.
  useFocusEffect(
    useCallback(() => {
      refetchRoute();
      refetchPassangers();
    }, [refetchRoute, refetchPassangers]),
  );

  const passangerByRpId = useMemo(() => {
    const map = new Map<string, RoutePassangerResponse>();
    passangers.forEach((p: RoutePassangerResponse) => map.set(p.id, p));
    return map;
  }, [passangers]);

  const presentStops = useMemo(() => {
    if (!route) {
      return [];
    }
    return splitStopsByAbsence(route.stops, absences).present;
  }, [route, absences]);

  const stopsForView = useMemo<Stop[]>(() => {
    if (!route) {
      return [];
    }

    return buildUiStops(
      route.origin_address,
      route.destination_address,
      presentStops,
      passangerByRpId,
    );
  }, [route, presentStops, passangerByRpId]);

  const absentRpIds = useMemo(
    () => new Set(absences.map((absence) => absence.route_passanger_id)),
    [absences],
  );

  const acceptedPassangers = useMemo(
    () => passangers.filter((p: RoutePassangerResponse) => p.status === 'accepted'),
    [passangers],
  );

  const hasPendingPassengers = useMemo(
    () => passangers.some((p: RoutePassangerResponse) => p.status === 'pending'),
    [passangers],
  );

  const totalAcceptedCount = acceptedPassangers.length;

  const confirmedCount = useMemo(
    () => acceptedPassangers.filter((p: RoutePassangerResponse) => !absentRpIds.has(p.id)).length,
    [acceptedPassangers, absentRpIds],
  );

  const cardPassangers = useMemo(
    () =>
      acceptedPassangers.map((p: RoutePassangerResponse) => ({
        name: pickPassangerName(p),
        avatarUrl: p.photo_url ?? undefined,
        status: mapPassangerStatusToCard(p, absentRpIds),
      })),
    [acceptedPassangers, absentRpIds],
  );

  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const [pendingDeleteRpId, setPendingDeleteRpId] = useState<string | null>(null);

  const deleteRouteMutation = useDeleteRoute();
  const removePassangerMutation = useRemovePassanger();
  const startTripMutation = useStartTrip();
  const { data: vehicle } = useVehicle();

  const showStartRouteCta = isToday && !isInProgress;
  const showActionMenu = !isInProgress;

  const handleOnBackPress = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/driver-home');
  };

  const handleDeleteStopPress = (rpId: string) => {
    setPendingDeleteRpId(rpId);
    setActiveDialog('delete_stop');
  };

  const handleConfirmDeleteStop = () => {
    if (!routeId || !pendingDeleteRpId) {
      setActiveDialog(null);
      return;
    }

    removePassangerMutation.mutate(
      { routeId, rpId: pendingDeleteRpId },
      {
        onSettled: () => {
          setPendingDeleteRpId(null);
          setActiveDialog(null);
        },
      },
    );
  };

  const navigateToActiveTrip = (tripId: string) => {
    if (!routeId) {
      return;
    }
    router.replace({
      pathname: '/(driver)/(route)/active-route-details-screen' as never,
      params: { routeId, tripId },
    });
  };

  const handleStartTripError = async (error: unknown) => {
    if (!(error instanceof ApiError)) {
      Alert.alert('Erro', 'Não foi possível iniciar a rota. Tente novamente.');
      return;
    }

    if (error.status === 403) {
      Alert.alert(
        'Veículo inválido',
        'O veículo selecionado não pode ser usado nesta rota. Verifique seu cadastro de veículo.',
      );
      return;
    }

    if (error.status === 409) {
      // 409 pode ser viagem em andamento ou falta de passageiros. Se houver
      // viagem atual, navega pra ela; senão, cai no aviso abaixo.
      try {
        const currentTrip = routeId ? await getDriverCurrentTrip(routeId) : null;
        if (currentTrip?.trip_id) {
          navigateToActiveTrip(currentTrip.trip_id);
          return;
        }
      } catch {
        // sem viagem recuperável
      }

      Alert.alert(
        'Não foi possível iniciar',
        'Esta rota ainda não possui passageiros confirmados para a viagem.',
      );
      return;
    }

    Alert.alert('Erro', 'Não foi possível iniciar a rota. Tente novamente.');
  };

  const handleConfirmStartRoute = () => {
    setActiveDialog(null);

    if (!routeId) {
      return;
    }

    if (!vehicle?.id) {
      Alert.alert(
        'Cadastre um veículo',
        'Você precisa ter um veículo cadastrado para iniciar uma rota.',
      );
      return;
    }

    startTripMutation.mutate(
      { routeId, data: { vehicle_id: vehicle.id } },
      {
        onSuccess: (trip) => navigateToActiveTrip(trip.id),
        onError: (error) => {
          void handleStartTripError(error);
        },
      },
    );
  };

  const handleConfirmDeleteRoute = () => {
    if (!routeId) {
      setActiveDialog(null);
      return;
    }

    deleteRouteMutation.mutate(routeId, {
      onSuccess: () => {
        setActiveDialog(null);
        if (router.canGoBack()) {
          router.back();
          return;
        }
        router.replace('/driver-home');
      },
      onError: () => {
        setActiveDialog(null);
      },
    });
  };

  const handleNavigateToPassengers = () => {
    if (!routeId) {
      return;
    }

    router.push({
      pathname: '/(driver)/(route)/route-passengers-screen' as never,
      params: { routeId },
    });
  };

  const startRouteDialogActions: DialogAction[] = [
    { label: 'Cancelar', onPress: () => setActiveDialog(null), variant: 'cancel', icon: 'close' },
    { label: 'Iniciar', onPress: handleConfirmStartRoute, variant: 'default', icon: 'check' },
  ];

  const deleteRouteDialogActions: DialogAction[] = [
    { label: 'Cancelar', onPress: () => setActiveDialog(null), variant: 'cancel', icon: 'close' },
    { label: 'Excluir', onPress: handleConfirmDeleteRoute, variant: 'destructive', icon: 'delete' },
  ];

  const deleteStopDialogActions: DialogAction[] = [
    { label: 'Cancelar', onPress: () => setActiveDialog(null), variant: 'cancel', icon: 'close' },
    { label: 'Excluir', onPress: handleConfirmDeleteStop, variant: 'destructive', icon: 'delete' },
  ];

  if (isRouteLoading) {
    return (
      <View style={styles.screen}>
        <View style={styles.topBarContainer}>
          <RouteTopBar
            variant="driver"
            onBackPress={handleOnBackPress}
            backgroundColor="transparent"
            showMenu={false}
            style={styles.topBarOverlay}
          />
        </View>
        <View style={styles.feedbackWrapper}>
          <EmptyState icon="schedule" text="Carregando os detalhes da rota..." />
        </View>
      </View>
    );
  }

  if (isRouteError || !route) {
    return (
      <View style={styles.screen}>
        <View style={styles.topBarContainer}>
          <RouteTopBar
            variant="driver"
            onBackPress={handleOnBackPress}
            backgroundColor="transparent"
            showMenu={false}
            style={styles.topBarOverlay}
          />
        </View>
        <View style={styles.feedbackWrapper}>
          <EmptyState
            icon="error-outline"
            text="Não foi possível carregar a rota. Toque para tentar novamente."
          />
          <TouchableOpacity
            onPress={() => refetchRoute()}
            accessibilityRole="button"
            style={styles.retryButton}
          >
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.topBarContainer}>
        <RouteTopBar
          variant="driver"
          onBackPress={handleOnBackPress}
          onEditPress={() => {
            router.push({
              pathname: '/(driver)/(route)/edit-route-screen' as never,
              params: { routeId },
            });
          }}
          onDeletePress={() => setActiveDialog('delete_route')}
          showMenu={showActionMenu}
          backgroundColor="transparent"
          style={styles.topBarOverlay}
        />
      </View>

      <View style={styles.heroSection}>
        <RouteHeroHeader
          routeName={route.name}
          recurrence={formatRecurrenceLabel(route.recurrence)}
          expectedTime={formatExpectedTime(route.expected_time)}
          durationMinutes={route.estimated_duration_min ?? FALLBACK_DURATION_MINUTES}
          distanceKm={route.total_distance_km ?? FALLBACK_DISTANCE_KM}
          origin={
            route.origin_address?.latitude && route.origin_address?.longitude
              ? {
                  latitude: route.origin_address.latitude,
                  longitude: route.origin_address.longitude,
                }
              : MOCK_ORIGIN
          }
          destination={
            route.destination_address?.latitude && route.destination_address?.longitude
              ? {
                  latitude: route.destination_address.latitude,
                  longitude: route.destination_address.longitude,
                }
              : MOCK_DESTINATION
          }
          style={[styles.heroHeader, { minHeight: heroHeight }]}
        />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={[
          styles.contentContainer,
          showStartRouteCta && styles.contentContainerWithCTA,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.stopsSection}>
          <Text style={[styles.sectionTitle, styles.sectionHPadding]}>Próxima partida</Text>
          <RouteStopList
            stops={stopsForView}
            onDeleteStopPress={isInProgress ? undefined : handleDeleteStopPress}
          />
        </View>

        <View style={styles.passengersBlock}>
          <TouchableOpacity
            onPress={handleNavigateToPassengers}
            activeOpacity={0.7}
            style={styles.sectionHPadding}
          >
            <View style={styles.passengerHeader}>
              <View style={styles.passengerTitleRow}>
                <Text style={styles.sectionTitle}>Passageiros</Text>

                {hasPendingPassengers && (
                  <MaterialIcons
                    name="warning"
                    size={18}
                    color={colors.destructive}
                    style={styles.warningIcon}
                  />
                )}

                <MaterialIcons name="chevron-right" size={20} color={colors.dark} />
              </View>
              <Text style={styles.passengerCount}>
                {confirmedCount}/{totalAcceptedCount} Confirmados
              </Text>
            </View>
          </TouchableOpacity>

          {isPassangersLoading ? (
            <View style={styles.sectionHPadding}>
              <EmptyState icon="schedule" text="Carregando passageiros..." />
            </View>
          ) : cardPassangers.length === 0 ? (
            <View style={styles.sectionHPadding}>
              <EmptyState icon="group" text="Nenhum passageiro nessa rota ainda." />
            </View>
          ) : (
            <RoutePassengerSection passengers={cardPassangers} phase="pre_trip" />
          )}
        </View>
      </ScrollView>

      {showStartRouteCta && (
        <View style={styles.ctaFloating}>
          <PrimaryButton
            label="Iniciar rota"
            onPress={() => setActiveDialog('start_route')}
            style={styles.ctaButton}
            labelColor={colors.white}
            icon={<MaterialIcons name="check" size={20} color={colors.white} />}
          />
        </View>
      )}

      <AppDialog
        visible={activeDialog === 'start_route'}
        title="Iniciar rota?"
        description="Os passageiros serão notificados e a rota será iniciada. Não será possível editar paradas ou passageiros durante a viagem."
        actions={startRouteDialogActions}
        onRequestClose={() => setActiveDialog(null)}
      />

      <AppDialog
        visible={activeDialog === 'delete_route'}
        title="Excluir rota?"
        description="Essa ação não pode ser desfeita e removerá todos os passageiros."
        actions={deleteRouteDialogActions}
        onRequestClose={() => setActiveDialog(null)}
      />

      <AppDialog
        visible={activeDialog === 'delete_stop'}
        title="Excluir parada?"
        description="A parada será excluída da rota e o passageiro removido. Essa ação não pode ser desfeita."
        actions={deleteStopDialogActions}
        onRequestClose={() => setActiveDialog(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.light,
  },
  topBarContainer: {
    position: 'absolute',
    top: 52,
    left: 4,
    right: 4,
    zIndex: 10,
  },
  topBarOverlay: {
    maxWidth: '100%',
    alignSelf: 'stretch',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  contentContainerWithCTA: {
    paddingBottom: 180,
  },
  heroSection: {
    marginBottom: 16,
  },
  heroHeader: {
    width: '100%',
  },
  stopsSection: {
    paddingTop: 24,
    gap: 12,
  },
  sectionHPadding: {
    paddingHorizontal: 16,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 12,
  },
  passengersBlock: {
    paddingTop: 24,
    gap: 12,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.dark,
  },
  passengerHeader: {
    gap: 2,
  },
  passengerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningIcon: {
    marginLeft: 6,
  },
  passengerCount: {
    ...typography.small,
    color: colors.subtleText,
  },
  ctaFloating: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 44,
    paddingHorizontal: 16,
  },
  ctaButton: {
    alignSelf: 'stretch',
  },
  feedbackWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 16,
  },
  retryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.accent,
  },
  retryText: {
    ...typography.bodyBold,
    color: colors.dark,
  },
});
