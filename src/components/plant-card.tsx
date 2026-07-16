import Link from "next/link"
import { Star, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

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

export function PlantCard({ plant }: { plant: Plant }) {
  const imageUrl = plant.images?.[0] || plant.image || "/placeholder.svg"

  return (
    <Card className="group overflow-hidden border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <Link href={`/plants/${plant._id}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={plant.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          {plant.badge && (
            <Badge className="absolute left-3 top-3 shadow-sm">{plant.badge}</Badge>
          )}
          <Button
            size="icon"
            variant="secondary"
            className="absolute right-3 top-3 size-8 rounded-full opacity-0 shadow-md transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 translate-y-1"
          >
            <Eye className="size-4" />
          </Button>
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/plants/${plant._id}`}>
          <h3 className="text-base font-semibold transition-colors duration-200 group-hover:text-primary">
            {plant.name}
          </h3>
        </Link>
        <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <Star className="size-3.5 fill-yellow-500 text-yellow-500" />
          <span>{plant.rating?.toFixed(1) || "—"}</span>
          {plant.reviewsCount !== undefined && (
            <span className="text-xs">({plant.reviewsCount})</span>
          )}
        </div>
        {plant.light && (
          <div className="mt-1 text-xs capitalize text-muted-foreground">
            {plant.light} light
          </div>
        )}
        <div className="mt-2 text-lg font-semibold text-primary">${plant.price.toFixed(2)}</div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/plants/${plant._id}`} className="w-full">
          <Button className="w-full transition-all duration-200 hover:shadow-md hover:shadow-primary/20" size="sm" disabled={plant.inStock === false}>
            <Eye className="mr-2 size-4" />
            {plant.inStock === false ? "Out of Stock" : "View Details"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export function PlantCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[4/3] animate-pulse bg-muted" />
      <CardContent className="p-4">
        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-muted" />
        <div className="mt-3 h-6 w-1/4 animate-pulse rounded bg-muted" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
      </CardFooter>
    </Card>
  )
}
