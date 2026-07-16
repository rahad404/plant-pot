"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Search, Leaf, Droplets, Truck, RefreshCw, Star, ShoppingCart, ChevronRight, Sparkles, Sprout } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { api, type Plant, type Category } from "@/lib/api"

const benefits = [
  { icon: Leaf, title: "Expertly Curated", description: "Every plant is hand-picked by our botanists for quality and health." },
  { icon: Droplets, title: "Care Guides Included", description: "Each plant comes with a detailed care guide tailored to its needs." },
  { icon: Truck, title: "Safe Delivery", description: "Plants are carefully packed and shipped to arrive healthy at your door." },
  { icon: RefreshCw, title: "30-Day Guarantee", description: "Not happy? We'll replace your plant or refund you — no questions asked." },
]

const careTips = [
  { title: "Watering 101", excerpt: "Learn how often to water different types of plants based on season and light.", image: "https://i.ibb.co.com/bMMy028C/How-to-Water-Cactus-Feature.jpg" },
  { title: "Light Requirements", excerpt: "Understanding low, medium, and bright light needs for your indoor garden.", image: "https://i.ibb.co.com/yFzQyX4V/images-2.jpg" },
  { title: "Soil & Fertilizer", excerpt: "The right soil mix and fertilizer schedule makes all the difference.", image: "https://i.ibb.co.com/QFFhfNpx/images.jpg" },
]

const testimonials = [
  { name: "Sarah Chen", role: "Plant Parent", avatar: "SC", content: "The plants arrived in perfect condition and the care guides are incredibly helpful. My monstera is thriving!", rating: 5 },
  { name: "James Wilson", role: "Gardener", avatar: "JW", content: "Best online plant shop I've tried. The quality is outstanding and customer service is always responsive.", rating: 5 },
  { name: "Emily Rodriguez", role: "Interior Designer", avatar: "ER", content: "I recommend PlantPot to all my clients. Their plants are gorgeous and their delivery is always on time.", rating: 5 },
]

const FALLBACK_CATEGORIES = [
  { name: "Indoor Plants", slug: "indoor", image: "https://i.ibb.co.com/1fs850Wb/420b24102b2eff4d93e901a61dabeca5.jpg" },
  { name: "Outdoor Plants", slug: "outdoor", image: "https://i.ibb.co.com/bMMy028C/How-to-Water-Cactus-Feature.jpg" },
  { name: "Succulents", slug: "succulents", image: "https://i.ibb.co.com/yFzQyX4V/images-2.jpg" },
  { name: "Flowering Plants", slug: "flowering", image: "https://i.ibb.co.com/QFFhfNpx/images.jpg" },
]

const HERO_IMAGES = [
  "https://i.ibb.co.com/1fs850Wb/420b24102b2eff4d93e901a61dabeca5.jpg",
  "https://i.ibb.co.com/wZrhLzMC/images-3.jpg",
  "https://i.ibb.co.com/yFzQyX4V/images-2.jpg",
  "https://i.ibb.co.com/QFFhfNpx/images.jpg",
  "https://i.ibb.co.com/bMMy028C/How-to-Water-Cactus-Feature.jpg",
]

export default function HomePage() {
  const [featuredPlants, setFeaturedPlants] = useState<Plant[]>([])
  const [categories, setCategories] = useState<(Category & { image?: string })[]>([])
  const [loadingPlants, setLoadingPlants] = useState(true)
  const [loadingCats, setLoadingCats] = useState(true)
  const [searchInput, setSearchInput] = useState("")

  useEffect(() => {
    // Fetch featured plants
    api.plants
      .list({ limit: "4", sort: "rating_desc" })
      .then((data) => setFeaturedPlants(data.plants || []))
      .catch(() => setFeaturedPlants([]))
      .finally(() => setLoadingPlants(false))

    // Fetch categories
    api.plants
      .categories()
      .then((data) => {
        const cats = data.categories || []
        if (cats.length === 0) {
          setCategories(FALLBACK_CATEGORIES)
        } else {
          // Merge with fallback images by matching slug/name
          setCategories(
            cats.slice(0, 4).map((cat) => {
              const fallback = FALLBACK_CATEGORIES.find(
                (f) => f.slug === cat.slug || f.name.toLowerCase() === cat.name.toLowerCase()
              )
              return { ...cat, image: fallback?.image || FALLBACK_CATEGORIES[0].image }
            })
          )
        }
      })
      .catch(() => setCategories(FALLBACK_CATEGORIES))
      .finally(() => setLoadingCats(false))
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      window.location.href = `/plants?search=${encodeURIComponent(searchInput.trim())}`
    } else {
      window.location.href = "/plants"
    }
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-primary/5 to-background pb-16 pt-12 md:pb-24 md:pt-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 size-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 size-60 rounded-full bg-emerald-500/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <Badge variant="secondary" className="mb-2">
                <Sparkles className="mr-1 size-3" />
                New arrivals every week
              </Badge>
              <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
                Bring Nature
                <br />
                <span className="text-primary">Into Your Home</span>
              </h1>
              <p className="max-w-lg text-lg text-muted-foreground">
                Discover our curated collection of beautiful plants delivered to your door with expert care guides.
              </p>
              <form onSubmit={handleSearch} className="flex max-w-md items-center gap-2 rounded-xl border bg-background p-1 shadow-sm">
                <div className="flex flex-1 items-center gap-2 pl-3">
                  <Search className="size-4 shrink-0 text-muted-foreground" />
                  <Input
                    placeholder="Search plants..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="border-0 shadow-none focus-visible:ring-0"
                  />
                </div>
                <Button size="sm" type="submit" className="shrink-0">
                  Search
                </Button>
              </form>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/plants">
                  <Button size="lg">
                    Explore Plants
                    <ChevronRight className="ml-1 size-4" />
                  </Button>
                </Link>
                <Link href="#categories">
                  <Button variant="outline" size="lg">
                    Browse Categories
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative hidden md:block">
              <Carousel className="w-full max-w-lg">
                <CarouselContent>
                  {HERO_IMAGES.map((src, i) => (
                    <CarouselItem key={i}>
                      <div className="aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-emerald-500/20 p-2">
                        <img
                          src={src}
                          alt={`Plant ${i + 1}`}
                          className="h-full w-full rounded-xl object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 size-8" />
                <CarouselNext className="right-2 size-8" />
              </Carousel>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/30 py-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: "10K+", label: "Plants Sold" },
              { value: "5K+", label: "Happy Customers" },
              { value: "200+", label: "Plant Varieties" },
              { value: "4.9", label: "Average Rating" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary md:text-4xl">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Plants — real data from API */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <Badge variant="secondary" className="mb-2">Collection</Badge>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Featured Plants</h2>
              <p className="mt-2 text-muted-foreground">Our top-rated picks for your home</p>
            </div>
            <Link href="/plants">
              <Button variant="ghost" className="hidden md:flex">
                View All
                <ArrowRight className="ml-1 size-4" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {loadingPlants
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="aspect-[4/3] w-full" />
                    <CardContent className="p-4">
                      <Skeleton className="mb-2 h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </CardContent>
                  </Card>
                ))
              : featuredPlants.length > 0
              ? featuredPlants.map((plant) => (
                  <Link key={plant._id} href={`/plants/${plant._id}`}>
                    <Card className="group overflow-hidden transition-shadow hover:shadow-md">
                      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                        <img
                          src={plant.images?.[0] || plant.image || "https://i.ibb.co.com/wZrhLzMC/images-3.jpg"}
                          alt={plant.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {plant.badge && (
                          <Badge className="absolute left-3 top-3">{plant.badge}</Badge>
                        )}
                        <Button
                          size="icon"
                          variant="secondary"
                          className="absolute right-3 top-3 size-8 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                          onClick={(e) => e.preventDefault()}
                        >
                          <ShoppingCart className="size-4" />
                        </Button>
                      </div>
                      <CardContent className="p-4">
                        <CardTitle className="text-base">{plant.name}</CardTitle>
                        {plant.rating !== undefined && plant.rating > 0 && (
                          <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                            <Star className="size-3.5 fill-yellow-500 text-yellow-500" />
                            <span>{plant.rating.toFixed(1)}</span>
                          </div>
                        )}
                        <div className="mt-2 text-lg font-semibold">${plant.price.toFixed(2)}</div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button className="w-full" size="sm">
                          <ShoppingCart className="mr-2 size-4" />
                          View Plant
                        </Button>
                      </CardFooter>
                    </Card>
                  </Link>
                ))
              : (
                <div className="col-span-4 py-12 text-center">
                  <p className="text-muted-foreground">No plants yet — check back soon!</p>
                  <Link href="/plants">
                    <Button variant="outline" className="mt-3">Browse All Plants</Button>
                  </Link>
                </div>
              )}
          </div>

          <div className="mt-6 text-center md:hidden">
            <Link href="/plants">
              <Button variant="outline">
                View All Plants
                <ArrowRight className="ml-1 size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories — real data from API */}
      <section id="categories" className="bg-muted/30 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 text-center">
            <Badge variant="secondary" className="mb-2">Categories</Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Shop by Category</h2>
            <p className="mt-2 text-muted-foreground">Find exactly what you're looking for</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {loadingCats
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="aspect-[4/3] w-full" />
                    <CardContent className="p-4">
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                ))
              : categories.map((cat) => (
                  <Link key={cat.slug} href={`/plants?category=${encodeURIComponent(cat.name)}`}>
                    <Card className="group overflow-hidden transition-colors hover:border-primary/50">
                      <div className="aspect-[4/3] overflow-hidden bg-muted">
                        <img
                          src={cat.image || FALLBACK_CATEGORIES[0].image}
                          alt={cat.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <CardContent className="p-4">
                        <CardTitle className="text-base capitalize">{cat.name}</CardTitle>
                        <CardDescription>Browse collection</CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <Badge variant="secondary" className="mb-2">Why PlantPot</Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Why Choose Us</h2>
            <p className="mt-2 text-muted-foreground">We make plant parenthood easy and enjoyable</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="border-0 bg-muted/30 text-center shadow-none">
                <CardContent className="p-6">
                  <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                    <benefit.icon className="size-7 text-primary" />
                  </div>
                  <CardTitle className="mb-2 text-lg">{benefit.title}</CardTitle>
                  <CardDescription className="text-sm">{benefit.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Care Tips Preview */}
      <section className="bg-gradient-to-b from-muted/30 to-background py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <Badge variant="secondary" className="mb-2">Plant Care</Badge>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Care Tips &amp; Guides</h2>
              <p className="mt-2 text-muted-foreground">Everything you need to keep your plants thriving</p>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {careTips.map((tip) => (
              <Card key={tip.title} className="group overflow-hidden">
                <div className="aspect-[16/9] overflow-hidden bg-muted">
                  <img
                    src={tip.image}
                    alt={tip.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-5">
                  <CardTitle className="mb-2 text-lg">{tip.title}</CardTitle>
                  <CardDescription>{tip.excerpt}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 text-center">
            <Badge variant="secondary" className="mb-2">Testimonials</Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">What Our Customers Say</h2>
            <p className="mt-2 text-muted-foreground">Join thousands of happy plant parents</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name} className="border-0 bg-muted/30">
                <CardContent className="p-6">
                  <div className="mb-3 flex gap-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="size-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="mb-4 text-sm text-muted-foreground">&ldquo;{t.content}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-primary/5 py-16 md:py-20">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <Badge variant="secondary" className="mb-2">Stay Connected</Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Get Plant Tips &amp; Offers</h2>
          <p className="mt-2 mb-6 text-muted-foreground">
            Subscribe to our newsletter for exclusive deals, new arrivals, and expert care advice.
          </p>
          <form className="flex max-w-md mx-auto gap-2">
            <Input placeholder="Enter your email" type="email" required className="flex-1" />
            <Button type="submit">Subscribe</Button>
          </form>
          <p className="mt-3 text-xs text-muted-foreground">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-emerald-700 px-8 py-14 text-center text-primary-foreground md:px-16 md:py-20">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -right-20 -top-20 size-60 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-10 -left-10 size-40 rounded-full bg-white/10 blur-3xl" />
            </div>
            <div className="relative">
              <Sprout className="mx-auto mb-4 size-10 opacity-80" />
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Ready to Start Your Plant Journey?</h2>
              <p className="mx-auto mt-3 max-w-lg text-primary-foreground/80">
                Browse our collection and find the perfect plant for your space.
              </p>
              <Link href="/plants">
                <Button size="lg" variant="secondary" className="mt-6">
                  Shop Now
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
