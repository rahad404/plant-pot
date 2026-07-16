"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { Filter, Star, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const LIGHT_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "bright", label: "Bright" },
]

const RATING_OPTIONS = [4, 3, 2, 1]

interface PlantFiltersProps {
  categories?: { name: string; slug: string }[]
}

export function PlantFilters({ categories }: PlantFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get("category") || ""
  const currentMinPrice = searchParams.get("minPrice") || ""
  const currentMaxPrice = searchParams.get("maxPrice") || ""
  const currentRating = searchParams.get("rating") || ""
  const currentLight = searchParams.get("light") || ""

  const createQueryString = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value)
        else params.delete(key)
      })
      params.set("page", "1")
      return params.toString()
    },
    [searchParams]
  )

  const updateFilter = (key: string, value: string) => {
    router.push(`/plants?${createQueryString({ [key]: value })}`)
  }

  const clearFilters = () => {
    router.push("/plants")
  }

  const hasActiveFilters = currentCategory || currentMinPrice || currentMaxPrice || currentRating || currentLight

  const activeCount = [currentCategory, currentMinPrice, currentMaxPrice, currentRating, currentLight].filter(Boolean).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="size-4" />
          <span className="text-sm font-medium">Filters</span>
          {activeCount > 0 && (
            <Badge variant="secondary" className="ml-1 size-5 rounded-full p-0 text-xs">{activeCount}</Badge>
          )}
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-muted-foreground" onClick={clearFilters}>
            <X className="mr-1 size-3" />
            Clear
          </Button>
        )}
      </div>

      <Separator />

      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">Category</Label>
        <Select value={currentCategory} onValueChange={(v) => updateFilter("category", v)}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories?.map((cat) => (
              <SelectItem key={cat.slug} value={cat.name}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">Price Range</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={currentMinPrice}
            onChange={(e) => updateFilter("minPrice", e.target.value)}
            className="h-9"
          />
          <span className="text-muted-foreground">—</span>
          <Input
            type="number"
            placeholder="Max"
            value={currentMaxPrice}
            onChange={(e) => updateFilter("maxPrice", e.target.value)}
            className="h-9"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">Rating</Label>
        <div className="flex flex-wrap gap-2">
          {RATING_OPTIONS.map((r) => (
            <Button
              key={r}
              variant={currentRating === String(r) ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter("rating", currentRating === String(r) ? "" : String(r))}
              className="gap-1"
            >
              <Star className="size-3 fill-current" />
              <span>{r}+</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">Light</Label>
        <div className="flex flex-wrap gap-2">
          {LIGHT_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              variant={currentLight === opt.value ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter("light", currentLight === opt.value ? "" : opt.value)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
