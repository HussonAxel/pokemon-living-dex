import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/locations/$location')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/locations/$location"!</div>
}
