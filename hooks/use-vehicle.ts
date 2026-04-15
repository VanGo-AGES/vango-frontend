import { useQuery } from '@tanstack/react-query';

import { listVehicles } from '@/services/vehicle.service';

export const VEHICLE_QUERY_KEY = ['vehicle'];

export function useVehicle() {
  return useQuery({
    queryKey: VEHICLE_QUERY_KEY,
    queryFn: listVehicles,
    select: (vehicles) => vehicles[0] ?? null,
  });
}
