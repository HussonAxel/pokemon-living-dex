import { useQuery, useQueryClient } from '@tanstack/react-query'
import { client } from '@/orpc/client'

export const ITEMS_QUERY_KEYS = {
  all: ['items'] as const,
  lists: () => [...ITEMS_QUERY_KEYS.all, 'list'] as const,
  list: () => [...ITEMS_QUERY_KEYS.lists()] as const,
  details: () => [...ITEMS_QUERY_KEYS.all, 'detail'] as const,
  detail: (name: string) => [...ITEMS_QUERY_KEYS.details(), name] as const,
}

export const itemsListQueryOptions = () => ({
  queryKey: ITEMS_QUERY_KEYS.list(),
  queryFn: async () => {
    console.log('[Query] Fetching items from oRPC')
    return await (client.listItems as any)({})
  },
  staleTime: Infinity,
  gcTime: 1000 * 60 * 60 * 24 * 365,
})

export const useGetAllItems = () => {
  return useQuery(itemsListQueryOptions())
}

export const useGetItemByName = (name: string) => {
  return useQuery({
    queryKey: ITEMS_QUERY_KEYS.detail(name),
    queryFn: async () => {
      console.log(`[Query] Fetching item "${name}" from oRPC`)
      return await (client.getItemByName as any)({ name })
    },
    staleTime: Infinity,
  })
}

export const usePrefetchAllItems = () => {
  const qc = useQueryClient()
  return () => qc.ensureQueryData(itemsListQueryOptions())
}
