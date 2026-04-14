import { useMutation } from '@tanstack/react-query';
import { createVehicle } from '@/services/vehicle.service';
import type { CreateVehicleRequest } from '@/types/vehicles.types';

type CreateVehicleMutationInput = {
  userId: string;
  data: CreateVehicleRequest;
};

export function useCreateVehicle() {
  return useMutation({
    mutationFn: ({ userId, data }: CreateVehicleMutationInput) => createVehicle(data, userId),
  });
}
