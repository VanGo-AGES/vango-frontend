import { Stop } from '@/components/route/route-stop-list';

export const routeStopsMock: Stop[] = [
  {
    id: 'origin-1',
    type: 'origin',
    address: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP',
  },
  {
    id: 'stop-1',
    type: 'stop',
    passengerName: 'Ana Costa',
    address: 'Rua Augusta, 500 - Consolação, São Paulo - SP',
  },
  {
    id: 'stop-2',
    type: 'stop',
    passengerName: 'Bruno Mendes',
    address: 'Rua Oscar Freire, 200 - Jardins, São Paulo - SP',
  },
  {
    id: 'stop-3',
    type: 'stop',
    passengerName: 'Carla Dias',
    address: 'Alameda Santos, 45 - Cerqueira César, São Paulo - SP',
  },
  {
    id: 'destination-1',
    type: 'destination',
    address: 'Av. Faria Lima, 3000 - Itaim Bibi, São Paulo - SP',
  },
];
