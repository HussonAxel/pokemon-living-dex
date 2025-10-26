import { createFileRoute } from '@tanstack/react-router'
import { useGetAllAbilities } from '@/data/queries/pokemons'

export const Route = createFileRoute('/abilities/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isLoading, error } = useGetAllAbilities()
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!data) return <div>No data</div>
  return (
    <div>
      <h1>Abilities</h1>
      <ul>
        {data.map((ability: any) => (
          <li key={ability.name}>{ability.name}</li>
        ))}
      </ul>
    </div>
  )
}
