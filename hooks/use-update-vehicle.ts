import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateVehicle } from '@/services/vehicle.service';
import { VEHICLE_QUERY_KEY } from '@/hooks/use-vehicle';
import type { UpdateVehicleRequest } from '@/types/vehicle.types';

export function useUpdateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVehicleRequest }) =>
      updateVehicle(id, data),
    onSuccess: (updatedVehicle) => {
      queryClient.setQueryData(VEHICLE_QUERY_KEY, [updatedVehicle]);
    },
  });
}
