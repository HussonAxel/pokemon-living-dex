import { useQuery, useQueryClient } from '@tanstack/react-query'
import { client } from '@/orpc/client'

export const TYPES_QUERY_KEYS = {
  all: ['types'] as const,
  lists: () => [...TYPES_QUERY_KEYS.all, 'list'] as const,
  list: () => [...TYPES_QUERY_KEYS.lists()] as const,
  details: () => [...TYPES_QUERY_KEYS.all, 'detail'] as const,
  detail: (name: string) => [...TYPES_QUERY_KEYS.details(), name] as const,
}

export const typesListQueryOptions = () => ({
  queryKey: TYPES_QUERY_KEYS.list(),
  queryFn: async () => {
    console.log('[Query] Fetching types from oRPC')
    return await (client.listTypes as any)({})
  },
  staleTime: Infinity,
  gcTime: 1000 * 60 * 60 * 24 * 365,
})

export const useGetAllTypes = () => {
  return useQuery(typesListQueryOptions())
}

export const useGetTypeByName = (name: string) => {
  return useQuery({
    queryKey: TYPES_QUERY_KEYS.detail(name),
    queryFn: async () => {
      console.log(`[Query] Fetching type "${name}" from oRPC`)
      return await (client.getTypeByName as any)({ name })
    },
    staleTime: Infinity,
  })
}

export const usePrefetchAllTypes = () => {
  const qc = useQueryClient()
  return () => qc.ensureQueryData(typesListQueryOptions())
}
