import { os } from '@orpc/server'
import * as z from 'zod'
import { db } from '@/db/index'
import { berries as berriesTable } from '@/db/schema'
import { eq } from 'drizzle-orm'

export const listBerries = os
  .input(z.object({}))
  .handler(async () => {
    console.log('[oRPC] listBerries called - querying Neon database')
    
    try {
      const data = await db.select().from(berriesTable)
      console.log(`[oRPC] ✅ Fetched ${data.length} berries from database`)
      return data
    } catch (error) {
      console.error('[oRPC] ❌ Error fetching berries:', error)
      throw error
    }
  })

export const getBerryByName = os
  .input(z.object({ name: z.string() }))
  .handler(async ({ input }) => {
    console.log(`[oRPC] getBerryByName called with name: ${input.name}`)
    
    try {
      const berry = await db
        .select()
        .from(berriesTable)
        .where(eq(berriesTable.name, input.name))
        .limit(1)
      
      return berry[0] || null
    } catch (error) {
      console.error(`[oRPC] ❌ Error fetching berry ${input.name}:`, error)
      throw error
    }
  })
