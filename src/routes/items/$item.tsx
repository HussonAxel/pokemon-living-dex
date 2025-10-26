import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/items/$item')({
  component: RouteComponent,
})

function RouteComponent() {
  const { item } = Route.useParams()
  return <div>Item: {item}</div>
}
