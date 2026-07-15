"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Loader2, ShoppingCart, ShieldCheck, Truck, Leaf } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { api, type Plant } from "@/lib/api"
import { authClient } from "@/lib/auth-client"

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { data: session } = authClient.useSession()

  const [plant, setPlant] = useState<Plant | null>(null)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [zip, setZip] = useState("")
  const [confirming, setConfirming] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderId, setOrderId] = useState("")

  useEffect(() => {
    if (!session?.user) {
      router.push(`/login?callbackUrl=/checkout/${id}`)
      return
    }
    setName(session.user.name || "")
    setEmail(session.user.email || "")

api.plants.get(id)
      .then((data) => setPlant(data))
      .catch(() => toast.error("Plant not found"))
      .finally(() => setLoading(false))
  }, [id, session, router])

  const handleConfirm = async () => {
    if (!address.trim() || !city.trim() || !zip.trim()) {
      toast.error("Please fill in all shipping fields")
      return
    }
    setConfirming(true)
    // Simulate payment processing delay
    await new Promise((r) => setTimeout(r, 1500))
    try {
      const res = await api.orders.create({
        plantId: id,
        plantName: plant?.name || "",
        price: plant?.price || 0,
      })
      setOrderId(res.order._id)
      setSuccess(true)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Payment failed. Please try again.")
    }
    setConfirming(false)
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!plant) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="mb-4 text-5xl">🌱</div>
        <h1 className="text-2xl font-bold">Plant not found</h1>
        <Link href="/plants">
          <Button className="mt-4">Browse Plants</Button>
        </Link>
      </div>
    )
  }

  if (success) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <CheckCircle className="size-10 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Payment Confirmed!</h1>
        <p className="mt-2 text-muted-foreground">
          Thank you for your purchase. Your plant is on its way!
        </p>
        <div className="mt-6 rounded-lg border bg-muted/30 p-4 text-left text-sm">
          <div className="flex items-center gap-3">
            <div className="size-12 shrink-0 overflow-hidden rounded-md bg-muted">
              <img
                src={plant.images?.[0] || plant.image || "/placeholder.svg"}
                alt={plant.name}
                className="size-full object-cover"
              />
            </div>
            <div>
              <div className="font-medium">{plant.name}</div>
              <div className="text-muted-foreground">${plant.price?.toFixed(2)}</div>
            </div>
          </div>
          <Separator className="my-3" />
          <div className="flex justify-between text-muted-foreground">
            <span>Order ID</span>
            <span className="font-mono text-xs">{orderId.slice(-8).toUpperCase()}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Delivery to</span>
            <span className="text-right">{address}, {city}</span>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-md bg-primary/10 p-2 text-sm text-primary">
            <Leaf className="size-4" />
            <span>Check your dashboard for care schedule &amp; watering reminders</span>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
          <Link href="/plants">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  const imageUrl = plant.images?.[0] || plant.image || "/placeholder.svg"

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back
      </button>

      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Checkout</h1>
      <p className="mt-1 text-muted-foreground">Review your order and confirm payment</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-5">
        {/* Shipping Form */}
        <div className="space-y-6 lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
              <CardDescription>
                Enter the address where your plant will be delivered
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input id="zip" value={zip} onChange={(e) => setZip(e.target.value)} required />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
              <CardDescription>Mock payment — no real card info required</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-dashed bg-muted/30 p-4 text-center text-sm text-muted-foreground">
                <ShieldCheck className="mx-auto mb-2 size-8 text-green-500" />
                <p>This is a dummy payment flow. No real payment will be processed.</p>
                <p className="mt-1 text-xs">Click &quot;Confirm Payment&quot; to simulate a successful transaction.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="size-16 shrink-0 overflow-hidden rounded-md bg-muted">
                    <img src={imageUrl} alt={plant.name} className="size-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium">{plant.name}</div>
                    <div className="text-sm text-muted-foreground capitalize">
                      {plant.light && `${plant.light} light`}
                      {plant.watering && ` · ${plant.watering} watering`}
                    </div>
                    <div className="mt-1 text-lg font-bold text-primary">
                      ${plant.price?.toFixed(2)}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${plant.price?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-green-500">Free</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-base font-semibold">
                    <span>Total</span>
                    <span>${plant.price?.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Truck className="size-3.5" />
                    Free delivery — arrives in 3–5 business days
                  </div>
                  <div className="flex items-center gap-2">
                    <Leaf className="size-3.5" />
                    Care guide included with every order
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleConfirm}
                  disabled={confirming}
                >
                  {confirming ? (
                    <>
                      <Loader2 className="mr-2 size-5 animate-spin" />
                      Processing…
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 size-5" />
                      Confirm Payment — ${plant.price?.toFixed(2)}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
