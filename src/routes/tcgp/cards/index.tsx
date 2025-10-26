import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tcgp/cards/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/cards/tcgp/cards/"!</div>
}
