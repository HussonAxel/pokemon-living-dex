import { createFileRoute } from '@tanstack/react-router'
import BerriesTable from '@/components/berriesTable'

export const Route = createFileRoute('/berries/')({
  component: RouteComponent,
})

function RouteComponent() {

  return (
    <div className='max-w-[80%] w-full mx-auto my-16'>
      <h1 className='text-5xl font-bold mb-8'>Pokémon Berry List</h1>
      <BerriesTable />
    </div>
  )
}
