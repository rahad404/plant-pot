"use client"

import { useEffect, useState } from "react"
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, TrendingDown } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { api, type Order } from "@/lib/api"

interface DashboardStats {
  totalPlants: number
  totalOrders: number
  totalUsers: number
  revenue: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.plants.list({ limit: "1" }),
      api.admin.orders.list({ limit: "100" }),
      api.users.list(),
    ])
      .then(([plantsRes, ordersRes, usersRes]) => {
        const orders = ordersRes.orders || []
        const revenue = orders.reduce((sum, o) => {
          return o.status !== "cancelled" ? sum + (o.price || 0) : sum
        }, 0)

        setStats({
          totalPlants: plantsRes.pagination?.total ?? 0,
          totalOrders: ordersRes.pagination?.total ?? orders.length,
          totalUsers: usersRes.users?.length ?? 0,
          revenue,
        })
        setRecentOrders(orders.slice(0, 5))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const statCards = stats
    ? [
        {
          title: "Total Plants",
          value: stats.totalPlants.toLocaleString(),
          icon: Package,
          change: "+12%",
          trend: "up" as const,
        },
        {
          title: "Total Orders",
          value: stats.totalOrders.toLocaleString(),
          icon: ShoppingCart,
          change: "+8%",
          trend: "up" as const,
        },
        {
          title: "Total Users",
          value: stats.totalUsers.toLocaleString(),
          icon: Users,
          change: "+5%",
          trend: "up" as const,
        },
        {
          title: "Revenue",
          value: `$${stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          icon: DollarSign,
          change: "+15%",
          trend: "up" as const,
        },
      ]
    : []

  const statusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30"
      case "processing":
        return "text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30"
      case "shipped":
        return "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30"
      case "delivered":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30"
      case "cancelled":
        return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30"
      default:
        return "text-muted-foreground bg-muted"
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your plant store</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="size-8 rounded" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="mb-1 h-8 w-16" />
                  <Skeleton className="h-3 w-12" />
                </CardContent>
              </Card>
            ))
          : statCards.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className="rounded-lg bg-primary/10 p-2">
                    <stat.icon className="size-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="mt-1 flex items-center gap-1 text-xs">
                    {stat.trend === "up" ? (
                      <TrendingUp className="size-3 text-green-500" />
                    ) : (
                      <TrendingDown className="size-3 text-red-500" />
                    )}
                    <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                      {stat.change}
                    </span>
                    <span className="text-muted-foreground">vs last month</span>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Plant</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="border-b last:border-0">
                      <td className="py-3">
                        <div className="font-medium">{order.userName}</div>
                        <div className="text-xs text-muted-foreground">{order.userEmail}</div>
                      </td>
                      <td className="py-3">{order.plantName}</td>
                      <td className="py-3">${order.price?.toFixed(2)}</td>
                      <td className="py-3">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColor(order.status)}`}
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
            <div className="py-8 text-center text-sm text-muted-foreground">
              No orders yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
