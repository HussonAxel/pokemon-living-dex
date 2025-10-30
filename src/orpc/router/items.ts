import { os } from '@orpc/server'
import * as z from 'zod'
import { db } from '@/db/index'
import { items as itemsTable } from '@/db/schema'
import { eq } from 'drizzle-orm'

export const listItems = os
  .input(z.object({}))
  .handler(async () => {
    console.log('[oRPC] listItems called - querying Neon database')
    
    try {
      const data = await db.select().from(itemsTable)
      console.log(`[oRPC] ✅ Fetched ${data.length} items from database`)
      return data
    } catch (error) {
      console.error('[oRPC] ❌ Error fetching items:', error)
      throw error
    }
  })

export const getItemByName = os
  .input(z.object({ name: z.string() }))
  .handler(async ({ input }) => {
    console.log(`[oRPC] getItemByName called with name: ${input.name}`)
    
    try {
      const item = await db
        .select()
        .from(itemsTable)
        .where(eq(itemsTable.name, input.name))
        .limit(1)
      
      return item[0] || null
    } catch (error) {
      console.error(`[oRPC] ❌ Error fetching item ${input.name}:`, error)
      throw error
    }
  })
