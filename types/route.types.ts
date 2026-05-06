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
export type DriverRouteStatus = 'inativa' | 'em_andamento';
export type StopType = 'embarque' | 'desembarque';
export type RoutePassangerStatus = 'pending' | 'accepted' | 'rejected';
export type PassengerRouteStatus = 'inativa' | 'em_andamento';
export type PassengerMembershipStatus = 'pending' | 'accepted' | 'rejected';

export interface RouteStopAddressResponse {
  label: string;
  street: string;
  number: string;
}

export interface RouteStopResponse {
  id: string;
  route_passanger_id: string;
  order_index: number;
  address: RouteStopAddressResponse;
}

export interface RouteAbsenceResponse {
  route_passanger_id: string;
  user_id: string;
  user_name: string;
  dependent_id: string | null;
  dependent_name: string | null;
  absence_date: string;
  reason: string | null;
}

export interface CreateRouteRequest {
  name: string;
  route_type: RouteType;
  origin: AddressRequest;
  destination: AddressRequest;
  expected_time: string;
  recurrence: string;
}

export type RouteUpdate = Partial<CreateRouteRequest>;

export interface StopResponse {
  id: string;
  route_passanger_id: string;
  order_index: number;
  type: StopType;
  address_id: string;
  address: AddressResponse;
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
  stops: StopResponse[];
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

export interface PassangerRouteSchedule {
  id: string;
  day_of_week: string;
  address_id: string;
}

export interface PassangerRouteListItem {
  route_id: string;
  route_name: string;
  driver_name: string;
  driver_phone: string;
  origin_label: string;
  destination_label: string;
  expected_time: string;
  recurrence: string[];
  status: PassengerRouteStatus;
  membership_status: PassengerMembershipStatus;
  schedules: PassangerRouteSchedule[];
  joined_at: string;
  dependent_name: string | null;
}

export interface RoutePassangerResponse {
  id: string;
  route_id: string;
  status: RoutePassangerStatus;
  user_id: string;
  user_name: string;
  user_phone: string;
  pickup_address_id: string;
  requested_at: string;
  joined_at: string | null;
  dependent_id: string | null;
  dependent_name: string | null;
  guardian_name: string | null;
}

export type CreateRouteResponse = RouteResponse;
