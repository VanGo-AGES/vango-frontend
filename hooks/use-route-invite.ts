import { useQuery } from '@tanstack/react-query';
import { getRouteByInviteCode } from '@/services/route.service';
import { ApiError } from '@/services/api';

export function useRouteInvite(inviteCode: string) {
  const query = useQuery({
    queryKey: ['route-invite', inviteCode],
    queryFn: () => getRouteByInviteCode(inviteCode),
    enabled: inviteCode.length === 5,
    retry: false,
  });

  const isInvalidCode =
    query.isError && query.error instanceof ApiError && query.error.status === 404;

  return {
    routeSummary: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    isInvalidCode,
  };
}
