import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

import { leaveRoute } from '@/services/route-passanger.service';

export function useLeaveRoute(routeId: string, dependentId?: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => leaveRoute(routeId, dependentId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['passanger-routes'] });
      await queryClient.invalidateQueries({ queryKey: ['passanger-route', routeId] });
      router.back();
    },
  });
}
