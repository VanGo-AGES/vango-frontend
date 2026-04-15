import { useQuery } from '@tanstack/react-query';

import { listVehicles } from '@/services/vehicle.service';

export const VEHICLE_QUERY_KEY = ['vehicle'];

/**
 * Busca o veículo do motorista logado.
 * O backend retorna uma lista; pegamos o primeiro item pois cada motorista
 * tem no máximo um veículo nesta versão do app.
 */
export function useVehicle() {
  return useQuery({
    queryKey: VEHICLE_QUERY_KEY,
    queryFn: listVehicles,
    select: (vehicles) => vehicles[0] ?? null,
  });
}
