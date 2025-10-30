import { os } from '@orpc/server'
import * as z from 'zod'
import { db } from '@/db/index'
import { abilities as abilitiesTable } from '@/db/schema'
import { eq } from 'drizzle-orm'

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 1000 * 60 * 60 // 1 hour

function getFromCache(key: string) {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[oRPC] 💾 Cache hit for ${key}`)
    return cached.data
  }
  cache.delete(key)
  return null
}

function setCache(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() })
}

export const listAbilities = os
  .input(z.object({}))
  .handler(async () => {
    console.log('[oRPC] listAbilities called - querying Neon database')
    
    // Check cache first
    const cached = getFromCache('abilities-list')
    if (cached) return cached
    
    try {
      const data = await db.select().from(abilitiesTable)
      console.log(`[oRPC] ✅ Fetched ${data.length} abilities from database`)
      
      // Cache the result
      setCache('abilities-list', data)
      
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
    
    // Check cache
    const cacheKey = `ability-${input.name}`
    const cached = getFromCache(cacheKey)
    if (cached) return cached
    
    try {
      const ability = await db
        .select()
        .from(abilitiesTable)
        .where(eq(abilitiesTable.name, input.name))
        .limit(1)
      
      const result = ability[0] || null
      if (result) {
        setCache(cacheKey, result)
      }
      
      return result
    } catch (error) {
      console.error(`[oRPC] ❌ Error fetching ability ${input.name}:`, error)
      throw error
    }
  })
