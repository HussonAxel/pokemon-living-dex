import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/moves/$move')({
  component: RouteComponent,
})

function RouteComponent() {
  const { move } = Route.useParams()
  return <div>Move: {move}</div>
}
