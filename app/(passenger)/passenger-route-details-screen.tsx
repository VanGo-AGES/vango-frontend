import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { RouteTopBar } from '@/components/route/route-top-bar';
import { RouteHeroHeader } from '@/components/route/route-hero-header';
import { RouteStopList, type Stop } from '@/components/route/route-stop-list';
import { PrimaryButton } from '@/components/general/primary-button';
import AppDialog, { type DialogAction } from '@/components/general/app-dialog';

import { colors } from '@/styles/colors';

type AbsenceStatus = 'not_notified' | 'notified';
type TripStatus = 'before_trip' | 'during_trip' | 'after_trip';

export default function PassengerRouteDetailsScreen() {
  const router = useRouter();
  const { height: screenHeight } = useWindowDimensions();
  const heroHeight = Math.max(320, Math.min(420, Math.round(screenHeight * 0.42)));

  const [absenceStatus, setAbsenceStatus] = useState<AbsenceStatus>('not_notified');
  const [tripStatus, setTripStatus] = useState<TripStatus>('before_trip');

  const [absenceDialogVisible, setAbsenceDialogVisible] = useState(false);
  const [leaveDialogVisible, setLeaveDialogVisible] = useState(false);

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
    // TODO: chamar API para avisar ausencia
  };

  const handleLeaveRoute = async () => {
    setLeaveDialogVisible(false);
    // TODO: chamar API para sair da rota
    router.back();
  };

  const handleLeavePress = () => {
    setLeaveDialogVisible(true);
  };

  const handleAccompanyTrip = () => {
    // TODO: navegar para fluxo de acompanhamento
  };

  const handleBack = () => {
    router.back();
  };

  const renderCTA = () => {
    // CTA oculto quando o passageiro ja avisou ausencia.
    if (absenceStatus === 'notified') {
      return null;
    }

    if (tripStatus === 'after_trip') {
      return null;
    }

    if (tripStatus === 'during_trip') {
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

  const cta = renderCTA();

  return (
    <View style={[styles.container, styles.screen]}>
      <View style={styles.topBarContainer}>
        <RouteTopBar
          onBackPress={handleBack}
          variant="passenger"
          showMenu={tripStatus !== 'during_trip'}
          onLeavePress={handleLeavePress}
          backgroundColor="transparent"
          style={styles.topBarOverlay}
        />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={[
          styles.contentContainer,
          cta ? styles.contentContainerWithCTA : null,
        ]}
        scrollIndicatorInsets={{ right: 1 }}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.heroSection}>
          <RouteHeroHeader
            routeName={mockRoute.name}
            recurrence={mockRoute.recurrence}
            expectedTime={mockRoute.expectedTime}
            durationMinutes={mockRoute.durationMinutes}
            distanceKm={mockRoute.distanceKm}
            style={[styles.heroHeader, { minHeight: heroHeight }]}
          />
        </View>

        <View style={styles.stopsSection}>
          <Text style={styles.sectionTitle}>Paradas da rota</Text>
          <RouteStopList stops={mockStops} />
        </View>
      </ScrollView>

      {cta ? <View style={styles.ctaFloating}>{cta}</View> : null}

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    backgroundColor: colors.light,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
    paddingTop: 0,
  },
  contentContainerWithCTA: {
    paddingBottom: 180,
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
    marginBottom: 16,
  },
  heroHeader: {
    width: '100%',
  },
  stopsSection: {
    marginVertical: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 16,
  },
  ctaFloating: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 44,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  ctaButton: {
    alignSelf: 'stretch',
    width: '100%',
  },
});
