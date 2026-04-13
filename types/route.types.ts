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
  expected_time: string; // HH:MM:SS
  recurrence: string; // "seg,ter,qua"
}

export interface CreateRouteResponse {
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
}
