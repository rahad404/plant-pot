"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { PlantCard, PlantCardSkeleton } from "@/components/plant-card"
import { PlantFilters } from "@/components/plant-filters"

interface Plant {
  _id: string
  name: string
  slug?: string
  price: number
  images?: string[]
  image?: string
  rating?: number
  reviewsCount?: number
  category?: string
  light?: string
  inStock?: boolean
  badge?: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "name", label: "Name A–Z" },
]

export default function PlantsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [plants, setPlants] = useState<Plant[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<{ name: string; slug: string }[]>([])
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "")
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  const currentSearch = searchParams.get("search") || ""
  const currentSort = searchParams.get("sort") || "newest"
  const currentPage = parseInt(searchParams.get("page") || "1")

  useEffect(() => {
    fetch("/api/plants/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams(searchParams.toString())
    if (!params.has("limit")) params.set("limit", "12")

    fetch(`/api/plants?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setPlants(data.plants || [])
        setPagination(data.pagination || null)
      })
      .catch(() => {
        setPlants([])
        setPagination(null)
      })
      .finally(() => setLoading(false))
  }, [searchParams])

  // Debounced search
  const debouncedSearch = useCallback(
    (() => {
      let timeout: ReturnType<typeof setTimeout>
      return (value: string) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          const params = new URLSearchParams(searchParams.toString())
          if (value) params.set("search", value)
          else params.delete("search")
          params.set("page", "1")
          router.push(`/plants?${params.toString()}`)
        }, 400)
      }
    })(),
    [searchParams, router]
  )

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
    debouncedSearch(value)
  }

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sort", value)
    params.set("page", "1")
    router.push(`/plants?${params.toString()}`)
  }

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(page))
    router.push(`/plants?${params.toString()}`)
  }

  const hasActiveFilters = Array.from(searchParams.entries()).some(
    ([key]) => key !== "sort" && key !== "page" && key !== "limit"
  )

  const activeFilterCount = Array.from(searchParams.entries()).filter(
    ([key, val]) => key !== "sort" && key !== "page" && key !== "limit" && val
  ).length

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Explore Plants</h1>
          <p className="mt-1 text-muted-foreground">
            Find the perfect plant for your space
          </p>
        </div>

        {/* Search + Sort bar */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search plants..."
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 pr-8"
            />
            {searchInput && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => handleSearchChange("")}
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile filter button */}
            <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 lg:hidden">
                  <SlidersHorizontal className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>Refine your plant search</SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <PlantFilters categories={categories} />
                </div>
              </SheetContent>
            </Sheet>

            <Select value={currentSort} onValueChange={handleSortChange}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden w-56 shrink-0 lg:block">
            <div className="sticky top-24">
              <PlantFilters categories={categories} />
            </div>
          </aside>

          {/* Main content */}
          <div className="min-w-0 flex-1">
            {/* Active filters bar */}
            {hasActiveFilters && !loading && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">Active filters:</span>
                {Array.from(searchParams.entries()).map(([key, val]) => {
                  if (key === "sort" || key === "page" || key === "limit" || !val) return null
                  return (
                    <Badge key={key} variant="secondary" className="gap-1 pr-1">
                      <span className="capitalize">{key === "minPrice" || key === "maxPrice" ? `${key === "minPrice" ? "Min" : "Max"} price` : key}: {val}</span>
                      <button
                        onClick={() => {
                          const params = new URLSearchParams(searchParams.toString())
                          params.delete(key)
                          params.set("page", "1")
                          router.push(`/plants?${params.toString()}`)
                        }}
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  )
                })}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs text-muted-foreground"
                  onClick={() => router.push("/plants")}
                >
                  Clear all
                </Button>
              </div>
            )}

            {/* Results count */}
            {!loading && pagination && (
              <p className="mb-4 text-sm text-muted-foreground">
                Showing {pagination.total} result{pagination.total !== 1 ? "s" : ""}
                {currentSearch && ` for "${currentSearch}"`}
              </p>
            )}

            {/* Plant grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <PlantCardSkeleton key={i} />)
                : plants.map((plant) => <PlantCard key={plant._id} plant={plant} />)}
            </div>

            {/* Empty state */}
            {!loading && plants.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 text-4xl">🌱</div>
                <h3 className="text-lg font-semibold">No plants found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try adjusting your search or filters.
                </p>
                {hasActiveFilters && (
                  <Button variant="outline" className="mt-4" onClick={() => router.push("/plants")}>
                    Clear all filters
                  </Button>
                )}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={!pagination.hasPrevPage}
                  onClick={() => goToPage(pagination.page - 1)}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                {generatePageNumbers(pagination.page, pagination.totalPages).map(
                  (pageNum, idx) =>
                    pageNum === "..." ? (
                      <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground">
                        ...
                      </span>
                    ) : (
                      <Button
                        key={pageNum}
                        variant={pagination.page === pageNum ? "default" : "outline"}
                        size="icon"
                        className="size-9"
                        onClick={() => goToPage(pageNum as number)}
                      >
                        {pageNum}
                      </Button>
                    )
                )}
                <Button
                  variant="outline"
                  size="icon"
                  disabled={!pagination.hasNextPage}
                  onClick={() => goToPage(pagination.page + 1)}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function generatePageNumbers(current: number, total: number): (number | "..." )[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | "..." )[] = [1]
  if (current > 3) pages.push("...")
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (current < total - 2) pages.push("...")
  pages.push(total)
  return pages
}
