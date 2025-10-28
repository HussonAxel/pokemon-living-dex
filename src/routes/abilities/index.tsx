import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { abilitiesQueryOptions } from '@/data/queries/pokemons'
import AbilitiesTable from '@/components/abilitiesTable'

export const Route = createFileRoute('/abilities/')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(abilitiesQueryOptions())
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isLoading, error } = useQuery(abilitiesQueryOptions())
  
  if (error) return <div>Error loading abilities</div>
  if (isLoading) return <div>Loading...</div>
  if (!data) return <div>No data</div>
  
  return (
    <div className='max-w-[80%] w-full mx-auto my-16'>
      <h1 className='text-5xl font-bold mb-8'>Pokémon Abilities List</h1>
      <AbilitiesTable />
    </div>
  )
}
