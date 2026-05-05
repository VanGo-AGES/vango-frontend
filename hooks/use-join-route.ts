import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { joinRoute } from '@/services/route-passanger.service';
import { ApiError } from '@/services/api';
import type { JoinRouteRequest } from '@/types/route.types';

export function useJoinRoute(routeId: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: JoinRouteRequest) => joinRoute(routeId, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['passanger-routes'] });
      router.navigate('/(passenger)/passenger-home-screen' as any);
    },
  });
}
