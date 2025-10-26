import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tcg/cards/$card')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/cards/tcg/cards/$card"!</div>
}
