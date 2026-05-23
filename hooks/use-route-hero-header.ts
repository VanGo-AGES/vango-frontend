import { useQuery } from '@tanstack/react-query';
import { getRouteById } from '@/services/route.service';
import { useSessionStore } from '@/store/session.store';

export type RouteHeroHeaderData = {
  routeName: string;
  recurrence: string[];
  expectedTime: string;
  durationMinutes: number;
  distanceKm: number;
  origin_address?: { latitude: number; longitude: number };
  destination_address?: { latitude: number; longitude: number };
};

type UseRouteHeroHeaderParams = {
  routeId: string;
};

export function useRouteHeroHeader({ routeId }: UseRouteHeroHeaderParams) {
  const sessionUser = useSessionStore((state) => state.user);

  const query = useQuery({
    queryKey: ['route-hero-header', routeId],
    queryFn: () => getRouteById(routeId),
    enabled: !!sessionUser?.id && !!routeId,
  });

  const mappedData: RouteHeroHeaderData | null = query.data
    ? {
        routeName: query.data.name,
        recurrence: query.data.recurrence.split(',').map((d) => d.trim()),
        expectedTime: query.data.expected_time,
        durationMinutes: query.data.duration_minutes ?? 30,
        distanceKm: query.data.distance_km ?? 10,

        origin_address:
          query.data.origin_address?.latitude && query.data.origin_address?.longitude
            ? {
                latitude: query.data.origin_address.latitude,
                longitude: query.data.origin_address.longitude,
              }
            : undefined,

        destination_address:
          query.data.destination_address?.latitude && query.data.destination_address?.longitude
            ? {
                latitude: query.data.destination_address.latitude,
                longitude: query.data.destination_address.longitude,
              }
            : undefined,
      }
    : null;

  return {
    data: mappedData,
    isLoading: query.isLoading,
    error: query.error ? 'Erro ao carregar rota' : null,
  };
}
