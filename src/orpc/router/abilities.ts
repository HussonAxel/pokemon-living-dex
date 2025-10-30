import { os } from '@orpc/server'
import * as z from 'zod'

// TODO: En production, remplacer par une requête Drizzle ORM à Neon
// const abilities = await db.query.abilities.findMany({ with: { pokemon: true } })
const getAbilitiesFromAPI = async () => {
  const res = await fetch('https://pokeapi.co/api/v2/ability?limit=-1')
  const data = await res.json()

  // Consolidation côté serveur: une seule boucle Promise.all
  const detailed = await Promise.all(
    data.results.map((ability: any) =>
      fetch(`https://pokeapi.co/api/v2/ability/${ability.name}`)
        .then(r => r.json())
    )
  )

  return data.results.map((ability: any, idx: number) => ({
    ...ability,
    details: detailed[idx],
  }))
}

export const listAbilities = os
  .input(z.object({}))
  .handler(async () => {
    console.log('[oRPC] listAbilities called')
    return await getAbilitiesFromAPI()
  })

export const getAbilityByName = os
  .input(z.object({ name: z.string() }))
  .handler(async ({ input }) => {
    console.log(`[oRPC] getAbilityByName called with name: ${input.name}`)
    const abilities = await getAbilitiesFromAPI()
    return abilities.find((a: any) => a.name === input.name)
  })
