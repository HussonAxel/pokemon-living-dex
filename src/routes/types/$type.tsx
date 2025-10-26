import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/types/$type')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/types/$type"!</div>
}
