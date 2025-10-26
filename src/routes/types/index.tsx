import { createFileRoute } from '@tanstack/react-router'
import { useGetAllTypes } from '@/data/queries/pokemons'
export const Route = createFileRoute('/types/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isLoading, error } = useGetAllTypes()
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!data) return <div>No data</div>
  return (
    <div>
      <h1>Types</h1>
      <ul>
        {data.map((type: any) => (
          <li key={type.name}>{type.name}</li>
        ))}
      </ul>
    </div>
  )
}
