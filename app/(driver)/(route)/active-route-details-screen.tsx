import { EmptyState } from '@/components/general/empty-state';
import { PrimaryButton } from '@/components/general/primary-button';
import { RoutePassengerSection } from '@/components/route/passenger/route-passenger-section';
import { RouteHeroHeader } from '@/components/route/route-hero-header';
import { RouteStopList, type Stop } from '@/components/route/route-stop-list';
import { RouteTopBar } from '@/components/route/route-top-bar';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import type { AddressResponse, RoutePassangerResponse, StopResponse } from '@/types/route.types';
import type { PassengerStatus } from '@/components/route/passenger/route-passenger-card';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

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
  currentStopId?: string,
): (Stop & { isCurrent?: boolean })[] {
  const sortedStops = [...stops].sort((a, b) => a.order_index - b.order_index);

  return [
    {
      id: `origin-${origin.id}`,
      type: 'origin',
      address: formatAddress(origin),
    },
    ...sortedStops.map<Stop & { isCurrent?: boolean }>((stop) => {
      const passanger = passangerByRpId.get(stop.route_passanger_id);
      return {
        id: stop.route_passanger_id,
        type: 'stop',
        passengerName: passanger ? pickPassangerName(passanger) : undefined,
        address: formatAddress(stop.address),
        isCurrent: stop.route_passanger_id === currentStopId,
      };
    }),
    {
      id: `destination-${destination.id}`,
      type: 'destination',
      address: formatAddress(destination),
    },
  ];
}

export default function DriverActiveRouteDetailsScreen() {
  const router = useRouter();
  const { routeId, tripId } = useLocalSearchParams<{ routeId: string; tripId: string }>();
  const { height: screenHeight } = useWindowDimensions();
  const heroHeight = Math.max(320, Math.min(420, Math.round(screenHeight * 0.42)));

  const isRouteLoading = false;
  const isRouteError = false;

  // TODO: Substituir mocks e integrar com dados reais
  const route: any = {
    name: 'PUCRS',
    recurrence: 'seg, qua, sex',
    expected_time: '07:30-08:00',
    duration_minutes: 32,
    distance_km: 10,
    origin_address: {
      id: 'addr-initial',
      street: 'Av. Protásio Alves',
      number: '3500',
      neighborhood: 'Petrópolis',
      city: 'Porto Alegre',
      state: 'RS',
      zip_code: '',
    },
    destination_address: {
      id: 'addr-final',
      street: 'PUCRS - Av. Ipiranga',
      number: '6681',
      neighborhood: 'Partenon',
      city: 'Porto Alegre',
      state: 'RS',
      zip_code: '',
    },
  };
  const stops: StopResponse[] = [
    {
      id: 'stop-1',
      route_passanger_id: 'rp-1',
      order_index: 1,
      type: 'embarque',
      address_id: 'addr-1',
      address: {
        id: 'addr-1',
        label: 'Casa do Bernardo',
        street: 'Rua Carazinho',
        number: '500',
        neighborhood: '',
        zip: '',
        city: 'Porto Alegre',
        state: 'RS',
        longitude: null,
        latitude: null,
      },
    },
    {
      id: 'stop-2',
      route_passanger_id: 'rp-2',
      order_index: 2,
      type: 'embarque',
      address_id: 'addr-2',
      address: {
        id: 'addr-2',
        label: 'Casa do Mateus',
        street: 'Av. Nilo Peçanha',
        number: '1200',
        neighborhood: '',
        zip: '',
        city: 'Porto Alegre',
        state: 'RS',
        longitude: null,
        latitude: null,
      },
    },
    {
      id: 'stop-3',
      route_passanger_id: 'rp-3',
      order_index: 3,
      type: 'embarque',
      address_id: 'addr-3',
      address: {
        id: 'addr-3',
        label: 'Casa do Miguel',
        street: 'Rua Silva Só',
        number: '900',
        neighborhood: '',
        zip: '',
        city: 'Porto Alegre',
        state: 'RS',
        longitude: null,
        latitude: null,
      },
    },
  ];
  const passangers: RoutePassangerResponse[] = [
    {
      id: 'rp-1',
      route_id: routeId,
      status: 'boarded',
      user_id: 'user-1',
      user_name: 'Bernardo',
      user_phone: '',
      photo_url: '',
      pickup_address_id: 'addr-1',
      requested_at: '',
      joined_at: '',
      guardian_name: '',
    },
    {
      id: 'rp-2',
      route_id: routeId,
      status: 'next',
      user_id: 'user-2',
      user_name: 'Mateus',
      user_phone: '',
      photo_url: '',
      pickup_address_id: 'addr-2',
      requested_at: '',
      joined_at: '',
      guardian_name: '',
    },
    {
      id: 'rp-3',
      route_id: routeId as string,
      status: 'pending',
      user_id: 'user-3',
      user_name: 'Miguel',
      user_phone: '',
      photo_url: '',
      pickup_address_id: 'addr-3',
      requested_at: '',
      joined_at: '',
      guardian_name: '',
    },
  ];
  const currentStopId = 'rp-2';
  const tripDirection: 'ida' | 'volta' = 'ida';
  const deliveredCount = 1;
  const totalPassangersCount = 3;

  const handleOnBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/driver-home' as never);
    }
  };

  const handleNavigationCTA = () => {
    router.push({
      pathname: '/driver-active-route' as never,
      params: { tripId },
    });
  };

  const passangerByRpId = useMemo(() => {
    const map = new Map<string, RoutePassangerResponse>();
    passangers.forEach((p) => map.set(p.id, p));
    return map;
  }, [passangers]);

  const stopsForView = useMemo(() => {
    if (!route) return [];
    return buildUiStops(route.origin_address, route.destination_address, stops, passangerByRpId);
  }, [route, passangerByRpId]);

  const cardPassangers = useMemo(() => {
    return passangers.map((p) => ({
      name: pickPassangerName(p),
      avatarUrl: p.photo_url ?? undefined,
      status: p.status as PassengerStatus,
      phase: tripDirection === 'ida' ? 'pickup' : 'dropoff',
    }));
  }, [passangers, tripDirection]);

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
          <EmptyState icon="schedule" text="Carregando os detalhes da viagem..." />
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
            text="Não foi possível carregar a viagem. Toque para tentar novamente."
          />
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
          showMenu={false}
          backgroundColor="transparent"
          style={styles.topBarOverlay}
        />
      </View>

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

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainerWithCTA}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.stopsSection}>
          <Text style={[styles.sectionTitle, styles.sectionHPadding]}>Paradas</Text>
          <RouteStopList stops={stopsForView} currentStopId={currentStopId} />
        </View>

        <View style={styles.passengersBlock}>
          <View style={[styles.passengerHeader, styles.sectionHPadding]}>
            <View style={styles.passengerTitleRow}>
              <Text style={styles.sectionTitle}>Passageiros</Text>
            </View>
            <Text style={styles.passengerCount}>
              {deliveredCount}/{totalPassangersCount}{' '}
              {tripDirection === 'ida' ? 'Entregues' : 'Entregues'}{' '}
            </Text>
          </View>

          {cardPassangers.length === 0 ? (
            <View style={styles.sectionHPadding}>
              <EmptyState icon="group" text="Nenhum passageiro nesta viagem." />
            </View>
          ) : (
            <RoutePassengerSection
              passengers={cardPassangers}
              phase={tripDirection === 'ida' ? 'pickup' : 'dropoff'}
            />
          )}
        </View>
      </ScrollView>

      <View style={styles.ctaFloating}>
        <PrimaryButton
          label="Navegação"
          onPress={handleNavigationCTA}
          style={styles.ctaButton}
          labelColor={colors.white}
          icon={<MaterialIcons name="arrow-forward" size={20} color={colors.white} />}
        />
      </View>
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
  contentContainerWithCTA: {
    paddingBottom: 120,
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
    marginBottom: 8,
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
    backgroundColor: colors.dark,
  },
  feedbackWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 16,
  },
});
