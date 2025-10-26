import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/strategy/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/strategy/"!</div>
}
