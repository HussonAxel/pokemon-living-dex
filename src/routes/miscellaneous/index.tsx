import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/miscellaneous/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/catchratecalculator/"!</div>
}
