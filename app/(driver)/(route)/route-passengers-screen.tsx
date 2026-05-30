import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { AppScreenContainer } from '@/components/general/app-screen-container';
import AppDialog from '@/components/general/app-dialog';
import { AppSnackbar } from '@/components/general/app-snackbar';
import { EmptyState } from '@/components/general/empty-state';
import { ActionPillButton } from '@/components/route/action-pill-button';
import { RouteTopBar } from '@/components/route/route-top-bar';
import {
  RoutePassengerList,
  type ManagedPassenger,
} from '@/components/route/passenger/route-passenger-list';
import { RouteRequestList, type RouteRequest } from '@/components/route/route-request-list';
import { useAcceptRequest } from '@/hooks/use-accept-request';
import { useRejectRequest } from '@/hooks/use-reject-request';
import { useRemovePassanger } from '@/hooks/use-remove-passanger';
import { useRouteDetail } from '@/hooks/use-route-detail';
import { useRoutePassangers } from '@/hooks/use-route-passangers';
import { ApiError } from '@/services/api';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import type { RoutePassangerResponse } from '@/types/route.types';

type DialogType = 'removePassenger' | 'removeRequest' | 'maxCapacity' | null;
const APPROVAL_SELECTION_DELAY_MS = 2000;

function getPassangerName(passanger: RoutePassangerResponse): string {
  return passanger.dependent_name ?? passanger.user_name;
}

function mapManagedPassenger(passanger: RoutePassangerResponse): ManagedPassenger {
  return {
    id: passanger.id,
    name: getPassangerName(passanger),
    avatarUrl: passanger.photo_url ?? undefined,
  };
}

function mapRouteRequest(passanger: RoutePassangerResponse): RouteRequest {
  return {
    id: passanger.id,
    name: getPassangerName(passanger),
    avatarUrl: passanger.photo_url ?? undefined,
    guardianName: passanger.guardian_name ?? undefined,
  };
}

function isCapacityError(error: unknown): boolean {
  if (!(error instanceof ApiError) || error.status !== 409) {
    return false;
  }

  const detail =
    typeof error.detail === 'string' ? error.detail : JSON.stringify(error.detail ?? '');

  return /capacity|capacidade|RouteCapacityExceededError/i.test(detail);
}

export default function RoutePassengersScreen() {
  const router = useRouter();
  const { routeId } = useLocalSearchParams<{ routeId: string }>();

  const {
    data: route,
    isLoading: isRouteLoading,
    isError: isRouteError,
    refetch: refetchRoute,
  } = useRouteDetail(routeId);
  const {
    data: passangers = [],
    isLoading: isPassangersLoading,
    isError: isPassangersError,
    refetch: refetchPassangers,
  } = useRoutePassangers(routeId);

  // Refaz o fetch sempre que a tela ganha foco — garante que novas
  // solicitações de passageiros apareçam sem precisar sair e voltar.
  useFocusEffect(
    useCallback(() => {
      refetchPassangers();
      refetchRoute();
    }, [refetchPassangers, refetchRoute]),
  );

  const acceptRequestMutation = useAcceptRequest();
  const rejectRequestMutation = useRejectRequest();
  const removePassangerMutation = useRemovePassanger();

  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [approvingRequestIds, setApprovingRequestIds] = useState<Set<string>>(() => new Set());
  const approvalTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const acceptedPassangers = useMemo(
    () => passangers.filter((p: RoutePassangerResponse) => p.status === 'accepted'),
    [passangers],
  );

  const pendingPassangers = useMemo(
    () => passangers.filter((p: RoutePassangerResponse) => p.status === 'pending'),
    [passangers],
  );

  const passengers = useMemo(
    () => acceptedPassangers.map(mapManagedPassenger),
    [acceptedPassangers],
  );

  const requests = useMemo(
    () =>
      pendingPassangers.map((passanger: RoutePassangerResponse) => ({
        ...mapRouteRequest(passanger),
        checked: approvingRequestIds.has(passanger.id),
      })),
    [pendingPassangers, approvingRequestIds],
  );

  const selectedPassenger = passengers.find((p) => p.id === selectedId);
  const acceptedCount = passengers.length;
  const capacity = route?.max_passengers ?? 0;
  const isInProgress = route?.status === 'em_andamento';
  const isInitialLoading = isRouteLoading || isPassangersLoading;
  const hasInitialError = isRouteError || isPassangersError || !route;
  const actionsDisabled =
    isInProgress ||
    acceptRequestMutation.isPending ||
    rejectRequestMutation.isPending ||
    removePassangerMutation.isPending;

  useEffect(() => {
    const timers = approvalTimers.current;

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const showGenericError = () => {
    showSnackbar('Não foi possível concluir a ação. Tente novamente.');
  };

  const clearApprovalSelection = (id: string) => {
    const timer = approvalTimers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      approvalTimers.current.delete(id);
    }

    setApprovingRequestIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleRetry = () => {
    refetchRoute();
    refetchPassangers();
  };

  const handleRemovePassengerPress = (id: string) => {
    setSelectedId(id);
    setDialogType('removePassenger');
  };

  const handleConfirmRemovePassenger = () => {
    if (!routeId || !selectedId || removePassangerMutation.isPending) return;

    removePassangerMutation.mutate(
      { routeId, rpId: selectedId },
      {
        onSuccess: () => {
          setDialogType(null);
          setSelectedId(null);
          showSnackbar('Passageiro removido com sucesso!');
        },
        onError: showGenericError,
      },
    );
  };

  const handleRemoveRequestPress = (id: string) => {
    setSelectedId(id);
    setDialogType('removeRequest');
  };

  const handleConfirmRemoveRequest = () => {
    if (!routeId || !selectedId || rejectRequestMutation.isPending) return;

    clearApprovalSelection(selectedId);

    rejectRequestMutation.mutate(
      { routeId, rpId: selectedId },
      {
        onSuccess: () => {
          setDialogType(null);
          setSelectedId(null);
          showSnackbar('Solicitação removida com sucesso!');
        },
        onError: showGenericError,
      },
    );
  };

  const handleApproveRequest = (id: string) => {
    if (!routeId || !route) return;

    if (approvingRequestIds.has(id) || approvalTimers.current.has(id)) {
      return;
    }

    if (acceptedCount + approvingRequestIds.size >= route.max_passengers) {
      setDialogType('maxCapacity');
      return;
    }

    setApprovingRequestIds((prev) => new Set(prev).add(id));

    const timer = setTimeout(() => {
      approvalTimers.current.delete(id);

      acceptRequestMutation.mutate(
        { routeId, rpId: id },
        {
          onSuccess: () => {
            showSnackbar('Passageiro adicionado na rota com sucesso!');
          },
          onError: (error) => {
            if (isCapacityError(error)) {
              setDialogType('maxCapacity');
              return;
            }
            showGenericError();
          },
          onSettled: () => {
            setApprovingRequestIds((prev) => {
              const next = new Set(prev);
              next.delete(id);
              return next;
            });
          },
        },
      );
    }, APPROVAL_SELECTION_DELAY_MS);

    approvalTimers.current.set(id, timer);
  };

  const handleNavigateToInviteCode = () => {
    if (!route?.invite_code) return;

    router.push({
      pathname: '/(driver)/(route)/route-invite-code-screen',
      params: { inviteCode: route.invite_code },
    });
  };

  const handleDismissDialog = () => {
    setDialogType(null);
    setSelectedId(null);
  };

  if (isInitialLoading) {
    return (
      <AppScreenContainer
        backgroundColor={colors.light}
        edges={['top', 'bottom']}
        style={styles.container}
      >
        <RouteTopBar onBackPress={() => router.back()} />
        <View style={styles.feedbackWrapper}>
          <EmptyState icon="schedule" text="Carregando passageiros..." />
        </View>
      </AppScreenContainer>
    );
  }

  if (hasInitialError) {
    return (
      <AppScreenContainer
        backgroundColor={colors.light}
        edges={['top', 'bottom']}
        style={styles.container}
      >
        <RouteTopBar onBackPress={() => router.back()} />
        <View style={styles.feedbackWrapper}>
          <EmptyState
            icon="error-outline"
            text="Não foi possível carregar os passageiros. Toque para tentar novamente."
          />
          <TouchableOpacity
            onPress={handleRetry}
            accessibilityRole="button"
            style={styles.retryButton}
          >
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </AppScreenContainer>
    );
  }

  return (
    <AppScreenContainer
      backgroundColor={colors.white}
      edges={['top', 'bottom']}
      style={styles.container}
      disableKeyboardDismiss
    >
      <RouteTopBar onBackPress={() => router.back()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <RoutePassengerList
          passengers={passengers}
          capacity={capacity}
          onDeletePassengerPress={handleRemovePassengerPress}
          actionsDisabled={actionsDisabled}
        />

        <View style={styles.requestsSection}>
          <Text style={styles.sectionTitle}>Solicitações</Text>
          {isInProgress && (
            <Text style={styles.notice}>
              Não é possível aprovar ou remover passageiros durante uma rota em andamento.
            </Text>
          )}

          <View style={styles.buttonWrapper}>
            <ActionPillButton
              onPress={handleNavigateToInviteCode}
              label="Código da Rota"
              icon={<Feather name="upload" size={20} color={colors.dark} />}
              style={styles.codeButton}
              disabled={!route.invite_code}
            />
          </View>

          {requests.length > 0 ? (
            <RouteRequestList
              requests={requests}
              onCheckRequestPress={handleApproveRequest}
              onRemoveRequestPress={handleRemoveRequestPress}
              actionsDisabled={actionsDisabled}
            />
          ) : (
            <View style={styles.emptyRequestsWrapper}>
              <EmptyState
                icon="remove-circle-outline"
                text={
                  'Nenhuma solicitação pendente\nAs solicitações aparecerão aqui quando passageiros entrarem com o código.'
                }
              />
            </View>
          )}
        </View>
      </ScrollView>

      <AppDialog
        visible={dialogType === 'removePassenger'}
        title="Remover passageiro?"
        description={`${selectedPassenger?.name ?? 'O passageiro'} não fará mais parte da rota e sua parada será removida. Essa ação não pode ser desfeita.`}
        onRequestClose={handleDismissDialog}
        actions={[
          { label: 'Cancelar', variant: 'cancel', icon: 'close', onPress: handleDismissDialog },
          {
            label: 'Remover',
            variant: 'destructive',
            icon: 'delete-outline',
            onPress: handleConfirmRemovePassenger,
          },
        ]}
      />

      <AppDialog
        visible={dialogType === 'removeRequest'}
        title="Remover solicitação?"
        description="O passageiro não poderá entrar na rota e sua solicitação será deletada."
        onRequestClose={handleDismissDialog}
        actions={[
          { label: 'Cancelar', variant: 'cancel', icon: 'close', onPress: handleDismissDialog },
          {
            label: 'Remover',
            variant: 'destructive',
            icon: 'delete-outline',
            onPress: handleConfirmRemoveRequest,
          },
        ]}
      />

      <AppDialog
        visible={dialogType === 'maxCapacity'}
        title="Capacidade máxima de passageiros"
        description="Não foi possível adicionar um novo passageiro. Remova um passageiro da rota e tente novamente."
        onRequestClose={handleDismissDialog}
        actions={[{ label: 'Ok', variant: 'default', icon: 'check', onPress: handleDismissDialog }]}
      />

      <AppSnackbar
        visible={snackbarVisible}
        message={snackbarMessage}
        onDismiss={() => setSnackbarVisible(false)}
      />
    </AppScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  requestsSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.dark,
  },
  notice: {
    ...typography.bodyMedium,
    color: colors.subtleText,
    marginTop: 8,
  },
  buttonWrapper: {
    paddingVertical: 16,
  },
  codeButton: {
    width: '100%',
    minHeight: 48,
  },
  emptyRequestsWrapper: {
    minHeight: 180,
    justifyContent: 'center',
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
