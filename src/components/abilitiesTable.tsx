import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { SearchIcon, ChevronUpIcon, ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { abilitiesListQueryOptions } from "@/data/queries/abilities-optimized"

type AbilityItem = {
  id: number
  name: string
  effect: string
  generation: string
  pokemonCount: number
}

type SortField = "name" | "generation" | "pokemonCount"

function AbilitiesContent({ items }: { items: AbilityItem[] }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGeneration, setSelectedGeneration] = useState<string | undefined>()
  const [pokemonCountRange, setPokemonCountRange] = useState<[number | undefined, number | undefined]>([undefined, undefined])
  const [sortBy, setSortBy] = useState<SortField>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const uniqueGenerations = useMemo(() => {
    return Array.from(new Set(items.map((item) => item.generation))).sort()
  }, [items])

  const filteredItems = useMemo(() => {
    let result = items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.effect.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesGeneration =
        !selectedGeneration || item.generation === selectedGeneration

      const matchesCount =
        (!pokemonCountRange[0] || item.pokemonCount >= pokemonCountRange[0]) &&
        (!pokemonCountRange[1] || item.pokemonCount <= pokemonCountRange[1])

      return matchesSearch && matchesGeneration && matchesCount
    })

    result.sort((a, b) => {
      let aVal = a[sortBy]
      let bVal = b[sortBy]

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase()
        bVal = (bVal as string).toLowerCase()
      }

      const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0
      return sortOrder === "asc" ? comparison : -comparison
    })

    return result
  }, [items, searchQuery, selectedGeneration, pokemonCountRange, sortBy, sortOrder])

  const toggleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
        <div className="flex-1 min-w-44">
          <Label htmlFor="search">Search</Label>
          <div className="relative mt-2">
            <Input
              id="search"
              className="peer ps-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or effect..."
              type="text"
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
              <SearchIcon size={16} />
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-36">
          <Label htmlFor="generation">Generation</Label>
          <Select
            value={selectedGeneration ?? "all"}
            onValueChange={(value) =>
              setSelectedGeneration(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger id="generation" className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {uniqueGenerations.map((gen) => (
                <SelectItem key={gen} value={gen}>
                  {gen}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-36">
          <Label>Pokémon Count Range</Label>
          <div className="flex gap-2 mt-2">
            <Input
              className="flex-1 [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
              value={pokemonCountRange[0] ?? ""}
              onChange={(e) =>
                setPokemonCountRange([
                  e.target.value ? Number(e.target.value) : undefined,
                  pokemonCountRange[1],
                ])
              }
              placeholder="Min"
              type="number"
            />
            <Input
              className="flex-1 [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
              value={pokemonCountRange[1] ?? ""}
              onChange={(e) =>
                setPokemonCountRange([
                  pokemonCountRange[0],
                  e.target.value ? Number(e.target.value) : undefined,
                ])
              }
              placeholder="Max"
              type="number"
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredItems.length} résultats
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => toggleSort("name")}
              className={cn(
                "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded hover:bg-muted transition-colors",
                sortBy === "name" && "bg-muted"
              )}
            >
              Name
              {sortBy === "name" &&
                (sortOrder === "asc" ? (
                  <ChevronUpIcon size={16} />
                ) : (
                  <ChevronDownIcon size={16} />
                ))}
            </button>
            <button
              onClick={() => toggleSort("generation")}
              className={cn(
                "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded hover:bg-muted transition-colors",
                sortBy === "generation" && "bg-muted"
              )}
            >
              Gen
              {sortBy === "generation" &&
                (sortOrder === "asc" ? (
                  <ChevronUpIcon size={16} />
                ) : (
                  <ChevronDownIcon size={16} />
                ))}
            </button>
            <button
              onClick={() => toggleSort("pokemonCount")}
              className={cn(
                "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded hover:bg-muted transition-colors",
                sortBy === "pokemonCount" && "bg-muted"
              )}
            >
              Count
              {sortBy === "pokemonCount" &&
                (sortOrder === "asc" ? (
                  <ChevronUpIcon size={16} />
                ) : (
                  <ChevronDownIcon size={16} />
                ))}
            </button>
          </div>
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid gap-3">
            {filteredItems.map((item) => (
              <Link
                key={item.id}
                to="/abilities/$ability"
                params={{ ability: item.name }}
                className="block p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="capitalize font-semibold text-base mb-2">
                      {item.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {item.effect}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="inline-block px-2 py-1 rounded bg-muted">
                        <strong>Gen:</strong> {item.generation}
                      </span>
                      <span className="inline-block px-2 py-1 rounded bg-muted">
                        <strong>Pokémon:</strong> {item.pokemonCount}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun résultat trouvé.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AbilitiesTable() {
  const { data, isLoading, error } = useQuery(abilitiesListQueryOptions())
  const filteredData = data?.filter(
    (ability: any) => {
      const effectEntry = ability.details?.effect_entries.find((entry: any) => entry.language.name === "en")
      const shortEffect = effectEntry?.short_effect?.trim()
      return ability.details?.pokemon.length > 0 && !!shortEffect
    }
  )
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!data) return <div>No data</div>
  const items: AbilityItem[] = filteredData.map((ability: any) => ({
    id: ability.details?.id || 0,
    name: ability.name,
    effect: ability.details?.effect_entries.find((entry: any) => entry.language.name === "en")?.short_effect,
    generation: ability.details?.generation.name.replace("generation-", "").toUpperCase(),
    pokemonCount: ability.details?.pokemon.length || 0,
  }))

  return <AbilitiesContent items={items} />
}