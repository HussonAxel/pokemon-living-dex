import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/cards/tcgp/$card')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/cards/tcgp/$card"!</div>
}
