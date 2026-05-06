import { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { AppScreenContainer } from '@/components/general/app-screen-container';
import { AppSnackbar } from '@/components/general/app-snackbar';
import { EmptyState } from '@/components/general/empty-state';
import { PrimaryButton } from '@/components/general/primary-button';
import { RouteTopBar } from '@/components/route/route-top-bar';
import { RouteHeroHeader } from '@/components/route/route-hero-header';
import { RouteStopList, type Stop } from '@/components/route/route-stop-list';
import AppDialog, { type DialogAction } from '@/components/general/app-dialog';

import { ApiError } from '@/services/api';
import { splitStopsByAbsence } from '@/services/route.service';
import { useLeaveRoute } from '@/hooks/use-leave-route';
import { usePassangerRouteAbsences } from '@/hooks/use-passanger-route-absences';
import { usePassangerRouteDetail } from '@/hooks/use-passanger-route-detail';
import { useReportAbsence } from '@/hooks/use-report-absence';
import { getPassangerCTA } from '@/lib/passanger-route-cta';
import { useSessionStore } from '@/store/session.store';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

type CtaKind = 'avisar-ausencia' | 'acompanhar-viagem' | 'none';

const MOCK_DURATION_MINUTES = 45;
const MOCK_DISTANCE_KM = 12.5;

function normalizeParam(value?: string | string[]): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function formatAddressLine(
  address?: { label: string; street: string; number: string } | null,
): string {
  if (!address) {
    return '';
  }

  return [address.label, address.street, address.number].filter(Boolean).join(' - ');
}

function getPassengerErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 409) {
      return typeof error.detail === 'string'
        ? error.detail
        : 'Não foi possível concluir esta ação.';
    }

    if (error.status === 403) {
      return 'Você não tem permissão para acessar esta rota.';
    }

    if (error.status === 404) {
      return 'A rota solicitada não foi encontrada.';
    }
  }

  return 'Não foi possível carregar os dados da rota.';
}

function getAbsenceErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 409) {
      return typeof error.detail === 'string'
        ? error.detail
        : 'Não foi possível registrar a ausência para hoje.';
    }

    if (error.status === 403) {
      return 'Você não é um passageiro ativo desta rota.';
    }
  }

  return 'Não foi possível registrar a ausência.';
}

function getLeaveRouteErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.status === 409) {
    return 'Não é possível sair de uma rota em andamento.';
  }

  return 'Não foi possível sair da rota.';
}

export default function PassengerRouteDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    routeId?: string | string[];
    dependentId?: string | string[];
  }>();
  const routeId = normalizeParam(params.routeId);
  const dependentId = normalizeParam(params.dependentId);
  const { height: screenHeight } = useWindowDimensions();
  const heroHeight = Math.max(320, Math.min(420, Math.round(screenHeight * 0.42)));

  const sessionUser = useSessionStore((state) => state.user);
  const [absenceReported, setAbsenceReported] = useState(false);
  const [absenceDialogVisible, setAbsenceDialogVisible] = useState(false);
  const [leaveDialogVisible, setLeaveDialogVisible] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const { route, isLoading, isError, refetch, error } = usePassangerRouteDetail({
    routeId,
    dependentId,
  });
  const { data: absences = [] } = usePassangerRouteAbsences({
    routeId,
    recurrence: route?.recurrence,
  });
  const leaveRouteMutation = useLeaveRoute(routeId ?? '', dependentId);
  const reportAbsenceMutation = useReportAbsence(routeId ?? '', dependentId);

  // Verifica se já existe ausência registrada para hoje nos dados da API,
  // usando user_id + dependent_id. Isso garante que o botão permaneça
  // oculto mesmo após navegação (quando absenceReported volta para false).
  const hasAlreadyReportedAbsence = absences.some(
    (a) => a.user_id === sessionUser?.id && (a.dependent_id ?? null) === (dependentId ?? null),
  );

  const ctaKind: CtaKind =
    route && !absenceReported && !hasAlreadyReportedAbsence
      ? getPassangerCTA(
          route.status,
          route.membership_status,
          route.current_trip_id,
          route.recurrence,
        )
      : 'none';

  const handleBack = () => {
    router.back();
  };

  const handleAccompanyTrip = () => {
    if (!route?.current_trip_id) {
      return;
    }

    // TODO: navegar para o fluxo de acompanhamento da viagem quando existir
  };

  const handleAbsencePress = () => {
    setAbsenceDialogVisible(true);
  };

  const handleConfirmAbsence = async () => {
    if (!routeId) {
      return;
    }

    try {
      await reportAbsenceMutation.mutateAsync(undefined);
      setAbsenceReported(true);
      setAbsenceDialogVisible(false);
    } catch (err) {
      setAbsenceDialogVisible(false);
      setFeedbackMessage(getAbsenceErrorMessage(err));
    }
  };

  const handleLeaveRoute = async () => {
    if (!routeId) {
      return;
    }

    try {
      await leaveRouteMutation.mutateAsync();
      setLeaveDialogVisible(false);
    } catch (err) {
      setLeaveDialogVisible(false);
      setFeedbackMessage(getLeaveRouteErrorMessage(err));
    }
  };

  const handleLeavePress = () => setLeaveDialogVisible(true);

  const handleRetry = () => {
    refetch();
  };

  const handleDismissFeedback = () => {
    setFeedbackMessage(null);
  };

  const renderCTA = () => {
    if (!route || absenceReported || hasAlreadyReportedAbsence) {
      return null;
    }

    if (ctaKind === 'none') {
      return null;
    }

    if (ctaKind === 'acompanhar-viagem') {
      return (
        <PrimaryButton
          label="Acompanhar viagem"
          onPress={handleAccompanyTrip}
          icon={<MaterialIcons name="arrow-forward" size={24} color={colors.light} />}
          variant="secondary"
          style={styles.ctaButton}
        />
      );
    }

    return (
      <PrimaryButton
        label="Avisar ausência"
        onPress={handleAbsencePress}
        variant="warning"
        icon={<MaterialIcons name="error-outline" size={18} color={colors.light} />}
        style={styles.ctaButton}
      />
    );
  };

  const absenceDialogActions: DialogAction[] = [
    {
      label: 'Cancelar',
      onPress: () => setAbsenceDialogVisible(false),
      variant: 'cancel',
    },
    {
      label: 'Avisar ausência',
      onPress: handleConfirmAbsence,
      variant: 'destructive',
    },
  ];

  const leaveDialogActions: DialogAction[] = [
    {
      label: 'Cancelar',
      onPress: () => setLeaveDialogVisible(false),
      variant: 'cancel',
    },
    {
      label: 'Sair',
      onPress: handleLeaveRoute,
      variant: 'destructive',
    },
  ];

  const renderContent = () => {
    if (isLoading || !routeId) {
      return (
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color={colors.dark} />
        </View>
      );
    }

    if (isError || !route) {
      return (
        <View style={styles.stateContainer}>
          <EmptyState
            icon="error-outline"
            text={error ? getPassengerErrorMessage(error) : 'Não foi possível carregar a rota.'}
          />
          <PrimaryButton
            label="Tentar novamente"
            onPress={handleRetry}
            style={styles.retryButton}
          />
        </View>
      );
    }

    const presentStops = splitStopsByAbsence(route.stops, absences).present;
    const sortedStops = [...presentStops].sort((a, b) => a.order_index - b.order_index);

    const stops: Stop[] = [
      {
        id: route.origin_address.id,
        type: 'origin',
        address: formatAddressLine(route.origin_address),
      },
      ...sortedStops.map((stop) => ({
        id: stop.id,
        type: 'stop' as const,
        address: formatAddressLine(stop.address),
      })),
      {
        id: route.destination_address.id,
        type: 'destination',
        address: formatAddressLine(route.destination_address),
      },
    ];

    const ctaElement = renderCTA();

    return (
      <>
        <View style={styles.heroSection}>
          <RouteHeroHeader
            routeName={route.name}
            recurrence={route.recurrence.join(', ')}
            expectedTime={route.expected_time}
            durationMinutes={MOCK_DURATION_MINUTES}
            distanceKm={MOCK_DISTANCE_KM}
            style={[styles.heroHeader, { minHeight: heroHeight }]}
          />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          scrollIndicatorInsets={{ right: 1 }}
          showsVerticalScrollIndicator={true}
        >
          <View style={styles.stopsSection}>
            <Text style={styles.sectionTitle}>Próxima partida</Text>
            <RouteStopList stops={stops} />
          </View>
        </ScrollView>

        {ctaElement ? <View style={styles.ctaContainer}>{ctaElement}</View> : null}

        <AppDialog
          visible={absenceDialogVisible}
          title="Avisar ausência?"
          description="Você não participará desta viagem e o motorista será notificado. Essa ação não poderá ser desfeita."
          actions={absenceDialogActions}
          onRequestClose={() => setAbsenceDialogVisible(false)}
        />

        <AppDialog
          visible={leaveDialogVisible}
          title="Sair da rota?"
          description="Essa ação não pode ser desfeita."
          actions={leaveDialogActions}
          onRequestClose={() => setLeaveDialogVisible(false)}
        />
      </>
    );
  };

  return (
    <AppScreenContainer edges={['bottom']} style={styles.container}>
      <View style={styles.topBarContainer}>
        <RouteTopBar
          onBackPress={handleBack}
          variant="passenger"
          showMenu={!!route && route.status !== 'em_andamento'}
          onLeavePress={handleLeavePress}
          backgroundColor="transparent"
          style={styles.topBarOverlay}
        />
      </View>

      {renderContent()}

      <AppSnackbar
        visible={!!feedbackMessage}
        message={feedbackMessage ?? ''}
        onDismiss={handleDismissFeedback}
      />
    </AppScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 16,
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
  heroSection: {
    position: 'relative',
  },
  heroHeader: {
    width: '100%',
  },
  stopsSection: {
    marginVertical: 24,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.dark,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  ctaContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  ctaButton: {
    alignSelf: 'stretch',
    width: '100%',
  },
  stateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 24,
  },
  retryButton: {
    alignSelf: 'stretch',
    width: '100%',
  },
});
