import type { components } from './api.generated';

export type CreateVehicleRequest = components['schemas']['VehicleCreate'];

export type UpdateVehicleRequest = components['schemas']['VehicleUpdate'];

export type VehicleResponse = Omit<components['schemas']['VehicleResponse'], 'plate'> & {
  plate: string | null;
};

// Aliases para consistência com o padrão do projeto
export type CreateVehicleResponse = VehicleResponse;
export type UpdateVehicleResponse = VehicleResponse;
