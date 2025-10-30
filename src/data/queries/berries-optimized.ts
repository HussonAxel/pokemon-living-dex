import { useQuery, useQueryClient } from '@tanstack/react-query'
import { client } from '@/orpc/client'

export const BERRIES_QUERY_KEYS = {
  all: ['berries'] as const,
  lists: () => [...BERRIES_QUERY_KEYS.all, 'list'] as const,
  list: () => [...BERRIES_QUERY_KEYS.lists()] as const,
  details: () => [...BERRIES_QUERY_KEYS.all, 'detail'] as const,
  detail: (name: string) => [...BERRIES_QUERY_KEYS.details(), name] as const,
}

export const berriesListQueryOptions = () => ({
  queryKey: BERRIES_QUERY_KEYS.list(),
  queryFn: async () => {
    console.log('[Query] Fetching berries from oRPC')
    return await (client.listBerries as any)({})
  },
  staleTime: Infinity,
  gcTime: 1000 * 60 * 60 * 24 * 365,
})

export const useGetAllBerries = () => {
  return useQuery(berriesListQueryOptions())
}

export const useGetBerryByName = (name: string) => {
  return useQuery({
    queryKey: BERRIES_QUERY_KEYS.detail(name),
    queryFn: async () => {
      console.log(`[Query] Fetching berry "${name}" from oRPC`)
      return await (client.getBerryByName as any)({ name })
    },
    staleTime: Infinity,
  })
}

export const usePrefetchAllBerries = () => {
  const qc = useQueryClient()
  return () => qc.ensureQueryData(berriesListQueryOptions())
}
