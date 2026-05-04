import { useState } from 'react';
import {
  type PassengerStatus,
  type RoutePassengerCardProps,
  type PassengerPhase,
} from '@/components/route/passenger/route-passenger-card';

type Passenger = Omit<RoutePassengerCardProps, 'phase'>;

// Dados mockados para teste, pode deletar ao realizar a integração
const MOCK_PASSENGERS: Passenger[] = [
  { name: 'Ana Costa', status: 'confirmed' },
  { name: 'Bruno Mendes', status: 'absent' },
  { name: 'Carla Dias', status: 'none' },
  { name: 'Diego Rocha', avatarUrl: 'https://i.pravatar.cc/100?u=diego', status: 'confirmed' },
  { name: 'Eva Lima', status: 'absent' },
  { name: 'Felipe Souza', avatarUrl: 'https://i.pravatar.cc/100?u=felipe', status: 'none' },
  { name: 'Gabriela Nunes', status: 'confirmed' },
];

type UseRoutePassengersParams = {
  routeId: string;
  phase: PassengerPhase;
};

type UseRoutePassengersReturn = {
  passengers: Passenger[];
  isLoading: boolean;
  error: string | null;
  updatePassengerStatus: (name: string, status: PassengerStatus) => void;
};

export function useRoutePassengers({
  routeId,
  phase,
}: UseRoutePassengersParams): UseRoutePassengersReturn {
  const [passengers, setPassengers] = useState<Passenger[]>(MOCK_PASSENGERS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TODO: buscar passageiros do back
  // useEffect(() => {
  //   setIsLoading(true);
  //   api.get(`/routes/${routeId}/passengers?phase=${phase}`)
  //     .then((data) => setPassengers(data))
  //     .catch(() => setError('Erro ao carregar passageiros'))
  //     .finally(() => setIsLoading(false));
  // }, [routeId, phase]);

  const updatePassengerStatus = (name: string, status: PassengerStatus) => {
    // TODO: chamar o back antes de atualizar localmente
    // await api.patch(`/routes/${routeId}/passengers/${name}/status`, { status });
    setPassengers((prev) => prev.map((p) => (p.name === name ? { ...p, status } : p)));
  };

  return {
    passengers,
    isLoading,
    error,
    updatePassengerStatus,
  };
}
