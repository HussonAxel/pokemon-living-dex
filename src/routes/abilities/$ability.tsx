import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/abilities/$ability')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/abilities/$ability"!</div>
}
