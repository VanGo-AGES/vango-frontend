import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
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
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

const MOCK_CAPACITY = 8;

const INITIAL_PASSENGERS: ManagedPassenger[] = [
  { id: '1', name: 'Bernardo' },
  { id: '2', name: 'Júlia' },
  { id: '3', name: 'Mateus' },
  { id: '4', name: 'Nicole' },
  { id: '5', name: 'Carlos' },
];

const INITIAL_REQUESTS: RouteRequest[] = [
  { id: 'r1', name: 'Luís Dias', guardianName: 'Luciane Amaral' },
  { id: 'r2', name: 'Sara Muller' },
];

type DialogType = 'removePassenger' | 'removeRequest' | 'maxCapacity' | null;

export default function RoutePassengersScreen() {
  const router = useRouter();

  const [passengers, setPassengers] = useState<ManagedPassenger[]>(INITIAL_PASSENGERS);
  const [requests, setRequests] = useState<RouteRequest[]>(INITIAL_REQUESTS);
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleRemovePassengerPress = (id: string) => {
    setSelectedId(id);
    setDialogType('removePassenger');
  };

  const handleConfirmRemovePassenger = () => {
    if (!selectedId) return;
    setPassengers((prev) => prev.filter((p) => p.id !== selectedId));
    setDialogType(null);
    setSelectedId(null);
  };

  const handleRemoveRequestPress = (id: string) => {
    setSelectedId(id);
    setDialogType('removeRequest');
  };

  const handleConfirmRemoveRequest = () => {
    if (!selectedId) return;
    setRequests((prev) => prev.filter((r) => r.id !== selectedId));
    setDialogType(null);
    setSelectedId(null);
    showSnackbar('Solicitação removida com sucesso!');
  };

  const handleApproveRequest = (id: string) => {
    if (passengers.length >= MOCK_CAPACITY) {
      setDialogType('maxCapacity');
      return;
    }

    const request = requests.find((r) => r.id === id);
    if (!request) return;

    setRequests((prev) => prev.filter((r) => r.id !== id));
    setPassengers((prev) => [
      ...prev,
      { id: request.id, name: request.name, avatarUrl: request.avatarUrl },
    ]);
    showSnackbar('Passageiro adicionado na rota com sucesso!');
  };

  const handleDismissDialog = () => {
    setDialogType(null);
    setSelectedId(null);
  };

  const selectedPassenger = passengers.find((p) => p.id === selectedId);

  return (
    <AppScreenContainer
      backgroundColor={colors.light}
      edges={['top', 'bottom']}
      style={styles.container}
    >
      <RouteTopBar onBackPress={() => router.back()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <RoutePassengerList
          passengers={passengers}
          capacity={MOCK_CAPACITY}
          onDeletePassengerPress={handleRemovePassengerPress}
        />

        <View style={styles.requestsSection}>
          <Text style={styles.sectionTitle}>Solicitações</Text>

          <View style={styles.buttonWrapper}>
            <ActionPillButton
              onPress={() => router.push('/(driver)/(route)/route-invite-code-screen')}
              label="Código da Rota"
              icon={<Feather name="upload" size={20} color={colors.dark} />}
              style={styles.codeButton}
            />
          </View>

          {requests.length > 0 ? (
            <RouteRequestList
              requests={requests}
              onCheckRequestPress={handleApproveRequest}
              onRemoveRequestPress={handleRemoveRequestPress}
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
});
