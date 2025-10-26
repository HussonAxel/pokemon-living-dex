import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/miscellaneous/growthrate')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/miscellaneous/growthrate"!</div>
}
