import { os } from '@orpc/server'
import * as z from 'zod'

const getBerriesFromAPI = async () => {
  const res = await fetch('https://pokeapi.co/api/v2/berry?limit=-1')
  const data = await res.json()

  const detailed = await Promise.all(
    data.results.map((berry: any) =>
      fetch(`https://pokeapi.co/api/v2/berry/${berry.name}`)
        .then(r => r.json())
    )
  )

  return data.results.map((berry: any, idx: number) => ({
    ...berry,
    details: detailed[idx],
  }))
}

export const listBerries = os
  .input(z.object({}))
  .handler(async () => {
    console.log('[oRPC] listBerries called')
    return await getBerriesFromAPI()
  })

export const getBerryByName = os
  .input(z.object({ name: z.string() }))
  .handler(async ({ input }) => {
    console.log(`[oRPC] getBerryByName called with name: ${input.name}`)
    const berries = await getBerriesFromAPI()
    return berries.find((b: any) => b.name === input.name)
  })
