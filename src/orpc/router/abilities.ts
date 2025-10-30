import { os } from '@orpc/server'
import * as z from 'zod'
import { db } from '@/db/index'
import { abilities as abilitiesTable } from '@/db/schema'
import { eq } from 'drizzle-orm'

export const listAbilities = os
  .input(z.object({}))
  .handler(async () => {
    console.log('[oRPC] listAbilities called - querying Neon database')
    
    try {
      const data = await db.select().from(abilitiesTable)
      console.log(`[oRPC] ✅ Fetched ${data.length} abilities from database`)
      return data
    } catch (error) {
      console.error('[oRPC] ❌ Error fetching abilities:', error)
      throw error
    }
  })

export const getAbilityByName = os
  .input(z.object({ name: z.string() }))
  .handler(async ({ input }) => {
    console.log(`[oRPC] getAbilityByName called with name: ${input.name}`)
    
    try {
      const ability = await db
        .select()
        .from(abilitiesTable)
        .where(eq(abilitiesTable.name, input.name))
        .limit(1)
      
      return ability[0] || null
    } catch (error) {
      console.error(`[oRPC] ❌ Error fetching ability ${input.name}:`, error)
      throw error
    }
  })
