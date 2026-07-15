"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  max?: number
  size?: number
  interactive?: boolean
  onRate?: (rating: number) => void
}

export function StarRating({
  rating,
  max = 5,
  size = 16,
  interactive = false,
  onRate,
}: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(rating)
        const half = !filled && i < rating
        return (
          <button
            key={i}
            type={interactive ? "button" : undefined}
            disabled={!interactive}
            onClick={() => interactive && onRate?.(i + 1)}
            className={cn(
              interactive && "cursor-pointer transition-transform hover:scale-110"
            )}
          >
            <Star
              size={size}
              className={cn(
                "transition-colors",
                filled
                  ? "fill-yellow-500 text-yellow-500"
                  : half
                    ? "fill-yellow-500/50 text-yellow-500"
                    : "fill-none text-muted-foreground/30"
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
