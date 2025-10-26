import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/miscellaneous/catchratecalculator')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/miscellaneous/catchratecalculator"!</div>
}
