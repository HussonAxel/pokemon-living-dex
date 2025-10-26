import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tcgp/cards/$card')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/cards/tcgp/cards/$card"!</div>
}
