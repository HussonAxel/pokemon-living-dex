import { os } from '@orpc/server'
import * as z from 'zod'
import { db } from '@/db/index'
import { types as typesTable } from '@/db/schema'
import { eq } from 'drizzle-orm'

export const listTypes = os
  .input(z.object({}))
  .handler(async () => {
    console.log('[oRPC] listTypes called - querying Neon database')
    
    try {
      const data = await db.select().from(typesTable)
      console.log(`[oRPC] ✅ Fetched ${data.length} types from database`)
      return data
    } catch (error) {
      console.error('[oRPC] ❌ Error fetching types:', error)
      throw error
    }
  })

export const getTypeByName = os
  .input(z.object({ name: z.string() }))
  .handler(async ({ input }) => {
    console.log(`[oRPC] getTypeByName called with name: ${input.name}`)
    
    try {
      const type = await db
        .select()
        .from(typesTable)
        .where(eq(typesTable.name, input.name))
        .limit(1)
      
      return type[0] || null
    } catch (error) {
      console.error(`[oRPC] ❌ Error fetching type ${input.name}:`, error)
      throw error
    }
  })
