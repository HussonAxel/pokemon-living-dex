import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/berries/$berry')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/berries/$berry"!</div>
}
