import { createFileRoute } from '@tanstack/react-router'
import GridHeaderMenu from '@/components/gridHeaderMenu'

export const Route = createFileRoute('/pokemons/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <GridHeaderMenu />
}
