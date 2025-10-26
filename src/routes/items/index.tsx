import { createFileRoute } from '@tanstack/react-router'
import { useGetAllItems } from '@/data/queries/pokemons'

export const Route = createFileRoute('/items/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isLoading, error } = useGetAllItems()
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!data) return <div>No data</div>
  return (
    <div>
      <h1>Items</h1>
      <ul>
        {data.map((item: any) => (
          <li key={item.name}>{item.name}</li>
        ))}
      </ul>
    </div>
  )
}
