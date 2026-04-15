import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createVehicle } from '@/services/vehicle.service';
import { VEHICLE_QUERY_KEY } from '@/hooks/use-vehicle';
import type { CreateVehicleRequest } from '@/types/vehicle.types';

export function useCreateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVehicleRequest) => createVehicle(data),
    onSuccess: (newVehicle) => {
      queryClient.setQueryData(VEHICLE_QUERY_KEY, [newVehicle]);
    },
  });
}
