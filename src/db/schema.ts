import { pgTable, serial, text, timestamp, integer, json } from 'drizzle-orm/pg-core'

// Existing todos table
export const todos = pgTable('todos', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

// ===== POKEMON DATA TABLES =====

// Abilities Table
export const abilities = pgTable('abilities', {
  id: integer('id').primaryKey(),
  name: text('name').notNull().unique(),
  url: text('url').notNull(),
  generation: text('generation'),
  effectEntries: json('effect_entries'),
  pokemonCount: integer('pokemon_count').default(0),
  details: json('details'), // Full PokeAPI response
  createdAt: timestamp('created_at').defaultNow(),
})

// Items Table
export const items = pgTable('items', {
  id: integer('id').primaryKey(),
  name: text('name').notNull().unique(),
  url: text('url').notNull(),
  category: text('category'),
  details: json('details'), // Full PokeAPI response
  createdAt: timestamp('created_at').defaultNow(),
})

// Moves Table
export const moves = pgTable('moves', {
  id: integer('id').primaryKey(),
  name: text('name').notNull().unique(),
  url: text('url').notNull(),
  type: text('type'),
  power: integer('power'),
  accuracy: integer('accuracy'),
  details: json('details'), // Full PokeAPI response
  createdAt: timestamp('created_at').defaultNow(),
})

// Berries Table
export const berries = pgTable('berries', {
  id: integer('id').primaryKey(),
  name: text('name').notNull().unique(),
  url: text('url').notNull(),
  firmness: text('firmness'),
  details: json('details'), // Full PokeAPI response
  createdAt: timestamp('created_at').defaultNow(),
})

// Types Table
export const types = pgTable('types', {
  id: integer('id').primaryKey(),
  name: text('name').notNull().unique(),
  url: text('url').notNull(),
  details: json('details'), // Full PokeAPI response
  createdAt: timestamp('created_at').defaultNow(),
})
