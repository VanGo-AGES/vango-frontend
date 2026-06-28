/**
 * Runtime shape validators derived from the OpenAPI contract (openapi.json → types/api.generated.ts).
 *
 * Each validator checks that a value has at least the required fields with the
 * correct primitive types. Optional fields are only checked when present.
 *
 * This ensures that a backend contract change (renamed/removed field) causes a
 * test failure without any manual mock update.
 */

type FieldSpec = { type: 'string' | 'number' | 'boolean' | 'object' | 'array'; optional?: boolean };
type Schema = Record<string, FieldSpec>;

function assertShape(label: string, value: unknown, schema: Schema): void {
  if (typeof value !== 'object' || value === null) {
    throw new Error(`${label}: expected object, got ${typeof value}`);
  }
  const obj = value as Record<string, unknown>;
  for (const [field, spec] of Object.entries(schema)) {
    if (spec.optional && obj[field] == null) continue;
    if (!(field in obj)) {
      throw new Error(`${label}: missing required field "${field}"`);
    }
    const actual = Array.isArray(obj[field]) ? 'array' : typeof obj[field];
    if (actual !== spec.type && !(spec.type === 'number' && actual === 'number')) {
      throw new Error(`${label}.${field}: expected ${spec.type}, got ${actual}`);
    }
  }
}

// ── schemas ──────────────────────────────────────────────────────────────────

/** POST /auth/login → LoginResponse */
export function validateLoginResponse(v: unknown): void {
  assertShape('LoginResponse', v, {
    access_token: { type: 'string' },
    token_type: { type: 'string' },
    user: { type: 'object' },
  });
  validateUserResponse((v as any).user);
}

/** UserResponse */
export function validateUserResponse(v: unknown): void {
  assertShape('UserResponse', v, {
    id: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string' },
    phone: { type: 'string' },
    role: { type: 'string' },
    created_at: { type: 'string' },
    updated_at: { type: 'string' },
  });
}

/** AbsenceResponse */
export function validateAbsenceResponse(v: unknown): void {
  assertShape('AbsenceResponse', v, {
    id: { type: 'string' },
    route_passanger_id: { type: 'string' },
    absence_date: { type: 'string' },
    created_at: { type: 'string' },
  });
}

/** RouteAbsenceResponse */
export function validateRouteAbsenceResponse(v: unknown): void {
  assertShape('RouteAbsenceResponse', v, {
    route_passanger_id: { type: 'string' },
    user_id: { type: 'string' },
    user_name: { type: 'string' },
    absence_date: { type: 'string' },
  });
}

/** TripResponse */
export function validateTripResponse(v: unknown): void {
  assertShape('TripResponse', v, {
    id: { type: 'string' },
    route_id: { type: 'string' },
    route_name: { type: 'string' },
    status: { type: 'string' },
    vehicle_id: { type: 'string' },
    trip_date: { type: 'string' },
  });
}

/** TripPassangerResponse */
export function validateTripPassangerResponse(v: unknown): void {
  assertShape('TripPassangerResponse', v, {
    id: { type: 'string' },
    passanger_name: { type: 'string' },
    pickup_address_label: { type: 'string' },
    route_passanger_id: { type: 'string' },
    status: { type: 'string' },
    user_phone: { type: 'string' },
  });
}

/** CurrentTripResponse */
export function validateCurrentTripResponse(v: unknown): void {
  assertShape('CurrentTripResponse', v, {
    trip_id: { type: 'string' },
    status: { type: 'string' },
    driver_name: { type: 'string' },
  });
}

/** TripNextStopResponse */
export function validateTripNextStopResponse(v: unknown): void {
  assertShape('TripNextStopResponse', v, {
    stop_id: { type: 'string' },
    trip_passanger_id: { type: 'string' },
    address_label: { type: 'string' },
    order_index: { type: 'number' },
    passanger_name: { type: 'string' },
    passanger_phone: { type: 'string' },
    trip_passanger_status: { type: 'string' },
  });
}

/** RouteResponse */
export function validateRouteResponse(v: unknown): void {
  assertShape('RouteResponse', v, {
    id: { type: 'string' },
    name: { type: 'string' },
    recurrence: { type: 'string' },
    expected_time: { type: 'string' },
    invite_code: { type: 'string' },
    max_passengers: { type: 'number' },
    route_type: { type: 'string' },
    status: { type: 'string' },
    origin_address: { type: 'object' },
    destination_address: { type: 'object' },
  });
}

/** RoutePassangerResponse */
export function validateRoutePassangerResponse(v: unknown): void {
  assertShape('RoutePassangerResponse', v, {
    id: { type: 'string' },
    route_id: { type: 'string' },
    user_id: { type: 'string' },
    user_name: { type: 'string' },
    user_phone: { type: 'string' },
    pickup_address_id: { type: 'string' },
    requested_at: { type: 'string' },
    status: { type: 'string' },
  });
}

/** RouteInviteSummaryResponse */
export function validateRouteInviteSummaryResponse(v: unknown): void {
  assertShape('RouteInviteSummaryResponse', v, {
    id: { type: 'string' },
    name: { type: 'string' },
    recurrence: { type: 'string' },
    expected_time: { type: 'string' },
    max_passengers: { type: 'number' },
    accepted_count: { type: 'number' },
    route_type: { type: 'string' },
    origin_address: { type: 'object' },
    destination_address: { type: 'object' },
  });
}

/** MetricsReportResponse */
export function validateMetricsReportResponse(v: unknown): void {
  assertShape('MetricsReportResponse', v, {
    start_date: { type: 'string' },
    end_date: { type: 'string' },
    period: { type: 'string' },
    distance: { type: 'number' },
    duration: { type: 'number' },
    passengers: { type: 'number' },
    trips: { type: 'number' },
  });
}

/** VehicleResponse */
export function validateVehicleResponse(v: unknown): void {
  assertShape('VehicleResponse', v, {
    id: { type: 'string' },
    capacity: { type: 'number' },
    driver_id: { type: 'string' },
    created_at: { type: 'string' },
  });
}

/** DependentResponse */
export function validateDependentResponse(v: unknown): void {
  assertShape('DependentResponse', v, {
    id: { type: 'string' },
    name: { type: 'string' },
  });
}
