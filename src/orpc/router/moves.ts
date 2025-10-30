import { os } from '@orpc/server'
import * as z from 'zod'
import { db } from '@/db/index'
import { moves as movesTable } from '@/db/schema'
import { eq } from 'drizzle-orm'

export const listMoves = os
  .input(z.object({}))
  .handler(async () => {
    console.log('[oRPC] listMoves called - querying Neon database')
    
    try {
      const data = await db.select().from(movesTable)
      console.log(`[oRPC] ✅ Fetched ${data.length} moves from database`)
      return data
    } catch (error) {
      console.error('[oRPC] ❌ Error fetching moves:', error)
      throw error
    }
  })

export const getMoveByName = os
  .input(z.object({ name: z.string() }))
  .handler(async ({ input }) => {
    console.log(`[oRPC] getMoveByName called with name: ${input.name}`)
    
    try {
      const move = await db
        .select()
        .from(movesTable)
        .where(eq(movesTable.name, input.name))
        .limit(1)
      
      return move[0] || null
    } catch (error) {
      console.error(`[oRPC] ❌ Error fetching move ${input.name}:`, error)
      throw error
    }
  })
