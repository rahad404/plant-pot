"use client"

import { useEffect, useState, useCallback } from "react"
import { Search, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { api, type Order } from "@/lib/api"

const STATUSES = ["paid", "processing", "shipped", "delivered", "cancelled"] as const

const statusColor: Record<string, string> = {
  paid: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  processing: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  shipped: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [updating, setUpdating] = useState<string | null>(null)

  const fetchOrders = useCallback(() => {
    setLoading(true)
    const params: Record<string, string> = { limit: "100" }
    if (search) params.search = search
    api.admin.orders.list(params)
      .then((data) => setOrders(data.orders || []))
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false))
  }, [search])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdating(orderId)
    try {
      await api.admin.orders.update(orderId, { status: newStatus })
      toast.success(`Order status updated to ${newStatus}`)
      fetchOrders()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update status")
    }
    setUpdating(null)
  }

  const filtered = orders.filter(
    (o) =>
      o.plantName?.toLowerCase().includes(search.toLowerCase()) ||
      o.userName?.toLowerCase().includes(search.toLowerCase()) ||
      o.userEmail?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Manage Orders</h1>
        <p className="text-sm text-muted-foreground">
          View and update order statuses
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by customer or plant..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Plant</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Update</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order) => (
                    <tr key={order._id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="font-medium">{order.userName}</div>
                        <div className="text-xs text-muted-foreground">{order.userEmail}</div>
                      </td>
                      <td className="px-4 py-3">{order.plantName}</td>
                      <td className="px-4 py-3">${order.price?.toFixed(2)}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                            statusColor[order.status] || "bg-muted text-muted-foreground"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Select
                            value={order.status}
                            onValueChange={(v) => handleStatusChange(order._id, v)}
                            disabled={updating === order._id}
                          >
                            <SelectTrigger className="h-8 w-36 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {STATUSES.map((s) => (
                                <SelectItem key={s} value={s} className="capitalize">
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {updating === order._id && (
                            <Loader2 className="size-4 animate-spin text-muted-foreground" />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-muted-foreground">
              {search ? "No orders match your search." : "No orders yet."}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
