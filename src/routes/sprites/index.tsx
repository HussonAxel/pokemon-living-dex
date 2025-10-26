import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sprites/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/sprites/"!</div>
}
