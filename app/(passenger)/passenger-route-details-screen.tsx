import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { RouteTopBar } from '@/components/route/route-top-bar';
import { RouteHeroHeader } from '@/components/route/route-hero-header';
import { RouteStopList, type Stop } from '@/components/route/route-stop-list';
import { PrimaryButton } from '@/components/general/primary-button';
import AppDialog, { type DialogAction } from '@/components/general/app-dialog';
import { AppScreenContainer } from '@/components/general/app-screen-container';

import { colors } from '@/styles/colors';

type AbsenceStatus = 'not_notified' | 'notified';
type TripStatus = 'before_trip' | 'during_trip' | 'after_trip';

/**
 * Estados do CTA principal:
 * 1. Antes da viagem / participação ativa (before_trip + not_notified):
 *    exibir botão "Avisar ausência" (variant="warning")
 *
 * 2. Durante a viagem / participando normalmente (during_trip + not_notified):
 *    exibir botão "Acompanhar viagem"
 *
 * 3. Após avisar ausência (any + notified):
 *    ocultar CTA (preparado para lógica futura)
 */
export default function PassengerRouteDetailsScreen() {
  const router = useRouter();

  // Estados da rota (idealmente viriam de contexto/hook da API)
  const [absenceStatus, setAbsenceStatus] = useState<AbsenceStatus>('not_notified');
  const [tripStatus, setTripStatus] = useState<TripStatus>('before_trip');

  // Estados dos diálogos
  const [absenceDialogVisible, setAbsenceDialogVisible] = useState(false);
  const [leaveDialogVisible, setLeaveDialogVisible] = useState(false);

  // Dados mockados (idealmente viriam de params/hook da API)
  const mockRoute = {
    id: '1',
    name: 'Centro → Zona Norte',
    recurrence: 'Segunda a sexta',
    expectedTime: '07:30',
    durationMinutes: 45,
    distanceKm: 12.5,
  };

  const mockStops: Stop[] = [
    {
      id: '1',
      type: 'origin',
      address: 'Rua das Flores, 123 - Centro',
    },
    {
      id: '2',
      type: 'stop',
      passengerName: 'João Silva',
      address: 'Av. Paulista, 1000 - Bela Vista',
    },
    {
      id: '3',
      type: 'stop',
      passengerName: 'Maria Santos',
      address: 'Rua Augusta, 500 - Centro',
    },
    {
      id: '4',
      type: 'destination',
      address: 'Av. Brasil, 2000 - Zona Norte',
    },
  ];

  const handleAbsencePress = () => {
    setAbsenceDialogVisible(true);
  };

  const handleConfirmAbsence = async () => {
    setAbsenceDialogVisible(false);
    setAbsenceStatus('notified');
    // TODO: Chamar API para avisar ausência
    // await useUpdatePassengerAbsenceStatus(routeId, true);
  };

  const handleLeaveRoute = async () => {
    setLeaveDialogVisible(false);
    // TODO: Chamar API para sair da rota
    // await useLeaveRoute(routeId);
    router.back();
  };

  const handleLeavePress = () => {
    setLeaveDialogVisible(true);
  };

  const handleAccompanyTrip = () => {
    // TODO: Navegar para fluxo de acompanhamento
    // router.push('/(passenger)/accompany-trip');
  };

  const handleBack = () => {
    router.back();
  };

  const renderCTA = () => {
    // Após avisar ausência: ocultar CTA (ou adaptar conforme regra futura)
    if (absenceStatus === 'notified') {
      return null;
    }

    if (tripStatus === 'during_trip') {
      return (
        <PrimaryButton label="Acompanhar viagem" onPress={handleAccompanyTrip} variant="primary" />
      );
    }

    return <PrimaryButton label="Avisar ausência" onPress={handleAbsencePress} variant="warning" />;
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

  return (
    <AppScreenContainer backgroundColor={colors.light} style={styles.container}>
      <RouteTopBar
        onBackPress={handleBack}
        variant="passenger"
        showMenu
        onLeavePress={handleLeavePress}
      />

      <ScrollView
        style={styles.content}
        scrollIndicatorInsets={{ right: 1 }}
        showsVerticalScrollIndicator={true}
      >
        <RouteHeroHeader
          routeName={mockRoute.name}
          recurrence={mockRoute.recurrence}
          expectedTime={mockRoute.expectedTime}
          durationMinutes={mockRoute.durationMinutes}
          distanceKm={mockRoute.distanceKm}
        />

        <View style={styles.stopsSection}>
          <Text style={styles.sectionTitle}>Paradas da rota</Text>
          <RouteStopList stops={mockStops} />
        </View>

        <View style={styles.ctaSection}>{renderCTA()}</View>
      </ScrollView>

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
    </AppScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  stopsSection: {
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 16,
  },
  ctaSection: {
    marginVertical: 24,
    paddingBottom: 32,
  },
});
