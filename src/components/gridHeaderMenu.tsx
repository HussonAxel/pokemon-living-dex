import { Link } from '@tanstack/react-router'
import { generations } from '@/data/consts/generations'

import {
  usePrefetchAllPokemons,
  usePrefetchPokemonsByRange,
} from '@/data/queries/pokemons'

interface gridHeaderMenuProps {}

export default function GridHeaderMenu({}: gridHeaderMenuProps) {
  const allRegions = generations[0]
  const otherGenerations = generations.slice(1)

  const prefetchAllPokemons = usePrefetchAllPokemons()

  // Call hooks at top level for all generations
  const prefetchFunctions = otherGenerations.map((gen) => {
    const startId = parseInt(gen.pokedexRange[0])
    const endId = parseInt(gen.pokedexRange[1])
    const offset = startId
    const limit = endId - startId
    return usePrefetchPokemonsByRange(offset, limit)
  })

  return (
    <nav className="h-screen bg-[#F1EADA] p-6">
      <div className="flex flex-col h-full gap-6 xl:flex-row">
        <div className="w-full xl:w-[550px] flex-shrink-0">
          <Link
            to={'/collection/$generation'}
            params={{
              generation: allRegions.slug,
            }}
            search={{ showShiny: false }}
            onMouseEnter={prefetchAllPokemons}
          >
            <div className="border-[0.5px] border-black rounded-[20px] h-full p-6 transition-colors duration-500 ease-in-out hover:bg-[#ef4036] hover:text-white flex flex-col hover:cursor-pointer">
              <div className="flex flex-col justify-between h-full">
                <div className="flex flex-row justify-between">
                  <p className="text-2xl font-bold">{allRegions.generation}</p>
                  <p>0/{allRegions.pokedexLength}</p>
                </div>
                <div className="flex flex-col gap-6">
                  <p className="text-3xl font-bold">{allRegions.title}</p>
                  <p className="text-md leading-relaxed flex-1 overflow-y-auto font-semibold">
                    {allRegions.subtitle}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="grid grid-cols-2 gap-6 auto-rows-fr">
            {otherGenerations.map((gen, index) => (
              <Link
                key={gen.generation}
                to="/collection/$generation"
                params={{
                  generation: gen.slug,
                }}
                search={{ showShiny: false }}
                onMouseEnter={prefetchFunctions[index]}
              >
                <div className="border-[0.5px] border-black rounded-[20px] p-6 transition-colors duration-500 ease-in-out hover:bg-[#ef4036] hover:text-white hover:cursor-pointer flex flex-col h-80">
                  <div className="flex flex-col justify-between h-full">
                    <div className="flex flex-row justify-between">
                      <p className="font-bold text-2xl">{gen.generation}</p>
                      <p>0/{gen.pokedexLength}</p>
                    </div>
                    <div className="flex flex-col gap-6">
                      <p className="text-3xl font-bold">{gen.title}</p>
                      <p className="text-md leading-relaxed flex-1 overflow-y-auto font-semibold">
                        {gen.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
