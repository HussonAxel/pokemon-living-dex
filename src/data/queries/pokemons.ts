import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'

const BASE_POKEAPI_URL = 'https://pokeapi.co/api/v2/'
const CURRENT_POKEMON_LIMIT = '?limit=100000'

export const QUERY_KEYS = {
  POKEMONS: 'pokemons',
  POKEMON_BY_RANGE: 'pokemonByRange',
}

//──────────────────────────────────────────────────────────────────────────────
// FONCTIONS FETCH
//──────────────────────────────────────────────────────────────────────────────
//

export const fetchAllPokemons = async () => {
  const res = await fetch(`${BASE_POKEAPI_URL}pokemon${CURRENT_POKEMON_LIMIT}`)
  if (!res.ok) {
    throw new Error('Failed to fetch pokemons')
  }
  const data = await res.json()
  return data.results
}

export const fetchPokemonByRange = async (offset: number, limit: number) => {
  const res = await fetch(
    `${BASE_POKEAPI_URL}pokemon?offset=${offset}&limit=${limit}`,
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

export const useGetAllPokemons = () => {
  return useQuery({
    queryKey: ['pokemons'],
    queryFn: fetchAllPokemons,
    placeholderData: (prev) => prev,
    refetchOnMount: false,
  })
}

export const useGetPokemonsByRange = (offset: number, limit: number) => {
  return useQuery({
    queryKey: ['pokemonByRange', offset, limit],
    queryFn: () => fetchPokemonByRange(offset, limit),
    placeholderData: (prev) => prev,
    refetchOnMount: false,
  })
}

//──────────────────────────────────────────────────────────────────────────────
// HOOKS DE PRÉFETCH (usePrefetch…)
//──────────────────────────────────────────────────────────────────────────────

export const usePrefetchAllPokemons = () => {
  const qc = useQueryClient()
  return () =>
    qc.ensureQueryData({
      queryKey: ['pokemons'],
      queryFn: fetchAllPokemons,
    })
}

export const usePrefetchPokemonsByRange = (offset: number, limit: number) => {
  const qc = useQueryClient()
  return () =>
    qc.ensureQueryData({
      queryKey: ['pokemonByRange', offset, limit],
      queryFn: () => fetchPokemonByRange(offset, limit),
    })
}
