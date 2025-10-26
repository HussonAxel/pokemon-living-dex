import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sprites/$sprite')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/sprites/$sprite"!</div>
}
