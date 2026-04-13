import { useMutation } from '@tanstack/react-query';

import { createVehicle } from '@/services/vehicle.service';
import type { CreateVehicleRequest } from '@/types/vehicle.types';

export function useCreateVehicle(userId: string) {
  return useMutation({
    mutationFn: (data: CreateVehicleRequest) => createVehicle(data, userId),
  });
}
