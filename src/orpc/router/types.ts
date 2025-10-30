import { os } from '@orpc/server'
import * as z from 'zod'

const getTypesFromAPI = async () => {
  const res = await fetch('https://pokeapi.co/api/v2/type?limit=-1')
  const data = await res.json()

  const detailed = await Promise.all(
    data.results.map((type: any) =>
      fetch(`https://pokeapi.co/api/v2/type/${type.name}`)
        .then(r => r.json())
    )
  )

  return data.results.map((type: any, idx: number) => ({
    ...type,
    details: detailed[idx],
  }))
}

export const listTypes = os
  .input(z.object({}))
  .handler(async () => {
    console.log('[oRPC] listTypes called')
    return await getTypesFromAPI()
  })

export const getTypeByName = os
  .input(z.object({ name: z.string() }))
  .handler(async ({ input }) => {
    console.log(`[oRPC] getTypeByName called with name: ${input.name}`)
    const types = await getTypesFromAPI()
    return types.find((t: any) => t.name === input.name)
  })
