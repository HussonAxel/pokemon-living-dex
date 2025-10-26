"use client"

import { useId, useMemo, useState } from "react"
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  RowData,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import {
  ChevronDownIcon,
  ChevronUpIcon,
  SearchIcon,
} from "lucide-react"

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { useGetAllBerriesWithData } from "@/data/queries/pokemons"
import { PokeAPI } from "pokeapi-types";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "range" | "select"
  }
}

type BerryFlavor = {
  flavor: { name: string; url: string }
  potency: number
}

type Item = {
  id: number
  name: string
  image: string
  firmness: string
  flavors: BerryFlavor[]
  growthTime: number
  maxHarvest: number
  naturalGiftPower: number
  naturalGiftType: string
  size: number
  smoothness: number
  soilDryness: number
}

const columns: ColumnDef<Item>[] = [
  {
    header: "Image",
    accessorKey: "image",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <img
          src={row.getValue("image")}
          alt={row.original.name}
          className="w-8 h-8 object-contain"
          onError={(e) => {
            e.currentTarget.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23f0f0f0' width='100' height='100'/%3E%3Ctext x='50' y='50' font-size='14' text-anchor='middle' dy='.3em' fill='%23999'%3ENo image%3C/text%3E%3C/svg%3E"
          }}
        />
      </div>
    ),
    enableSorting: false,
  },
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="capitalize font-semibold">{row.getValue("name")}</div>
    ),
    meta: {
      filterVariant: "text",
    },
  },
  {
    header: "Effect", 
    accessorKey: "effect",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("effect")}</div>
    ),
    meta: {
      filterVariant: "text",
    },
  },
  {
    header: "Firmness",
    accessorKey: "firmness",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("firmness")}</div>
    ),
    meta: {
      filterVariant: "select",
    },
  },
  {
    header: "Flavors",
    accessorKey: "flavors",
    cell: ({ row }) => {
      const flavors = row.getValue("flavors") as BerryFlavor[]
      const primaryFlavors = flavors.filter((f) => f.potency > 0)
      return (
        <div className="flex gap-1 flex-wrap">
          {primaryFlavors.map((flavor) => {
            const flavorColors: Record<string, string> = {
              spicy: "bg-red-400/20 text-red-500",
              dry: "bg-yellow-400/20 text-yellow-500",
              sweet: "bg-pink-400/20 text-pink-500",
              bitter: "bg-green-400/20 text-green-500",
              sour: "bg-purple-400/20 text-purple-500",
            }

            const colorClass =
              flavorColors[flavor.flavor.name] ||
              "bg-gray-400/20 text-gray-500"

            return (
              <div
                key={flavor.flavor.name}
                className={cn(
                  "flex items-center justify-center px-2 py-1 rounded text-xs font-semibold",
                  colorClass
                )}
              >
                {flavor.flavor.name.toUpperCase()}
              </div>
            )
          })}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    header: "Growth Time",
    accessorKey: "growthTime",
    cell: ({ row }) => <div>{row.getValue("growthTime")} hrs</div>,
    meta: {
      filterVariant: "range",
    },
  },
  {
    header: "Max Harvest",
    accessorKey: "maxHarvest",
    cell: ({ row }) => <div>{row.getValue("maxHarvest")}</div>,
    meta: {
      filterVariant: "range",
    },
  },
  {
    header: "Natural Gift Power",
    accessorKey: "naturalGiftPower",
    cell: ({ row }) => <div>{row.getValue("naturalGiftPower")}</div>,
    meta: {
      filterVariant: "range",
    },
  },
  {
    header: "Natural Gift Type",
    accessorKey: "naturalGiftType",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("naturalGiftType")}</div>
    ),
    meta: {
      filterVariant: "select",
    },
  },
  {
    header: "Size",
    accessorKey: "size",
    cell: ({ row }) => <div>{row.getValue("size")} cm</div>,
    meta: {
      filterVariant: "range",
    },
  },
  {
    header: "Smoothness",
    accessorKey: "smoothness",
    cell: ({ row }) => <div>{row.getValue("smoothness")}</div>,
    meta: {
      filterVariant: "range",
    },
  },
  {
    header: "Soil Dryness",
    accessorKey: "soilDryness",
    cell: ({ row }) => <div>{row.getValue("soilDryness")}</div>,
    meta: {
      filterVariant: "range",
    },
  },
]

// SEPARATE COMPONENT FOR TABLE CONTENT
function BerriesTableContent({ items }: { items: Item[] }) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "name",
      desc: false,
    },
  ])

  const table = useReactTable({
    data: items,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
  })

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Search input */}
        <div className="w-44">
          <Filter column={table.getColumn("name")!} />
        </div>
        {/* Firmness select */}
        <div className="w-36">
          <Filter column={table.getColumn("firmness")!} />
        </div>
        {/* Natural Gift Type select */}
        <div className="w-36">
          <Filter column={table.getColumn("naturalGiftType")!} />
        </div>
        {/* Growth Time range */}
        <div className="w-36">
          <Filter column={table.getColumn("growthTime")!} />
        </div>
        {/* Size range */}
        <div className="w-36">
          <Filter column={table.getColumn("size")!} />
        </div>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-muted/50">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="relative h-10 border-t select-none"
                    aria-sort={
                      header.column.getIsSorted() === "asc"
                        ? "ascending"
                        : header.column.getIsSorted() === "desc"
                          ? "descending"
                          : "none"
                    }
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <div
                        className={cn(
                          header.column.getCanSort() &&
                            "flex h-full cursor-pointer items-center justify-between gap-2 select-none font-semibold py-4"
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                        onKeyDown={(e) => {
                          if (
                            header.column.getCanSort() &&
                            (e.key === "Enter" || e.key === " ")
                          ) {
                            e.preventDefault()
                            header.column.getToggleSortingHandler()?.(e)
                          }
                        }}
                        tabIndex={header.column.getCanSort() ? 0 : undefined}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: (
                            <ChevronUpIcon
                              className="shrink-0 opacity-60"
                              size={16}
                              aria-hidden="true"
                            />
                          ),
                          desc: (
                            <ChevronDownIcon
                              className="shrink-0 opacity-60"
                              size={16}
                              aria-hidden="true"
                            />
                          ),
                        }[header.column.getIsSorted() as string] ?? (
                          <span className="size-4" aria-hidden="true" />
                        )}
                      </div>
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default function BerriesTable() {
  const { data, isLoading, error } = useGetAllBerriesWithData()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!data) return <div>No data</div>

  const items: Item[] = data.map((berry: PokeAPI.Berry) => ({
    
    id: berry.details?.id || 0,
    name: berry.name,
    image: `https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/items/berries/${berry.name}-berry.png`,
    effect: berry.item?.effect_entries[0]?.short_effect || "unknown",
    firmness: berry.details?.firmness?.name || "unknown",
    flavors: berry.details?.flavors || [],
    growthTime: berry.details?.growth_time || 0,
    maxHarvest: berry.details?.max_harvest || 0,
    naturalGiftPower: berry.details?.natural_gift_power || 0,
    naturalGiftType: berry.details?.natural_gift_type?.name || "unknown",
    size: berry.details?.size || 0,
    smoothness: berry.details?.smoothness || 0,
    soilDryness: berry.details?.soil_dryness || 0,
  }))

  return <BerriesTableContent items={items} />
}

function Filter({ column }: { column: Column<any, unknown> }) {
  const id = useId()
  const columnFilterValue = column.getFilterValue()
  const { filterVariant } = column.columnDef.meta ?? {}
  const columnHeader =
    typeof column.columnDef.header === "string" ? column.columnDef.header : ""
  const sortedUniqueValues = useMemo(() => {
    if (filterVariant === "range") return []

    const values = Array.from(column.getFacetedUniqueValues().keys())

    const flattenedValues = values.reduce((acc: string[], curr) => {
      if (Array.isArray(curr)) {
        return [...acc, ...curr]
      }
      return [...acc, curr]
    }, [])

    return Array.from(new Set(flattenedValues)).sort()
  }, [column.getFacetedUniqueValues(), filterVariant])

  if (filterVariant === "range") {
    return (
      <div className="*:not-first:mt-2">
        <Label>{columnHeader}</Label>
        <div className="flex">
          <Input
            id={`${id}-range-1`}
            className="flex-1 rounded-e-none [-moz-appearance:_textfield] focus:z-10 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
            value={(columnFilterValue as [number, number])?.[0] ?? ""}
            onChange={(e) =>
              column.setFilterValue((old: [number, number]) => [
                e.target.value ? Number(e.target.value) : undefined,
                old?.[1],
              ])
            }
            placeholder="Min"
            type="number"
            aria-label={`${columnHeader} min`}
          />
          <Input
            id={`${id}-range-2`}
            className="-ms-px flex-1 rounded-s-none [-moz-appearance:_textfield] focus:z-10 [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
            value={(columnFilterValue as [number, number])?.[1] ?? ""}
            onChange={(e) =>
              column.setFilterValue((old: [number, number]) => [
                old?.[0],
                e.target.value ? Number(e.target.value) : undefined,
              ])
            }
            placeholder="Max"
            type="number"
            aria-label={`${columnHeader} max`}
          />
        </div>
      </div>
    )
  }

  if (filterVariant === "select") {
    return (
      <div className="*:not-first:mt-2">
        <Label htmlFor={`${id}-select`}>{columnHeader}</Label>
        <Select
          value={columnFilterValue?.toString() ?? "all"}
          onValueChange={(value) => {
            column.setFilterValue(value === "all" ? undefined : value)
          }}
        >
          <SelectTrigger id={`${id}-select`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {sortedUniqueValues.map((value) => (
              <SelectItem key={String(value)} value={String(value)}>
                <span className="capitalize">{String(value)}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={`${id}-input`}>{columnHeader}</Label>
      <div className="relative">
        <Input
          id={`${id}-input`}
          className="peer ps-9"
          value={(columnFilterValue ?? "") as string}
          onChange={(e) => column.setFilterValue(e.target.value)}
          placeholder={`Search ${columnHeader.toLowerCase()}`}
          type="text"
        />
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
          <SearchIcon size={16} />
        </div>
      </div>
    </div>
  )
}