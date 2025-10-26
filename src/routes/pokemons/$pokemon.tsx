import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/pokemons/$pokemon')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/pokemons/$pokemon"!</div>
}
