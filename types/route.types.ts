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
export type DriverRouteStatus = 'inativa' | 'ativa';
export type PassengerRouteStatus = 'inativa' | 'em_andamento';
export type PassengerMembershipStatus = 'pending' | 'accepted' | 'rejected';

export interface RouteStopAddressResponse {
  label: string;
  street: string;
  number: string;
}

export interface RouteStopResponse {
  id: string;
  address: RouteStopAddressResponse;
}

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
  status: DriverRouteStatus;
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

export interface PassangerRouteDetailResponse {
  route_id: string;
  name: string;
  route_type: RouteType;
  status: PassengerRouteStatus;
  recurrence: string[];
  expected_time: string;
  origin_address: AddressResponse;
  destination_address: AddressResponse;
  stops: RouteStopResponse[];
  driver_name: string;
  driver_phone: string;
  membership_status: PassengerMembershipStatus;
  my_pickup_address: AddressResponse | null;
  my_schedules: string[];
  current_trip_id: string | null;
  dependent_id: string | null;
  dependent_name: string | null;
}

export type CreateRouteResponse = RouteResponse;
