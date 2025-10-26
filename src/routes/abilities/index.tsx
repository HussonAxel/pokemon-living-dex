import { createFileRoute } from '@tanstack/react-router'
import { useGetAllAbilitiesWithData } from '@/data/queries/pokemons'
import AbilitiesTable from '@/components/abilitiesTable'

export const Route = createFileRoute('/abilities/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isLoading, error } = useGetAllAbilitiesWithData()
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
