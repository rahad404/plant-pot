"use client"

import { useEffect, useState, useCallback } from "react"
import {
  ShoppingBag,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { api, type Order } from "@/lib/api"

const statusConfig: Record<
  string,
  { label: string; icon: typeof Clock; color: string }
> = {
  paid: {
    label: "Paid",
    icon: Clock,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  processing: {
    label: "Processing",
    icon: Package,
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
}

function OrderCard({ order }: { order: Order }) {
  const [open, setOpen] = useState(false)
  const cfg = statusConfig[order.status] || statusConfig.paid
  const Icon = cfg.icon

  return (
    <Card>
      <CardContent className="p-0">
        <button
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between gap-4 p-4 text-left transition-colors hover:bg-muted/50"
        >
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="size-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <div className="truncate font-medium">{order.plantName}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden text-sm font-semibold sm:block">
              ${order.price?.toFixed(2)}
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${cfg.color}`}
            >
              <Icon className="size-3" />
              {cfg.label}
            </span>
            {open ? (
              <ChevronUp className="size-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="size-4 text-muted-foreground" />
            )}
          </div>
        </button>

        {open && (
          <div className="border-t px-4 pb-4 pt-3 text-sm">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
              <div>
                <dt className="text-xs text-muted-foreground">Order ID</dt>
                <dd className="font-mono text-xs">{order._id}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Plant</dt>
                <dd>{order.plantName}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Amount</dt>
                <dd className="font-medium">${order.price?.toFixed(2)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Status</dt>
                <dd className="flex items-center gap-1 capitalize">
                  <Icon className="size-3" />
                  {cfg.label}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Date</dt>
                <dd>
                  {new Date(order.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Email</dt>
                <dd className="truncate">{order.userEmail}</dd>
              </div>
            </dl>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    setError(null)
    try {
      const res = await api.dashboard.orders()
      setOrders(res.orders || [])
    } catch {
      setError("Failed to load orders.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <AlertCircle className="mb-3 size-10 text-destructive" />
        <p className="font-medium">{error}</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={fetchOrders}>
          Try Again
        </Button>
      </div>
    )
  }

  const counts = {
    total: orders.length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    pending: orders.filter((o) => !["delivered", "cancelled"].includes(o.status)).length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Orders</h1>
        <p className="text-sm text-muted-foreground">Track and review your plant orders</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold">{counts.total}</div>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{counts.delivered}</div>
            <p className="text-xs text-muted-foreground">Delivered</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-amber-600">{counts.pending}</div>
            <p className="text-xs text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-muted-foreground">{counts.cancelled}</div>
            <p className="text-xs text-muted-foreground">Cancelled</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders list */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <ShoppingBag className="mb-3 size-12 text-muted-foreground/40" />
          <p className="text-lg font-medium">No orders yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            When you purchase plants, your orders will appear here
          </p>
          <a href="/plants">
            <Button variant="default" size="sm" className="mt-4">
              Browse Plants
            </Button>
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}
