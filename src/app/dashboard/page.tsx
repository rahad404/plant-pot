"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Sprout, ShoppingBag, Droplets, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api, type Order, type CareSchedule } from "@/lib/api"
import { authClient } from "@/lib/auth-client"

export default function DashboardPage() {
  const { data: session } = authClient.useSession()
  const user = session?.user

  const [plants, setPlants] = useState<CareSchedule[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.dashboard.myPlants(),
      api.dashboard.orders(),
    ])
      .then(([plantsRes, ordersRes]) => {
        setPlants(plantsRes.plants || [])
        setOrders(ordersRes.orders || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const dueForWatering = plants.filter((p) => !p.lastWatered)

  const statusColor: Record<string, string> = {
    paid: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    processing: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    shipped: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {user?.name?.split(" ")[0] || "Plant Parent"}
        </h1>
        <p className="text-sm text-muted-foreground">Here&apos;s what&apos;s happening with your plants</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Plants Owned</CardTitle>
            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
              <Sprout className="size-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{plants.length}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              {plants.length === 0
                ? "No plants yet"
                : `${plants.length} plant${plants.length !== 1 ? "s" : ""} in your collection`
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Need Watering</CardTitle>
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
              <Droplets className="size-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dueForWatering.length}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              {dueForWatering.length === 0
                ? "All plants are watered!"
                : `${dueForWatering.length} plant${dueForWatering.length !== 1 ? "s" : ""} need attention`
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900/30">
              <ShoppingBag className="size-4 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{orders.length}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              {orders.length === 0
                ? "No orders placed yet"
                : `${orders.filter((o) => o.status === "delivered").length} delivered`
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-lg">Recent Orders</CardTitle>
          {orders.length > 0 && (
            <Link href="/dashboard/orders">
              <Button variant="ghost" size="sm" className="gap-1">
                View All
                <ArrowRight className="size-3" />
              </Button>
            </Link>
          )}
        </CardHeader>
        <CardContent>
          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-3 font-medium">Plant</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order._id} className="border-b last:border-0">
                      <td className="py-3 font-medium">{order.plantName}</td>
                      <td className="py-3">${order.price?.toFixed(2)}</td>
                      <td className="py-3">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                            statusColor[order.status] || "bg-muted text-muted-foreground"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center">
              <ShoppingBag className="mx-auto mb-2 size-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No orders yet.</p>
              <Link href="/plants">
                <Button variant="outline" size="sm" className="mt-3">
                  Start Shopping
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plants needing watering */}
      {dueForWatering.length > 0 && (
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg">Plants to Water</CardTitle>
            <Link href="/dashboard/my-plants">
              <Button variant="ghost" size="sm" className="gap-1">
                View All
                <ArrowRight className="size-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {dueForWatering.slice(0, 3).map((p) => (
                <div key={p._id} className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <Droplets className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium">{p.plantName}</div>
                    <div className="text-xs text-muted-foreground">Not watered yet</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
