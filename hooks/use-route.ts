import { useQuery } from '@tanstack/react-query';
import { getRouteById } from '@/services/route.service';

export function useRoute(id: string | undefined) {
  return useQuery({
    queryKey: ['route', id],
    queryFn: () => getRouteById(id!),
    enabled: !!id,
  });
}
