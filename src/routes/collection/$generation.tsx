import { createFileRoute, useSearch } from '@tanstack/react-router'

import { extractPokemonIdFromUrl } from '@/utils/functions'

import { useGetPokemonsByRange } from '@/data/queries/pokemons'
import { generations } from '@/data/consts/generations'
import { Filters } from '@/components/filters'

export const Route = createFileRoute('/collection/$generation')({
  validateSearch: (search): { showShiny: boolean } => ({
    showShiny: search?.showShiny === 'true' || search?.showShiny === true,
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { generation } = Route.useParams()
  const { showShiny } = Route.useSearch()

  const currentGeneration = generations.find((gen) => gen.slug === generation)

  const startId = currentGeneration
    ? parseInt(currentGeneration.pokedexRange[0])
    : 0
  const endId = currentGeneration
    ? parseInt(currentGeneration.pokedexRange[1])
    : 151
  const offset = startId
  const limit = endId - startId

  const { data: pokemons, isLoading } = useGetPokemonsByRange(offset, limit)

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Filters />
      <div className="grid sm:grid-cols-2  md:grid-cols-3 xl:grid-cols-4 gap-8 m-16 mt-0">
        {pokemons.map((pokemon) => (
          <article className="rounded-[20px] border-[0.5px] border-black gap-8 pt-8 flex flex-col items-center">
            <p className="font-bold text-4xl text-center capitalize">
              {pokemon.name}
            </p>
            <img
              src={
                showShiny
                  ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${extractPokemonIdFromUrl(pokemon.url)}.png`
                  : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${extractPokemonIdFromUrl(pokemon.url)}.png`
              }
              alt={pokemon.name}
              className="max-w-1/2 w-48 m-auto"
            />
            <p className="w-3/4 m-auto text-center">
              In June 2022, the Jailhouse Lawyer Initiative convened the first,
              in-person Feminist Circle in New York. While JLI members hail from
              diverse backgrounds and histories, the overwhelming majority of
              our members were men.
            </p>
            <button className="text-black rounded-b-[20px] py-6  border-t-[0.5px] border-t-black border-dashed w-full font-semibold transition-colors duration-300 hover:bg-[#f03e33] hover:text-white hover:border-solid">
              Add to collection
            </button>
          </article>
        ))}
      </div>
    </>
  )
}
