import { useQuery, useQueryClient } from '@tanstack/react-query'
import { client } from '@/orpc/client'

// Query Keys structure hiérarchique
export const ABILITIES_QUERY_KEYS = {
  all: ['abilities'] as const,
  lists: () => [...ABILITIES_QUERY_KEYS.all, 'list'] as const,
  list: () => [...ABILITIES_QUERY_KEYS.lists()] as const,
  details: () => [...ABILITIES_QUERY_KEYS.all, 'detail'] as const,
  detail: (name: string) => [...ABILITIES_QUERY_KEYS.details(), name] as const,
}

// ===== FETCH FUNCTIONS =====
export const fetchAbilitiesFromORPC = async () => {
  console.log('[Query] Fetching abilities from oRPC')
  return await (client.listAbilities as any)({})
}

export const fetchAbilityByNameFromORPC = async (name: string) => {
  console.log(`[Query] Fetching ability "${name}" from oRPC`)
  return await (client.getAbilityByName as any)({ name })
}

// ===== QUERY OPTIONS (Pour SSR + Preloading) =====
export const abilitiesListQueryOptions = () => ({
  queryKey: ABILITIES_QUERY_KEYS.list(),
  queryFn: fetchAbilitiesFromORPC,
  staleTime: Infinity,
  gcTime: 1000 * 60 * 60 * 24 * 365, // 1 an
  refetchOnMount: false,
  refetchOnWindowFocus: false,
})

export const abilityDetailQueryOptions = (name: string) => ({
  queryKey: ABILITIES_QUERY_KEYS.detail(name),
  queryFn: () => fetchAbilityByNameFromORPC(name),
  staleTime: Infinity,
})

// ===== HOOKS =====
export const useGetAllAbilities = () => {
  return useQuery(abilitiesListQueryOptions())
}

export const useGetAbilityByName = (name: string) => {
  return useQuery(abilityDetailQueryOptions(name))
}

// ===== PREFETCH HOOKS =====
export const usePrefetchAllAbilities = () => {
  const qc = useQueryClient()
  return () =>
    qc.ensureQueryData(abilitiesListQueryOptions())
}

export const usePrefetchAbilityByName = (name: string) => {
  const qc = useQueryClient()
  return () =>
    qc.ensureQueryData(abilityDetailQueryOptions(name))
}

// ===== INVALIDATION HELPERS =====
export const useInvalidateAbilities = () => {
  const qc = useQueryClient()
  return {
    invalidateAll: () => qc.invalidateQueries({ queryKey: ABILITIES_QUERY_KEYS.all }),
    invalidateList: () => qc.invalidateQueries({ queryKey: ABILITIES_QUERY_KEYS.list() }),
    invalidateDetail: (name: string) => qc.invalidateQueries({ queryKey: ABILITIES_QUERY_KEYS.detail(name) }),
  }
}
