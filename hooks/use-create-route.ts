import { useMutation } from '@tanstack/react-query';

import { createRoute } from '@/services/route.service';
import { useSessionStore } from '@/store/session.store';
import type { CreateRouteRequest } from '@/types/route.types';

export function useCreateRoute() {
  const driver = useSessionStore((state) => state.driver);

  return useMutation({
    mutationFn: (data: CreateRouteRequest) => {
      if (!driver?.id) throw new Error('Usuário não autenticado');
      return createRoute(data, driver.id);
    },
  });
}
