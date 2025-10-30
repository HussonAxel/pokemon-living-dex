import { os } from '@orpc/server'
import * as z from 'zod'

const getItemsFromAPI = async () => {
  const res = await fetch('https://pokeapi.co/api/v2/item?limit=-1')
  const data = await res.json()

  const detailed = await Promise.all(
    data.results.map((item: any) =>
      fetch(`https://pokeapi.co/api/v2/item/${item.name}`)
        .then(r => r.json())
    )
  )

  return data.results.map((item: any, idx: number) => ({
    ...item,
    details: detailed[idx],
  }))
}

export const listItems = os
  .input(z.object({}))
  .handler(async () => {
    console.log('[oRPC] listItems called')
    return await getItemsFromAPI()
  })

export const getItemByName = os
  .input(z.object({ name: z.string() }))
  .handler(async ({ input }) => {
    console.log(`[oRPC] getItemByName called with name: ${input.name}`)
    const items = await getItemsFromAPI()
    return items.find((i: any) => i.name === input.name)
  })
