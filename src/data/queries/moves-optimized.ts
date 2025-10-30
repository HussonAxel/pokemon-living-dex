import { useQuery, useQueryClient } from '@tanstack/react-query'
import { client } from '@/orpc/client'

export const MOVES_QUERY_KEYS = {
  all: ['moves'] as const,
  lists: () => [...MOVES_QUERY_KEYS.all, 'list'] as const,
  list: () => [...MOVES_QUERY_KEYS.lists()] as const,
  details: () => [...MOVES_QUERY_KEYS.all, 'detail'] as const,
  detail: (name: string) => [...MOVES_QUERY_KEYS.details(), name] as const,
}

export const movesListQueryOptions = () => ({
  queryKey: MOVES_QUERY_KEYS.list(),
  queryFn: async () => {
    console.log('[Query] Fetching moves from oRPC')
    return await (client.listMoves as any)({})
  },
  staleTime: Infinity,
  gcTime: 1000 * 60 * 60 * 24 * 365,
})

export const useGetAllMoves = () => {
  return useQuery(movesListQueryOptions())
}

export const useGetMoveByName = (name: string) => {
  return useQuery({
    queryKey: MOVES_QUERY_KEYS.detail(name),
    queryFn: async () => {
      console.log(`[Query] Fetching move "${name}" from oRPC`)
      return await (client.getMoveByName as any)({ name })
    },
    staleTime: Infinity,
  })
}

export const usePrefetchAllMoves = () => {
  const qc = useQueryClient()
  return () => qc.ensureQueryData(movesListQueryOptions())
}
