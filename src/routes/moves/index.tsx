import { createFileRoute } from '@tanstack/react-router'
import { useGetAllMoves } from '@/data/queries/pokemons'
export const Route = createFileRoute('/moves/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isLoading, error } = useGetAllMoves()
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!data) return <div>No data</div>
  return (
    <div>
      <h1>Moves</h1>
      <ul>
        {data.map((move: any) => (
          <li key={move.name}>{move.name}</li>
        ))}
      </ul>
    </div>
  )
}
