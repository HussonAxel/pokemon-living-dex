import { os } from '@orpc/server'
import * as z from 'zod'

const getMovesFromAPI = async () => {
  const res = await fetch('https://pokeapi.co/api/v2/move?limit=-1')
  const data = await res.json()

  const detailed = await Promise.all(
    data.results.map((move: any) =>
      fetch(`https://pokeapi.co/api/v2/move/${move.name}`)
        .then(r => r.json())
    )
  )

  return data.results.map((move: any, idx: number) => ({
    ...move,
    details: detailed[idx],
  }))
}

export const listMoves = os
  .input(z.object({}))
  .handler(async () => {
    console.log('[oRPC] listMoves called')
    return await getMovesFromAPI()
  })

export const getMoveByName = os
  .input(z.object({ name: z.string() }))
  .handler(async ({ input }) => {
    console.log(`[oRPC] getMoveByName called with name: ${input.name}`)
    const moves = await getMovesFromAPI()
    return moves.find((m: any) => m.name === input.name)
  })
