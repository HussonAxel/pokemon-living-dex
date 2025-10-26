import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/berries/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/berries/"!</div>
}
