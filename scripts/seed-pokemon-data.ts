/**
 * Seed Script: Import Pokemon Data from PokeAPI to Neon
 * 
 * Usage: npx tsx scripts/seed-pokemon-data.ts
 * 
 * This script runs ONCE to import all Pokemon data (abilities, items, moves, berries, types)
 * from PokeAPI into your Neon database. After this, all data is stored locally!
 */

import { db } from '@/db/index'
import { abilities, items, moves, berries, types } from '../src/db/schema'

const BASE_URL = 'https://pokeapi.co/api/v2'

async function seedAbilities() {
  console.log('📥 Fetching abilities from PokeAPI...')
  const res = await fetch(`${BASE_URL}/ability?limit=-1`)
  const data = await res.json()
  
  console.log(`🔄 Processing ${data.results.length} abilities...`)
  
  for (const ability of data.results) {
    const detail = await fetch(`${BASE_URL}/ability/${ability.name}`).then(r => r.json())
    
    try {
      await db.insert(abilities).values({
        id: detail.id,
        name: ability.name,
        url: ability.url,
        generation: detail.generation?.name || '',
        effectEntries: detail.effect_entries || [],
        pokemonCount: detail.pokemon?.length || 0,
        details: detail,
      }).onConflictDoUpdate({
        target: abilities.name,
        set: {
          details: detail,
          pokemonCount: detail.pokemon?.length || 0,
        }
      })
    } catch (error) {
      console.error(`❌ Error inserting ability ${ability.name}:`, error)
    }
  }
  
  console.log(`✅ ${data.results.length} abilities seeded!`)
}

/* async function seedItems() {
  console.log('\n📥 Fetching items from PokeAPI...')
  const res = await fetch(`${BASE_URL}/item?limit=-1`)
  const data = await res.json()
  
  console.log(`🔄 Processing ${data.results.length} items...`)
  
  for (const item of data.results) {
    const detail = await fetch(`${BASE_URL}/item/${item.name}`).then(r => r.json())
    
    try {
      await db.insert(items).values({
        id: detail.id,
        name: item.name,
        url: item.url,
        category: detail.category?.name || '',
        details: detail,
      }).onConflictDoUpdate({
        target: items.name,
        set: { details: detail }
      })
    } catch (error) {
      console.error(`❌ Error inserting item ${item.name}:`, error)
    }
  }
  
  console.log(`✅ ${data.results.length} items seeded!`)
}

async function seedMoves() {
  console.log('\n📥 Fetching moves from PokeAPI...')
  const res = await fetch(`${BASE_URL}/move?limit=-1`)
  const data = await res.json()
  
  console.log(`🔄 Processing ${data.results.length} moves...`)
  
  for (const move of data.results) {
    const detail = await fetch(`${BASE_URL}/move/${move.name}`).then(r => r.json())
    
    try {
      await db.insert(moves).values({
        id: detail.id,
        name: move.name,
        url: move.url,
        type: detail.type?.name || '',
        power: detail.power || 0,
        accuracy: detail.accuracy || 0,
        details: detail,
      }).onConflictDoUpdate({
        target: moves.name,
        set: { details: detail }
      })
    } catch (error) {
      console.error(`❌ Error inserting move ${move.name}:`, error)
    }
  }
  
  console.log(`✅ ${data.results.length} moves seeded!`)
} */

async function seedBerries() {
  console.log('\n📥 Fetching berries from PokeAPI...')
  const res = await fetch(`${BASE_URL}/berry?limit=-1`)
  const data = await res.json()
  
  console.log(`🔄 Processing ${data.results.length} berries...`)
  
  for (const berry of data.results) {
    const detail = await fetch(`${BASE_URL}/berry/${berry.name}`).then(r => r.json())
    
    try {
      await db.insert(berries).values({
        id: detail.id,
        name: berry.name,
        url: berry.url,
        firmness: detail.firmness?.name || '',
        details: detail,
      }).onConflictDoUpdate({
        target: berries.name,
        set: { details: detail }
      })
    } catch (error) {
      console.error(`❌ Error inserting berry ${berry.name}:`, error)
    }
  }
  
  console.log(`✅ ${data.results.length} berries seeded!`)
}

async function seedTypes() {
  console.log('\n📥 Fetching types from PokeAPI...')
  const res = await fetch(`${BASE_URL}/type?limit=-1`)
  const data = await res.json()
  
  console.log(`🔄 Processing ${data.results.length} types...`)
  
  for (const type of data.results) {
    const detail = await fetch(`${BASE_URL}/type/${type.name}`).then(r => r.json())
    
    try {
      await db.insert(types).values({
        id: detail.id,
        name: type.name,
        url: type.url,
        details: detail,
      }).onConflictDoUpdate({
        target: types.name,
        set: { details: detail }
      })
    } catch (error) {
      console.error(`❌ Error inserting type ${type.name}:`, error)
    }
  }
  
  console.log(`✅ ${data.results.length} types seeded!`)
}

async function main() {
  console.log('🌱 Starting Pokemon Data Seed...')
  console.log('================================\n')
  
  try {
    await seedAbilities()
    // await seedItems()
    // await seedMoves()
    await seedBerries()
    await seedTypes()
    
    console.log('\n================================')
    console.log('✅ All data seeded successfully!')
    console.log('🚀 Your database is ready to use!')
    console.log('\nNext steps:')
    console.log('1. Run: npm run dev')
    console.log('2. Check your abilities page - should load FAST now! ⚡')
    
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Seed failed:', error)
    process.exit(1)
  }
}

main()
