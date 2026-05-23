import { useState } from 'react';
import { Stop } from '@/components/route/route-stop-list';

type UseRouteStopsParams = {
  routeId: string;
};

type UseRouteStopsReturn = {
  stops: Stop[];
  currentStopId: string | undefined;
  isLoading: boolean;
  error: string | null;
  deleteStop: (stopId: string) => void;
  setCurrentStopId: (stopId: string | undefined) => void;
};

export function useRouteStops({ routeId }: UseRouteStopsParams): UseRouteStopsReturn {
  // Dados para teste
  const MOCK_STOPS: Stop[] = [
    {
      id: 'origin-1',
      type: 'origin',
      address: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP',
      latitude: -23.56321,
      longitude: -46.65425,
    },
    {
      id: 'stop-1',
      type: 'stop',
      passengerName: 'Ana Costa',
      address: 'Rua Augusta, 500 - Consolação, São Paulo - SP',
      latitude: -23.55052,
      longitude: -46.64834,
    },
    {
      id: 'stop-2',
      type: 'stop',
      passengerName: 'Bruno Mendes',
      address: 'Rua Oscar Freire, 200 - Jardins, São Paulo - SP',
      latitude: -23.56456,
      longitude: -46.6621,
    },
    {
      id: 'stop-3',
      type: 'stop',
      passengerName: 'Carla Dias',
      address: 'Alameda Santos, 45 - Cerqueira César, São Paulo - SP',
      latitude: -23.57318,
      longitude: -46.65266,
    },
    {
      id: 'destination-1',
      type: 'destination',
      address: 'Av. Faria Lima, 3000 - Itaim Bibi, São Paulo - SP',
      latitude: -23.58655,
      longitude: -46.6747,
    },
  ];

  // TODO: substituir pelo estado real quando integrar com o back
  const [stops, setStops] = useState<Stop[]>(MOCK_STOPS);
  const [currentStopId, setCurrentStopId] = useState<string | undefined>('stop-1');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TODO: buscar paradas do back
  // useEffect(() => {
  //   setIsLoading(true);
  //   api.get(`/routes/${routeId}/stops`)
  //     .then((data) => setStops(data))
  //     .catch(() => setError('Erro ao carregar paradas'))
  //     .finally(() => setIsLoading(false));
  // }, [routeId]);

  const deleteStop = (stopId: string) => {
    // TODO: chamar o back antes de remover localmente
    // await api.delete(`/routes/${routeId}/stops/${stopId}`);
    setStops((prev) => prev.filter((stop) => stop.id !== stopId));
  };

  return {
    stops,
    currentStopId,
    isLoading,
    error,
    deleteStop,
    setCurrentStopId,
  };
}
