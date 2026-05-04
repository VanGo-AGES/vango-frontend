export type RouteFormAddress = {
  cep: string;
  numero: string;
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;
};

export type AddressErrors = Partial<Record<keyof RouteFormAddress, string>>;

export interface AddressRequest {
  label: string;
  street: string;
  number: string;
  neighborhood: string;
  zip: string;
  city: string;
  state: string;
}

export interface AddressResponse {
  id: string;
  label: string;
  street: string;
  number: string;
  neighborhood: string;
  zip: string;
  city: string;
  state: string;
  latitude: number | null;
  longitude: number | null;
}

export type RouteType = 'outbound' | 'inbound';
export type RouteStatus = 'inativa' | 'ativa';

export interface CreateRouteRequest {
  name: string;
  route_type: RouteType;
  origin: AddressRequest;
  destination: AddressRequest;
  expected_time: string;
  recurrence: string;
}

export interface RouteResponse {
  id: string;
  name: string;
  route_type: RouteType;
  status: RouteStatus;
  recurrence: string;
  expected_time: string;
  invite_code: string;
  max_passengers: number;
  origin_address: AddressResponse;
  destination_address: AddressResponse;
  distance?: string | null;
  distance_km?: number | null;
  duration?: string | null;
  duration_minutes?: number | null;
}

export type CreateRouteResponse = RouteResponse;
