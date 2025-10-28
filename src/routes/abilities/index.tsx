import { useSuspenseQuery } from '@tanstack/react-query'
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
  const { data, isLoading, error } = useSuspenseQuery(abilitiesQueryOptions())
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!data) return <div>No data</div>
  return (
    <div className='max-w-[80%] w-full mx-auto my-16'>
      <h1 className='text-5xl font-bold mb-8'>Pokémon Abiliies List</h1>
      <AbilitiesTable />
    </div>
  )
}
