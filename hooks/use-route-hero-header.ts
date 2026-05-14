import { useState } from 'react';
import type { ImageSourcePropType } from 'react-native';

type RouteHeroHeaderData = {
  routeName: string;
  recurrence: string[];
  expectedTime: string;
  durationMinutes: number;
  distanceKm: number;
  backgroundImage?: ImageSourcePropType;
};

// Mock, deletar quando fizer a integração
const MOCK_ROUTE: RouteHeroHeaderData = {
  routeName: 'Rota teste',
  recurrence: ['Sab'],
  expectedTime: '8:30',
  durationMinutes: 40,
  distanceKm: 10,
};

type UseRouteHeroHeaderParams = {
  routeId: string;
};

type UseRouteHeroHeaderReturn = {
  data: RouteHeroHeaderData | null;
  isLoading: boolean;
  error: string | null;
};

export function useRouteHeroHeader({
  routeId,
}: UseRouteHeroHeaderParams): UseRouteHeroHeaderReturn {
  const [data] = useState<RouteHeroHeaderData | null>(MOCK_ROUTE);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  // TODO: buscar dados do back
  // useEffect(() => {
  //   setIsLoading(true);
  //   api.get(`/routes/${routeId}`)
  //     .then((data) => setData(data))
  //     .catch(() => setError('Erro ao carregar rota'))
  //     .finally(() => setIsLoading(false));
  // }, [routeId]);

  return { data, isLoading, error };
}
