import { createFileRoute } from '@tanstack/react-router'
import { useGetAllBerryData } from '@/data/queries/pokemons'
export const Route = createFileRoute('/berries/$berry')({
  component: RouteComponent,
})

function RouteComponent() {
  const { berry } = Route.useParams()
  const {data, isLoading, error } = useGetAllBerryData({ berryName: berry })
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!data) return <div>No data</div>
  console.log(data)
  return <div>Berry: {berry}</div>
}
