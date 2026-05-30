// Barrel de compatibilidade: re-exporta os hooks de trip dos arquivos separados
// (fonte única de verdade). Mantido só pra não quebrar imports antigos —
// pode ser removido quando todos importarem dos hooks individuais.
export { useTrip, TRIP_QUERY_KEY } from '@/hooks/use-trip';
export { useTripNextStop, TRIP_NEXT_STOP_QUERY_KEY } from '@/hooks/use-trip-next-stop';
export { useStartTrip } from '@/hooks/use-start-trip';
export { useBoardPassanger } from '@/hooks/use-board-passanger';
export { useMarkPassangerAbsent } from '@/hooks/use-mark-passanger-absent';
export { useAlightPassanger } from '@/hooks/use-alight-passanger';
export { useSkipStop } from '@/hooks/use-skip-stop';
export { useFinishTrip } from '@/hooks/use-finish-trip';
