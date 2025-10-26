import { createFileRoute } from '@tanstack/react-router'
import GridHeaderMenu from '@/components/gridHeaderMenu'

export const Route = createFileRoute('/')({ component: App })

function App() {


  return (
    <GridHeaderMenu />
  )
}
