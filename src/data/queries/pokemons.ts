import { useQuery, useQueryClient } from '@tanstack/react-query'
import { PokeAPI } from 'pokeapi-types'
const BASE_POKEAPI_URL = 'https://pokeapi.co/api/v2'
const CURRENT_POKEMON_LIMIT = '?limit=100000'

export const QUERY_KEYS = {
  POKEMONS: 'pokemons',
  POKEMON_BY_RANGE: 'pokemonByRange',
  ABILITY: 'ability',
  ABILITIES: 'abilities',
  ABILITY_DATA: 'abilityData',
  ITEMS: 'items',
  MOVES: 'moves',
  TYPES: 'types',
  BERRY: 'berry',
  BERRIES: 'berries',
  BERRY_DATA: 'berryData',
}

const STATIC_QUERY_OPTIONS = {
  staleTime: Infinity,
  gcTime: 1000 * 60 * 60 * 24 * 365,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
}

//──────────────────────────────────────────────────────────────────────────────
// FONCTIONS FETCH
//──────────────────────────────────────────────────────────────────────────────
//

export const fetchAllAbilities = async () => {
const res = await fetch(`${BASE_POKEAPI_URL}/ability?limit=50`)
if (!res.ok) {
  throw new Error('Failed to fetch abilities')
}
STATIC_QUERY_OPTIONS
const data = await res.json()
return data.results
}

export const fetchAllAbilityData = async ({ abilityName }: { abilityName: string }) => {
  const res = await fetch (`${BASE_POKEAPI_URL}/ability/${abilityName}`)
  if (!res.ok) {
    throw new Error('Failed to fetch ability data')
  }
  const data = await res.json()
  return data
}

export const fetchAllItems = async () => {
const res = await fetch(`${BASE_POKEAPI_URL}/item?limit=-1`)
if (!res.ok) {
  throw new Error('Failed to fetch items')
}
const data = await res.json()
return data.results
}

export const fetchAllMoves = async () => {
const res = await fetch(`${BASE_POKEAPI_URL}/move?limit=-1`)
if (!res.ok) {
  throw new Error('Failed to fetch moves')
}
const data = await res.json()
return data.results
}

export const fetchAllTypes = async () => {
const res = await fetch(`${BASE_POKEAPI_URL}/type?limit=-1`)
if (!res.ok) {
  throw new Error('Failed to fetch types')
}
const data = await res.json()
return data.results
}

export const fetchAllBerries = async () => {
  const res = await fetch (`${BASE_POKEAPI_URL}/berry?limit=-1`)
  if (!res.ok) {
    throw new Error('Failed to fetch berries')
  }
  const data = await res.json()
  return data.results
}

export const fetchAllBerriesData = async ({ berryName }: { berryName: string }) => {
  const res = await fetch (`${BASE_POKEAPI_URL}/berry/${berryName}`)
  if (!res.ok) {
    throw new Error('Failed to fetch berries data')
  }
  const data = await res.json()
  return data
}

export const fetchAllPokemons = async () => {
  const res = await fetch(`${BASE_POKEAPI_URL}/pokemon${CURRENT_POKEMON_LIMIT}`)
  if (!res.ok) {
    throw new Error('Failed to fetch pokemons')
  }
  const data = await res.json()
  return data.results
}

export const fetchPokemonByRange = async (offset: number, limit: number) => {
  const res = await fetch(
    `${BASE_POKEAPI_URL}/pokemon?offset=${offset}&limit=${limit}`,
  )
  if (!res.ok) {
    throw new Error('Failed to fetch pokemons')
  }
  const data = await res.json()
  return data.results
}


//──────────────────────────────────────────────────────────────────────────────
// HOOKS DE RÉCUPÉRATION DE DONNÉES (useGet…)
//──────────────────────────────────────────────────────────────────────────────

export const useGetAllAbilities = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ABILITIES],
    queryFn: fetchAllAbilities,
    ...STATIC_QUERY_OPTIONS,
  })
}



export const abilitiesQueryOptions = () => ({
  queryKey: [QUERY_KEYS.ABILITY_DATA],
  queryFn: async () => {
    const abilities = await fetchAllAbilities()
    const detailed = await Promise.all(
      abilities.map((ability: PokeAPI.Ability) =>
        fetchAllAbilityData({ abilityName: ability.name })
      )
    )
    return abilities.map((ability: PokeAPI.Ability, idx: number) => ({
      ...ability,
      details: detailed[idx],
    }))
  },
  ...STATIC_QUERY_OPTIONS,
})


export const useGetAllItems = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ITEMS],
    queryFn: fetchAllItems,
    ...STATIC_QUERY_OPTIONS,
  })
}

export const useGetAllMoves = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.MOVES],
    queryFn: fetchAllMoves,
    ...STATIC_QUERY_OPTIONS,
  })
}

export const useGetAllTypes = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.TYPES],
    queryFn: fetchAllTypes,
    ...STATIC_QUERY_OPTIONS,
  })
}

export const useGetAllBerries = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.BERRIES],
    queryFn: fetchAllBerries,
    ...STATIC_QUERY_OPTIONS,
  })
}

export const useGetAllBerriesWithData = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.BERRY_DATA],
    queryFn: async () => {
      const berries = await fetchAllBerries();
      const detailed = await Promise.all(
        berries.map((berry: PokeAPI.Berry) =>
          fetchAllBerriesData({ berryName: berry.name })
        )
      );
      const detailedItems = await Promise.all(
        detailed.map((detail: any) =>
          detail.item?.url 
            ? fetch(detail.item.url).then(res => res.json())
            : Promise.resolve(null)
        )
      );
      return berries.map((berry: PokeAPI.Berry, idx: number) => ({
        ...berry,
        details: detailed[idx],
        item: detailedItems[idx],
      }));
    },
    ...STATIC_QUERY_OPTIONS,
  });
};

export const useGetAllBerryData = ({ berryName }: { berryName: string }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BERRY_DATA, berryName],
    queryFn: async () => {
      const berry = await fetchAllBerriesData({ berryName })
      const item = await fetch(berry.item.url).then(res => res.json())
      return {
        ...berry,
        item: item,
      }
    }
  })
}

export const useGetAllPokemons = () => {
  return useQuery({
    queryKey: ['pokemons'],
    queryFn: fetchAllPokemons,
    ...STATIC_QUERY_OPTIONS,
  })
}

export const useGetPokemonsByRange = (offset: number, limit: number) => {
  return useQuery({
    queryKey: ['pokemonByRange', offset, limit],
    queryFn: () => fetchPokemonByRange(offset, limit),
    ...STATIC_QUERY_OPTIONS,
  })
}

//──────────────────────────────────────────────────────────────────────────────
// HOOKS DE PRÉFETCH (usePrefetch…)
//──────────────────────────────────────────────────────────────────────────────

export const usePrefetchAllBerriesWithData = () => {
  const qc = useQueryClient()
  return () =>
    qc.ensureQueryData({
      queryKey: [QUERY_KEYS.BERRY_DATA],
      queryFn: async () => {
        const berries = await fetchAllBerries();
        const detailed = await Promise.all(
          berries.map((berry: PokeAPI.Berry) =>
            fetchAllBerriesData({ berryName: berry.name })
          )
        );
        return berries.map((berry: PokeAPI.Berry, idx: number) => ({
          ...berry,
          details: detailed[idx],
        }));
      },
    })
}

export const usePrefetchAllAbilitiesWithData = () => {
  const qc = useQueryClient() 
  return () => 
    qc.ensureQueryData({
      queryKey: [QUERY_KEYS.ABILITY_DATA],
      queryFn: async() => {
        const abilities = await fetchAllAbilities();
        const detailed = await Promise.all(
          abilities.map((ability: PokeAPI.Ability) =>
            fetchAllAbilityData({ abilityName: ability.name })
          )
        );
        return (abilities.map((ability: PokeAPI.Ability, idx: number) => ({
          ...ability,
          details: detailed[idx],
        })));
      }
    })
}

export const usePrefetchAllPokemons = () => {
  const qc = useQueryClient()
  return () =>
    qc.ensureQueryData({
      queryKey: [QUERY_KEYS.POKEMONS],
      queryFn: fetchAllPokemons,
    })
}

export const usePrefetchPokemonsByRange = (offset: number, limit: number) => {
  const qc = useQueryClient()
  return () =>
    qc.ensureQueryData({
      queryKey: [QUERY_KEYS.POKEMON_BY_RANGE, offset, limit],
      queryFn: () => fetchPokemonByRange(offset, limit),
    })
}
