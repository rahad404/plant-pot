"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ShoppingCart,
  ShieldCheck,
  Droplets,
  Sun,
  FlaskConical,
  Pill,
  Star,
  ChevronLeft,
  ChevronRight,
  User,
  Clock,
  MessageSquare,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlantCard, PlantCardSkeleton } from "@/components/plant-card"
import { StarRating } from "@/components/star-rating"
import { authClient } from "@/lib/auth-client"
import { api, type Plant, type Review } from "@/lib/api"

interface ReviewPagination {
  page: number
  totalPages: number
  hasNextPage: boolean
}

const CARE_ICONS: Record<string, { icon: typeof Droplets; label: string }> = {
  light: { icon: Sun, label: "Light" },
  watering: { icon: Droplets, label: "Watering" },
  compost: { icon: FlaskConical, label: "Fertilizer" },
  medicine: { icon: Pill, label: "Treatment" },
}

export default function PlantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { data: session } = authClient.useSession()

  const [plant, setPlant] = useState<Plant | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewPagination, setReviewPagination] = useState<ReviewPagination | null>(null)
  const [loadingReviews, setLoadingReviews] = useState(true)
  const [relatedPlants, setRelatedPlants] = useState<Plant[]>([])
  const [loadingRelated, setLoadingRelated] = useState(true)

  // Review form
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState("")
  const [submittingReview, setSubmittingReview] = useState(false)

  // Buy now
  const [buying, setBuying] = useState(false)

  useEffect(() => {
    setLoading(true)
    api.plants.get(id)
      .then((data) => setPlant(data.plant))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    setLoadingReviews(true)
    api.plants.reviews.list(id, { limit: "5" })
      .then((data) => {
        setReviews(data.reviews || [])
        setReviewPagination(data.pagination || null)
        setLoadingReviews(false)
      })
      .catch(() => setLoadingReviews(false))
  }, [id])

  useEffect(() => {
    if (!plant?.category) return
    setLoadingRelated(true)
    api.plants.list({ category: plant.category, limit: "5" })
      .then((data) => {
        setRelatedPlants((data.plants || []).filter((p) => p._id !== id))
        setLoadingRelated(false)
      })
      .catch(() => setLoadingRelated(false))
  }, [plant?.category, id])

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user) {
      toast.error("Please sign in to leave a review")
      return
    }
    if (!reviewComment.trim()) {
      toast.error("Please write a comment")
      return
    }
    setSubmittingReview(true)
    try {
      await api.plants.reviews.create(id, {
        rating: reviewRating,
        comment: reviewComment.trim(),
      })
      toast.success("Review submitted!")
      setReviewComment("")
      setReviewRating(5)
      const data = await api.plants.reviews.list(id, { limit: "5" })
      setReviews(data.reviews || [])
      setReviewPagination(data.pagination || null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit review")
    }
    setSubmittingReview(false)
  }

  const handleBuyNow = async () => {
    if (!session?.user) {
      router.push(`/login?callbackUrl=/plants/${id}`)
      return
    }
    setBuying(true)
    // Dummy payment — just confirm and redirect
    await new Promise((r) => setTimeout(r, 1200))
    setBuying(false)
    toast.success("Payment confirmed! Your plant is on its way.")
    router.push("/dashboard")
  }

  const loadMoreReviews = async () => {
    if (!reviewPagination?.hasNextPage) return
    const nextPage = reviewPagination.page + 1
    try {
      const data = await api.plants.reviews.list(id, { limit: "5", page: String(nextPage) })
      setReviews((prev) => [...prev, ...(data.reviews || [])])
      setReviewPagination(data.pagination || null)
    } catch {}
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="h-6 w-24 animate-pulse rounded bg-muted" />
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-xl bg-muted" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-6 w-1/4 animate-pulse rounded bg-muted" />
            <div className="h-20 animate-pulse rounded bg-muted" />
            <div className="h-10 w-full animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    )
  }

  if (!plant) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="mb-4 text-5xl">🌱</div>
        <h1 className="text-2xl font-bold">Plant not found</h1>
        <p className="mt-2 text-muted-foreground">
          The plant you are looking for does not exist or has been removed.
        </p>
        <Button className="mt-6" onClick={() => router.push("/plants")}>
          Browse Plants
        </Button>
      </div>
    )
  }

  const images = plant.images?.length ? plant.images : plant.image ? [plant.image] : ["/placeholder.svg"]
  const allImages = images.length > 0 ? images : ["/placeholder.svg"]

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
              <img
                src={allImages[selectedImage]}
                alt={plant.name}
                className="h-full w-full object-cover"
              />
              {plant.badge && (
                <Badge className="absolute left-4 top-4">{plant.badge}</Badge>
              )}
              {allImages.length > 1 && (
                <>
                  <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-1.5 shadow-sm backdrop-blur transition-colors hover:bg-background"
                    onClick={() =>
                      setSelectedImage(
                        (selectedImage - 1 + allImages.length) % allImages.length
                      )
                    }
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-1.5 shadow-sm backdrop-blur transition-colors hover:bg-background"
                    onClick={() =>
                      setSelectedImage((selectedImage + 1) % allImages.length)
                    }
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    className={`size-16 shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                      i === selectedImage
                        ? "border-primary"
                        : "border-transparent hover:border-muted-foreground/30"
                    }`}
                    onClick={() => setSelectedImage(i)}
                  >
                    <img
                      src={img}
                      alt={`${plant.name} ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Plant Info */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                {plant.name}
              </h1>
              {plant.category && (
                <Link href={`/plants?category=${plant.category}`}>
                  <Badge variant="secondary" className="mt-2 cursor-pointer capitalize">
                    {plant.category}
                  </Badge>
                </Link>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <StarRating rating={plant.rating || 0} />
                <span className="ml-1 text-sm font-medium">
                  {plant.rating?.toFixed(1) || "—"}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({plant.reviewsCount || 0} reviews)
              </span>
            </div>

            <div className="text-3xl font-bold text-primary">
              ${plant.price.toFixed(2)}
            </div>

            <Separator />

            <div>
              <h3 className="mb-2 font-semibold">Description</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {plant.description || plant.shortDescription || "No description available."}
              </p>
            </div>

            {/* Care Specs */}
            <div>
              <h3 className="mb-3 font-semibold">Care Specifications</h3>
              <div className="grid grid-cols-2 gap-3">
                {plant.light && (
                  <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3">
                    <Sun className="mt-0.5 size-5 shrink-0 text-amber-500" />
                    <div>
                      <div className="text-xs text-muted-foreground">Light</div>
                      <div className="text-sm font-medium capitalize">{plant.light}</div>
                    </div>
                  </div>
                )}
                {plant.watering && (
                  <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3">
                    <Droplets className="mt-0.5 size-5 shrink-0 text-blue-500" />
                    <div>
                      <div className="text-xs text-muted-foreground">Watering</div>
                      <div className="text-sm font-medium capitalize">{plant.watering}</div>
                    </div>
                  </div>
                )}
                {plant.compost && (
                  <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3">
                    <FlaskConical className="mt-0.5 size-5 shrink-0 text-green-500" />
                    <div>
                      <div className="text-xs text-muted-foreground">Fertilizer</div>
                      <div className="text-sm font-medium">{plant.compost}</div>
                    </div>
                  </div>
                )}
                {plant.medicine && (
                  <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3">
                    <Pill className="mt-0.5 size-5 shrink-0 text-red-500" />
                    <div>
                      <div className="text-xs text-muted-foreground">Treatment</div>
                      <div className="text-sm font-medium">{plant.medicine}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Buy Now */}
            <div className="flex flex-col gap-3 pt-2">
              <Button size="lg" className="w-full" onClick={handleBuyNow} disabled={buying}>
                <ShoppingCart className="mr-2 size-5" />
                {buying ? "Processing..." : "Buy Now — $" + plant.price.toFixed(2)}
              </Button>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="size-4 text-green-500" />
                <span>Secure checkout • 30-day guarantee • Free delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <Separator className="my-12" />
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Reviews</h2>
                <p className="text-sm text-muted-foreground">
                  What our customers say about this plant
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StarRating rating={plant.rating || 0} size={20} />
                <span className="text-lg font-semibold">
                  {plant.rating?.toFixed(1) || "—"}
                </span>
              </div>
            </div>

            {loadingReviews ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2 rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 animate-pulse rounded-full bg-muted" />
                      <div className="space-y-1">
                        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                        <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                      </div>
                    </div>
                    <div className="h-4 w-full animate-pulse rounded bg-muted" />
                  </div>
                ))}
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review._id} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                          {review.userName?.[0]?.toUpperCase() || <User className="size-5" />}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{review.userName}</div>
                          <div className="flex items-center gap-2">
                            <StarRating rating={review.rating} size={12} />
                            <span className="text-xs text-muted-foreground">
                              <Clock className="mr-1 inline size-3" />
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {review.comment}
                    </p>
                  </div>
                ))}
                {reviewPagination?.hasNextPage && (
                  <Button variant="outline" className="w-full" onClick={loadMoreReviews}>
                    <MessageSquare className="mr-2 size-4" />
                    Load more reviews
                  </Button>
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-10 text-center">
                <MessageSquare className="mx-auto mb-2 size-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No reviews yet. Be the first to review this plant!
                </p>
              </div>
            )}
          </div>

          {/* Add Review Form */}
          <div>
            <div className="sticky top-24 rounded-lg border p-6">
              <h3 className="mb-4 text-lg font-semibold">Write a Review</h3>
              {session?.user ? (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Your Rating</Label>
                    <StarRating
                      rating={reviewRating}
                      size={28}
                      interactive
                      onRate={setReviewRating}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="comment">Your Review</Label>
                    <Textarea
                      id="comment"
                      placeholder="Share your experience with this plant..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={submittingReview}>
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </Button>
                </form>
              ) : (
                <div className="text-center">
                  <p className="mb-4 text-sm text-muted-foreground">
                    Sign in to leave a review for this plant.
                  </p>
                  <Link href={`/login?callbackUrl=/plants/${id}`}>
                    <Button variant="outline" className="w-full">
                      Sign in to Review
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Plants */}
        {relatedPlants.length > 0 && (
          <>
            <Separator className="my-12" />
            <div>
              <h2 className="mb-2 text-2xl font-bold">Related Plants</h2>
              <p className="mb-6 text-sm text-muted-foreground">
                More plants in the &ldquo;{plant.category}&rdquo; category
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {loadingRelated
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <PlantCardSkeleton key={i} />
                    ))
                  : relatedPlants.slice(0, 4).map((p) => (
                      <PlantCard key={p._id} plant={p} />
                    ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
