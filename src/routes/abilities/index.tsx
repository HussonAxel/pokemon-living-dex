import { createFileRoute } from '@tanstack/react-router'
import { abilitiesQueryOptions } from '@/data/queries/pokemons'
import AbilitiesTable from '@/components/abilitiesTable'

export const Route = createFileRoute('/abilities/')({
  loader: async ({ context }) => {
    return await context.queryClient.ensureQueryData(abilitiesQueryOptions())
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='max-w-[80%] w-full mx-auto my-16'>
      <h1 className='text-5xl font-bold mb-8'>Pokémon Abilities List</h1>
      <AbilitiesTable />
    </div>
  )
}
