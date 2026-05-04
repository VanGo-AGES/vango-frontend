import AppDialog, { type DialogAction } from '@/components/general/app-dialog';
import { PrimaryButton } from '@/components/general/primary-button';
import { RoutePassengerSection } from '@/components/route/passenger/route-passenger-section';
import { RouteHeroHeader } from '@/components/route/route-hero-header';
import { RouteStopList } from '@/components/route/route-stop-list';
import { RouteTopBar } from '@/components/route/route-top-bar';
import { useIsRouteDay } from '@/hooks/use-is-route-day';
import { useRouteHeroHeader } from '@/hooks/use-route-hero-header';
import { useRoutePassengers } from '@/hooks/use-route-passenger';
import { useRouteStops } from '@/hooks/use-route-stops';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

type DialogType = 'start_route' | 'delete_route' | 'delete_stop' | null;

export default function RouteDetailsScreen() {
  const router = useRouter();
  const { height: screenHeight } = useWindowDimensions();
  const heroHeight = Math.max(320, Math.min(420, Math.round(screenHeight * 0.42)));

  // Mocks
  const { data } = useRouteHeroHeader({ routeId: 'rota-123' });
  const { stops, currentStopId, deleteStop } = useRouteStops({ routeId: 'rota-123' });
  const { passengers } = useRoutePassengers({ routeId: 'rota-123', phase: 'pre_trip' });

  const isRouteDay = useIsRouteDay(data?.recurrence ?? []);

  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const [pendingDeleteStopId, setPendingDeleteStopId] = useState<string | null>(null);

  const confirmedCount = passengers.filter((p) => p.status === 'confirmed').length;
  const totalCount = passengers.length;

  const handleOnBackPress = () => {
    router.push('/driver-home');
  };

  const handleDeleteStopPress = (stopId: string) => {
    setPendingDeleteStopId(stopId);
    setActiveDialog('delete_stop');
  };

  const handleConfirmDeleteStop = () => {
    if (pendingDeleteStopId) {
      deleteStop(pendingDeleteStopId);
      setPendingDeleteStopId(null);
    }
    setActiveDialog(null);
  };

  const handleConfirmStartRoute = () => {
    setActiveDialog(null);
    // TODO: navegar para a tela de viagem em andamento
    // router.push('DRIVER_TRIP_SCREEN');
  };

  const handleConfirmDeleteRoute = () => {
    setActiveDialog(null);
    // TODO: chamar API para deletar a rota e voltar
    router.push('/driver-home');
  };

  const handleNavigateToPassengers = () => {
    // TODO: navegar para a tela de gerenciamento de passageiros
    router.push('/route-passenger-screen' as never); // Alterar quando a tela existir
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

  return (
    <View style={styles.screen}>
      <View style={styles.topBarContainer}>
        <RouteTopBar
          variant="driver"
          onBackPress={handleOnBackPress}
          onEditPress={() => router.push('/edit-route-screen' as never)} // Alterar quando a tela existir
          onDeletePress={() => setActiveDialog('delete_route')}
          backgroundColor="transparent"
          style={styles.topBarOverlay}
        />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={[
          styles.contentContainer,
          isRouteDay && styles.contentContainerWithCTA,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          {data && (
            <RouteHeroHeader
              routeName={data.routeName}
              recurrence={data.recurrence.join(', ')}
              expectedTime={data.expectedTime}
              durationMinutes={data.durationMinutes}
              distanceKm={data.distanceKm}
              backgroundImage={data.backgroundImage}
              style={[styles.heroHeader, { minHeight: heroHeight }]}
            />
          )}
        </View>

        <View style={styles.stopsSection}>
          <Text style={[styles.sectionTitle, styles.sectionHPadding]}>Paradas</Text>
          <RouteStopList
            stops={stops}
            currentStopId={currentStopId}
            onDeleteStopPress={handleDeleteStopPress}
          />
        </View>

        <View style={styles.section}>
          <TouchableOpacity onPress={handleNavigateToPassengers} activeOpacity={0.7}>
            <View style={styles.passengerHeader}>
              <View style={styles.passengerTitleRow}>
                <Text style={styles.sectionTitle}>Passageiros</Text>
                <MaterialIcons name="chevron-right" size={20} color={colors.dark} />
              </View>
              <Text style={styles.passengerCount}>
                {confirmedCount}/{totalCount} Confirmados
              </Text>
            </View>
          </TouchableOpacity>
          <RoutePassengerSection passengers={passengers} phase="pre_trip" />
        </View>
      </ScrollView>

      {isRouteDay && (
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
});
