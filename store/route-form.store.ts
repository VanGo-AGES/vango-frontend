import { create } from 'zustand';

import type { RouteFormAddress } from '@/types/route.types';

export type { RouteFormAddress };

type RouteFormState = {
  routeName: string;
  routeType: 'Ida' | 'Volta' | '';
  origin: RouteFormAddress;
  destination: RouteFormAddress;
  setRouteInfo: (data: { routeName: string; routeType: 'Ida' | 'Volta' }) => void;
  setOrigin: (address: RouteFormAddress) => void;
  setDestination: (address: RouteFormAddress) => void;
  clearForm: () => void;
};

const emptyAddress: RouteFormAddress = {
  cep: '',
  numero: '',
  rua: '',
  bairro: '',
  cidade: '',
  estado: '',
};

export const useRouteFormStore = create<RouteFormState>()((set) => ({
  routeName: '',
  routeType: '',
  origin: emptyAddress,
  destination: emptyAddress,
  setRouteInfo: (data) => set({ routeName: data.routeName, routeType: data.routeType }),
  setOrigin: (address) => set({ origin: address }),
  setDestination: (address) => set({ destination: address }),
  clearForm: () =>
    set({ routeName: '', routeType: '', origin: emptyAddress, destination: emptyAddress }),
}));
