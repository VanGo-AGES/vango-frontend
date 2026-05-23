import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { EmptyState } from '@/components/general/empty-state';
import { PrimaryButton } from '@/components/general/primary-button';
import { RouteHeroHeader } from '@/components/route/route-hero-header';
import { RouteStopList, type Stop } from '@/components/route/route-stop-list';
import { RouteTopBar } from '@/components/route/route-top-bar';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import type { AddressResponse, RoutePassangerResponse, StopResponse } from '@/types/route.types';

type RoutePassangerStopInfo = Pick<RoutePassangerResponse, 'id' | 'user_name' | 'dependent_name'>;

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

function pickPassangerName(p: RoutePassangerStopInfo): string {
  return p.dependent_name ?? p.user_name;
}

function buildUiStops(
  origin: AddressResponse,
  destination: AddressResponse,
  stops: StopResponse[],
  passangerByRpId: Map<string, RoutePassangerStopInfo>,
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

export default function PassengerActiveRouteDetailsScreen() {
  const router = useRouter();

  const { height: screenHeight } = useWindowDimensions();
  const heroHeight = Math.max(320, Math.min(420, Math.round(screenHeight * 0.42)));

  const isRouteLoading = false;
  const isRouteError = false;

  // TODO: substituir mocks por dados reais da rota em andamento
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
        label: 'Bernardo',
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
        label: 'Mateus',
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
        label: 'Miguel',
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

  const passangers: RoutePassangerStopInfo[] = [
    {
      id: 'rp-1',
      user_name: 'Bernardo',
      dependent_name: null,
    },
    {
      id: 'rp-2',
      user_name: 'Mateus',
      dependent_name: null,
    },
    {
      id: 'rp-3',
      user_name: 'Miguel',
      dependent_name: null,
    },
  ];

  const currentStopId = 'rp-2';

  const handleOnBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/passenger-home-screen' as never);
    }
  };

  const handleAccompanyTrip = () => {
    // TODO(US11-integração): passar routeId/dependentId reais quando esta tela
    // for integrada com o backend (hoje a details-screen ainda usa mocks).
    router.push('/(passenger)/passenger-active-route-screen' as never);
  };

  const passangerByRpId = new Map<string, RoutePassangerStopInfo>();
  passangers.forEach((p) => passangerByRpId.set(p.id, p));

  const stopsForView = route
    ? buildUiStops(
        route.origin_address,
        route.destination_address,
        stops,
        passangerByRpId,
        currentStopId,
      )
    : [];

  if (isRouteLoading) {
    return (
      <View style={styles.screen}>
        <View style={styles.topBarContainer}>
          <RouteTopBar
            variant="passenger"
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
            variant="passenger"
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
          variant="passenger"
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
      </ScrollView>

      <View style={styles.ctaFloating}>
        <PrimaryButton
          label="Acompanhar Viagem"
          onPress={handleAccompanyTrip}
          style={styles.ctaButton}
          labelColor={colors.white}
          icon={<MaterialIcons name="arrow-forward" size={16} color={colors.white} />}
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
    paddingBottom: 140,
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
  sectionTitle: {
    ...typography.subtitle,
    color: colors.dark,
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
