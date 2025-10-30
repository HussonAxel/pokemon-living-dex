# 🏗️ Architecture Guide - Creating & Using Queries

Ce guide explique comment créer de nouvelles queries et les utiliser dans la nouvelle architecture optimisée.

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│  React Components (UI)                                  │
│  const { data } = useGetAllAbilities()                  │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓ [TanStack Query Hook]
                 │
┌────────────────┴────────────────────────────────────────┐
│  Query Hooks Layer (src/data/queries/)                  │
│  export useGetAllAbilities()                            │
│  export abilitiesListQueryOptions()                     │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓ [API Call via oRPC]
                 │
┌────────────────┴────────────────────────────────────────┐
│  Backend API (oRPC) (src/orpc/router/)                  │
│  export listAbilities()                                 │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓ [Drizzle ORM Query]
                 │
┌────────────────┴────────────────────────────────────────┐
│  Neon Database (PostgreSQL)                             │
│  SELECT * FROM abilities                                │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Creating a New Query (Step by Step)

### Exemple: Créer une Query pour "Pokémons"

Supposons que vous avez une nouvelle table `pokemons` dans votre base Neon et vous voulez créer une query pour les récupérer.

---

## ÉTAPE 1: Créer l'Endpoint oRPC Backend

### Fichier: `src/orpc/router/pokemons.ts`

```typescript
import { os } from '@orpc/server'
import * as z from 'zod'
import { db } from '@/db/index'
import { pokemons as pokemonsTable } from '@/db/schema'
import { eq } from 'drizzle-orm'

// List all pokemons
export const listPokemons = os
  .input(z.object({}))
  .handler(async () => {
    console.log('[oRPC] listPokemons called - querying Neon database')
    
    try {
      const data = await db.select().from(pokemonsTable)
      console.log(`[oRPC] ✅ Fetched ${data.length} pokemons from database`)
      return data
    } catch (error) {
      console.error('[oRPC] ❌ Error fetching pokemons:', error)
      throw error
    }
  })

// Get pokemon by name
export const getPokemonByName = os
  .input(z.object({ name: z.string() }))
  .handler(async ({ input }) => {
    console.log(`[oRPC] getPokemonByName called with name: ${input.name}`)
    
    try {
      const pokemon = await db
        .select()
        .from(pokemonsTable)
        .where(eq(pokemonsTable.name, input.name))
        .limit(1)
      
      return pokemon[0] || null
    } catch (error) {
      console.error(`[oRPC] ❌ Error fetching pokemon ${input.name}:`, error)
      throw error
    }
  })

// Get pokemons by type
export const getPokemonsByType = os
  .input(z.object({ type: z.string() }))
  .handler(async ({ input }) => {
    console.log(`[oRPC] getPokemonsByType called with type: ${input.type}`)
    
    try {
      const pokemons = await db
        .select()
        .from(pokemonsTable)
        .where(eq(pokemonsTable.type, input.type))
      
      return pokemons
    } catch (error) {
      console.error(`[oRPC] ❌ Error fetching pokemons by type:`, error)
      throw error
    }
  })
```

**⚠️ Important:**
- Utilisez toujours `console.log` avec le préfixe `[oRPC]` pour le debugging
- Importer depuis `@/db/index` (pas `@/db`)
- Utiliser `eq()` de drizzle-orm pour les conditions WHERE
- Toujours avoir try/catch pour gérer les erreurs

---

## ÉTAPE 2: Enregistrer l'Endpoint dans le Router

### Fichier: `src/orpc/router/index.ts`

```typescript
import { addTodo, listTodos } from './todos'
import { listAbilities, getAbilityByName } from './abilities'
import { listItems, getItemByName } from './items'
import { listMoves, getMoveByName } from './moves'
import { listBerries, getBerryByName } from './berries'
import { listTypes, getTypeByName } from './types'
import { listPokemons, getPokemonByName, getPokemonsByType } from './pokemons' // ← AJOUTER

export default {
  listTodos,
  addTodo,
  listAbilities,
  getAbilityByName,
  listItems,
  getItemByName,
  listMoves,
  getMoveByName,
  listBerries,
  getBerryByName,
  listTypes,
  getTypeByName,
  listPokemons,        // ← AJOUTER
  getPokemonByName,    // ← AJOUTER
  getPokemonsByType,   // ← AJOUTER
}
```

---

## ÉTAPE 3: Créer les Query Hooks

### Fichier: `src/data/queries/pokemons-optimized.ts`

```typescript
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { client } from '@/orpc/client'

// ===== QUERY KEYS (Hierarchical Structure) =====
export const POKEMONS_QUERY_KEYS = {
  all: ['pokemons'] as const,
  lists: () => [...POKEMONS_QUERY_KEYS.all, 'list'] as const,
  list: () => [...POKEMONS_QUERY_KEYS.lists()] as const,
  details: () => [...POKEMONS_QUERY_KEYS.all, 'detail'] as const,
  detail: (name: string) => [...POKEMONS_QUERY_KEYS.details(), name] as const,
  byType: () => [...POKEMONS_QUERY_KEYS.all, 'by-type'] as const,
  byTypeDetail: (type: string) => [...POKEMONS_QUERY_KEYS.byType(), type] as const,
}

// ===== QUERY OPTIONS (For SSR & Preloading) =====
export const pokemonsListQueryOptions = () => ({
  queryKey: POKEMONS_QUERY_KEYS.list(),
  queryFn: async () => {
    console.log('[Query] Fetching pokemons from oRPC')
    return await (client.listPokemons as any)({})
  },
  staleTime: Infinity,
  gcTime: 1000 * 60 * 60 * 24 * 365, // 1 year
  refetchOnMount: false,
  refetchOnWindowFocus: false,
})

export const pokemonDetailQueryOptions = (name: string) => ({
  queryKey: POKEMONS_QUERY_KEYS.detail(name),
  queryFn: async () => {
    console.log(`[Query] Fetching pokemon "${name}" from oRPC`)
    return await (client.getPokemonByName as any)({ name })
  },
  staleTime: Infinity,
})

export const pokemonsByTypeQueryOptions = (type: string) => ({
  queryKey: POKEMONS_QUERY_KEYS.byTypeDetail(type),
  queryFn: async () => {
    console.log(`[Query] Fetching pokemons by type "${type}" from oRPC`)
    return await (client.getPokemonsByType as any)({ type })
  },
  staleTime: Infinity,
})

// ===== HOOKS (Use in Components) =====
export const useGetAllPokemons = () => {
  return useQuery(pokemonsListQueryOptions())
}

export const useGetPokemonByName = (name: string) => {
  return useQuery(pokemonDetailQueryOptions(name))
}

export const useGetPokemonsByType = (type: string) => {
  return useQuery(pokemonsByTypeQueryOptions(type))
}

// ===== PREFETCH HOOKS (For SSR & Optimization) =====
export const usePrefetchAllPokemons = () => {
  const qc = useQueryClient()
  return () => qc.ensureQueryData(pokemonsListQueryOptions())
}

export const usePrefetchPokemonByName = (name: string) => {
  const qc = useQueryClient()
  return () => qc.ensureQueryData(pokemonDetailQueryOptions(name))
}

export const usePrefetchPokemonsByType = (type: string) => {
  const qc = useQueryClient()
  return () => qc.ensureQueryData(pokemonsByTypeQueryOptions(type))
}

// ===== INVALIDATION HELPERS (For Cache Management) =====
export const useInvalidatePokemons = () => {
  const qc = useQueryClient()
  return {
    invalidateAll: () => qc.invalidateQueries({ queryKey: POKEMONS_QUERY_KEYS.all }),
    invalidateList: () => qc.invalidateQueries({ queryKey: POKEMONS_QUERY_KEYS.list() }),
    invalidateDetail: (name: string) => qc.invalidateQueries({ queryKey: POKEMONS_QUERY_KEYS.detail(name) }),
    invalidateByType: (type: string) => qc.invalidateQueries({ queryKey: POKEMONS_QUERY_KEYS.byTypeDetail(type) }),
  }
}
```

**Pattern à suivre:**
1. ✅ Query Keys hierarchiques (all → list → detail)
2. ✅ Query Options pour chaque endpoint
3. ✅ Hooks de base (useGetAll, useGetDetail)
4. ✅ Hooks de prefetch (pour SSR)
5. ✅ Helpers d'invalidation (pour les mutations)

---

## ÉTAPE 4: Utiliser dans les Composants

### Exemple 1: List All Pokemons

```typescript
// src/components/pokemonsList.tsx
import { useGetAllPokemons } from '@/data/queries/pokemons-optimized'

export function PokemonsList() {
  const { data, isLoading, error } = useGetAllPokemons()

  if (isLoading) return <div>Loading pokemons...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!data) return <div>No pokemons found</div>

  return (
    <div>
      <h1>All Pokemons ({data.length})</h1>
      <ul>
        {data.map(pokemon => (
          <li key={pokemon.id}>{pokemon.name}</li>
        ))}
      </ul>
    </div>
  )
}
```

### Exemple 2: Get Single Pokemon by Name

```typescript
// src/components/pokemonDetail.tsx
import { useGetPokemonByName } from '@/data/queries/pokemons-optimized'

export function PokemonDetail({ name }: { name: string }) {
  const { data, isLoading, error } = useGetPokemonByName(name)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!data) return <div>Pokemon not found</div>

  return (
    <div>
      <h2>{data.name}</h2>
      <p>Type: {data.type}</p>
      <p>Height: {data.height}</p>
      <p>Weight: {data.weight}</p>
    </div>
  )
}
```

### Exemple 3: Get Pokemons by Type

```typescript
// src/components/pokemonsByType.tsx
import { useGetPokemonsByType } from '@/data/queries/pokemons-optimized'

export function PokemonsByType({ type }: { type: string }) {
  const { data, isLoading } = useGetPokemonsByType(type)

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <h2>{type} Pokemons ({data?.length || 0})</h2>
      {data?.map(pokemon => (
        <div key={pokemon.id}>{pokemon.name}</div>
      ))}
    </div>
  )
}
```

### Exemple 4: Preload Data (SSR)

```typescript
// src/routes/pokemons/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { pokemonsListQueryOptions } from '@/data/queries/pokemons-optimized'
import { PokemonsList } from '@/components/pokemonsList'

export const Route = createFileRoute('/pokemons/')({
  loader: async ({ context }) => {
    // Preload data on server before rendering
    return await context.queryClient.ensureQueryData(pokemonsListQueryOptions())
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1>Pokemons Page</h1>
      <PokemonsList />
    </div>
  )
}
```

---

## 🔄 Data Flow Diagram

```
Component Mount
  ↓
useGetAllPokemons() ← Hook
  ↓
pokemonsListQueryOptions() ← Query Config
  ↓
client.listPokemons() ← oRPC Call
  ↓
POST /api/rpc with { method: 'listPokemons', params: {} }
  ↓
Backend: listPokemons handler
  ↓
db.select().from(pokemonsTable) ← Drizzle Query
  ↓
SELECT * FROM pokemons (Neon Database)
  ↓
Return Data
  ↓
TanStack Query Caches It
  ↓
Component Re-renders with Data ✅
  ↓
Next Time useGetAllPokemons() is called: Use Cache! (No API call)
```

---

## 📋 Checklist: Creating a New Query

- [ ] **Backend (oRPC)**
  - [ ] Créer `src/orpc/router/your-entity.ts`
  - [ ] Exporter les handlers
  - [ ] Ajouter à `src/orpc/router/index.ts`

- [ ] **Frontend (Query Hooks)**
  - [ ] Créer `src/data/queries/your-entity-optimized.ts`
  - [ ] Définir QUERY_KEYS
  - [ ] Créer Query Options
  - [ ] Créer useGet* hooks
  - [ ] Créer usePrefetch* hooks (optionnel)
  - [ ] Créer useInvalidate* helpers (optionnel)

- [ ] **Components**
  - [ ] Importer le hook
  - [ ] Utiliser dans le composant
  - [ ] Gérer les états (loading, error, data)

- [ ] **Routes (SSR)**
  - [ ] Ajouter loader avec ensureQueryData
  - [ ] Data sera preloadée avant rendu

---

## 🎨 Best Practices

### 1. Query Keys Structure
```typescript
// ✅ GOOD - Hierarchical
const KEYS = {
  all: ['pokemons'],
  list: () => [...KEYS.all, 'list'],
  detail: (id) => [...KEYS.all, 'detail', id],
}

// ❌ BAD - Flat
const KEYS = {
  pokemons: 'pokemons',
  detail: 'pokemon-detail',
}
```

### 2. Error Handling
```typescript
// ✅ GOOD - Try/catch in handler
try {
  const data = await db.select().from(table)
  return data
} catch (error) {
  console.error('[oRPC] Error:', error)
  throw error // Let TanStack Query handle it
}

// ❌ BAD - Silently fail
return await db.select().from(table) // No error handling!
```

### 3. Console Logs
```typescript
// ✅ GOOD - Consistent logging
console.log('[oRPC] listPokemons called')
console.log('[Query] Fetching pokemons from oRPC')

// ❌ BAD - Inconsistent
console.log('Getting data...')
console.log('done')
```

### 4. Cache Configuration
```typescript
// ✅ GOOD - Static data (Pokemon)
staleTime: Infinity,
gcTime: 1000 * 60 * 60 * 24 * 365, // 1 year

// ✅ GOOD - Dynamic data (User profile)
staleTime: 1000 * 60 * 5, // 5 minutes
gcTime: 1000 * 60 * 30, // 30 minutes

// ❌ BAD - Not configured properly
// Will refetch too often!
```

### 5. Loading States
```typescript
// ✅ GOOD - Handle all states
const { data, isLoading, error } = useQuery(...)
if (isLoading) return <LoadingSpinner />
if (error) return <ErrorMessage error={error} />
if (!data) return <NoDataMessage />
return <DataContent data={data} />

// ❌ BAD - Missing states
return <div>{data?.map(...)}</div> // What if loading?
```

---

## 🚀 Quick Reference

### Creating a Query - Quick Steps

```bash
# 1. Create backend endpoint
touch src/orpc/router/my-entity.ts

# 2. Add to router
# Edit src/orpc/router/index.ts

# 3. Create query hooks
touch src/data/queries/my-entity-optimized.ts

# 4. Use in component
import { useGetMyEntity } from '@/data/queries/my-entity-optimized'
const { data } = useGetMyEntity()
```

### Query Hook Template

```typescript
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { client } from '@/orpc/client'

export const MY_ENTITY_QUERY_KEYS = {
  all: ['my-entity'] as const,
  list: () => [...MY_ENTITY_QUERY_KEYS.all, 'list'] as const,
  detail: (id: string) => [...MY_ENTITY_QUERY_KEYS.all, 'detail', id] as const,
}

export const myEntityListQueryOptions = () => ({
  queryKey: MY_ENTITY_QUERY_KEYS.list(),
  queryFn: async () => (client.listMyEntity as any)({}),
  staleTime: Infinity,
})

export const useGetAllMyEntity = () => {
  return useQuery(myEntityListQueryOptions())
}
```

---

## 📚 Available Data

Actuellement dans Neon:
- ✅ **Abilities** (303)
- ✅ **Items** (100 limited)
- ✅ **Moves** (100 limited)
- ✅ **Berries** (64)
- ✅ **Types** (20)

Créez de nouveaux endpoints pour accéder à ces données!

---

## 🆘 Troubleshooting

### "client.listPokemons is not a function"
```
✅ Solution: Vérifier que l'endpoint est dans src/orpc/router/index.ts
```

### "relation 'pokemons' does not exist"
```
✅ Solution: Créer les tables avec: npm run db:push
```

### "Data is undefined in component"
```
✅ Solution: 
- Vérifier que le query hook retourne les données
- Gérer l'état loading
- Vérifier les console logs pour debug
```

### "Query never refreshes (always stale)"
```
✅ Solution: Utiliser staleTime approprié
- Static data: staleTime: Infinity
- Dynamic data: staleTime: 1000 * 60 * 5
```

---

## 🎓 Key Concepts

**Query Keys**: Cache identifiers
```typescript
['pokemons'] // All pokemon queries
['pokemons', 'list'] // List query specifically
['pokemons', 'detail', 'pikachu'] // Detail query for Pikachu
```

**Query Options**: Configuration for queries
```typescript
{
  queryKey: [...],
  queryFn: async () => {...},
  staleTime: 1000 * 60 * 5,
  gcTime: 1000 * 60 * 30,
}
```

**Hooks**: React interface to queries
```typescript
useGetAllPokemons() // List hook
useGetPokemonByName('pikachu') // Detail hook
usePrefetchAllPokemons() // Preload hook
```

---

**Prêt à créer vos propres queries?** 🚀
