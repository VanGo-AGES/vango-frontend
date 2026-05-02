import AppDialog, { type DialogAction } from '@/components/general/app-dialog';
import { EmptyState } from '@/components/general/empty-state';
import { PrimaryButton } from '@/components/general/primary-button';
import { RoutePassengerSection } from '@/components/route/passenger/route-passenger-section';
import { RouteAbsentList, type RouteAbsentItem } from '@/components/route/route-absent-list';
import { RouteHeroHeader } from '@/components/route/route-hero-header';
import { RouteStopList, type Stop } from '@/components/route/route-stop-list';
import { RouteTopBar } from '@/components/route/route-top-bar';
import { useDeleteRoute } from '@/hooks/use-delete-route';
import { useRemovePassanger } from '@/hooks/use-remove-passanger';
import { useRouteAbsences } from '@/hooks/use-route-absences';
import { useRouteDetail } from '@/hooks/use-route-detail';
import { useRoutePassangers } from '@/hooks/use-route-passangers';
import { isRouteToday, splitStopsByAbsence } from '@/services/route.service';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import type { PassengerStatus } from '@/components/route/passenger/route-passenger-card';
import type {
  AddressResponse,
  RouteAbsenceResponse,
  RoutePassangerResponse,
  StopResponse,
} from '@/types/route.types';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
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

function buildAbsentItems(
  absentStops: StopResponse[],
  absences: RouteAbsenceResponse[],
): RouteAbsentItem[] {
  const absenceByRpId = new Map<string, RouteAbsenceResponse>();
  absences.forEach((absence) => absenceByRpId.set(absence.route_passanger_id, absence));

  return absentStops.map((stop) => {
    const absence = absenceByRpId.get(stop.route_passanger_id);
    const name = absence?.dependent_name ?? absence?.user_name ?? 'Passageiro ausente';
    return {
      id: stop.route_passanger_id,
      name,
      reason: absence?.reason ?? null,
    };
  });
}

function mapPassangerStatusToCard(status: RoutePassangerResponse['status']): PassengerStatus {
  if (status === 'accepted') {
    return 'confirmed';
  }
  return 'none';
}

export default function RouteDetailsScreen() {
  const router = useRouter();
  const { routeId } = useLocalSearchParams<{ routeId: string }>();
  const { height: screenHeight } = useWindowDimensions();
  const heroHeight = Math.max(320, Math.min(420, Math.round(screenHeight * 0.42)));

  const {
    data: route,
    isLoading: isRouteLoading,
    isError: isRouteError,
    refetch: refetchRoute,
  } = useRouteDetail(routeId);

  const recurrence = route?.recurrence;
  const isToday = recurrence ? isRouteToday(recurrence) : false;
  const isInProgress = route?.status === 'em_andamento';

  const { data: passangers = [], isLoading: isPassangersLoading } = useRoutePassangers(routeId);
  const { data: absences = [] } = useRouteAbsences({ routeId, recurrence });

  const passangerByRpId = useMemo(() => {
    const map = new Map<string, RoutePassangerResponse>();
    passangers.forEach((p) => map.set(p.id, p));
    return map;
  }, [passangers]);

  const { presentStops, absentStops } = useMemo(() => {
    if (!route) {
      return { presentStops: [], absentStops: [] };
    }
    const { present, absent } = splitStopsByAbsence(route.stops, absences);
    return { presentStops: present, absentStops: absent };
  }, [route, absences]);

  const stopsForView = useMemo<Stop[]>(() => {
    if (!route) {
      return [];
    }

    const stops = isToday ? presentStops : route.stops;
    return buildUiStops(route.origin_address, route.destination_address, stops, passangerByRpId);
  }, [route, isToday, presentStops, passangerByRpId]);

  const absentItems = useMemo(
    () => buildAbsentItems(absentStops, absences),
    [absentStops, absences],
  );

  const cardPassangers = useMemo(
    () =>
      passangers.map((p) => ({
        name: pickPassangerName(p),
        status: mapPassangerStatusToCard(p.status),
      })),
    [passangers],
  );

  const confirmedCount = useMemo(
    () => passangers.filter((p) => p.status === 'accepted').length,
    [passangers],
  );

  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const [pendingDeleteRpId, setPendingDeleteRpId] = useState<string | null>(null);

  const deleteRouteMutation = useDeleteRoute();
  const removePassangerMutation = useRemovePassanger();

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

  const handleConfirmStartRoute = () => {
    setActiveDialog(null);
    // TODO: navegar para a tela de viagem em andamento (US futura)
    // router.push('DRIVER_TRIP_SCREEN');
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
    // TODO: navegar para a tela de gerenciamento de passageiros (US futura)
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
            // TODO: navegar para a tela de edição de rota quando ela existir (US futura).
          }}
          onDeletePress={() => setActiveDialog('delete_route')}
          showMenu={showActionMenu}
          backgroundColor="transparent"
          style={styles.topBarOverlay}
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
        <View style={styles.heroSection}>
          <RouteHeroHeader
            routeName={route.name}
            recurrence={formatRecurrenceLabel(route.recurrence)}
            expectedTime={formatExpectedTime(route.expected_time)}
            durationMinutes={route.duration_minutes ?? FALLBACK_DURATION_MINUTES}
            distanceKm={route.distance_km ?? FALLBACK_DISTANCE_KM}
            style={[styles.heroHeader, { minHeight: heroHeight }]}
          />
        </View>

        <View style={styles.stopsSection}>
          <Text style={[styles.sectionTitle, styles.sectionHPadding]}>
            {isToday ? 'Próxima partida' : 'Paradas'}
          </Text>
          <RouteStopList
            stops={stopsForView}
            onDeleteStopPress={isInProgress ? undefined : handleDeleteStopPress}
          />
        </View>

        {isToday && absentItems.length > 0 ? (
          <View style={styles.absentSection}>
            <Text style={[styles.sectionTitle, styles.sectionHPadding]}>Ausentes hoje</Text>
            <RouteAbsentList items={absentItems} />
          </View>
        ) : null}

        <View style={styles.section}>
          <TouchableOpacity onPress={handleNavigateToPassengers} activeOpacity={0.7}>
            <View style={styles.passengerHeader}>
              <View style={styles.passengerTitleRow}>
                <Text style={styles.sectionTitle}>Passageiros</Text>
                <MaterialIcons name="chevron-right" size={20} color={colors.dark} />
              </View>
              <Text style={styles.passengerCount}>
                {confirmedCount}/{route.max_passengers} Confirmados
              </Text>
            </View>
          </TouchableOpacity>

          {isPassangersLoading ? (
            <EmptyState icon="schedule" text="Carregando passageiros..." />
          ) : cardPassangers.length === 0 ? (
            <EmptyState icon="group" text="Nenhum passageiro nessa rota ainda." />
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
  absentSection: {
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
