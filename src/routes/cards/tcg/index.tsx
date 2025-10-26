import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/cards/tcg/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/cards/tcg/"!</div>
}
