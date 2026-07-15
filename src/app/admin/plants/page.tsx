"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Plus, Search, Pencil, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { api, type Plant } from "@/lib/api"

export default function AdminPlantsPage() {
  const [plants, setPlants] = useState<Plant[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchPlants = useCallback(() => {
    setLoading(true)
    const params: Record<string, string> = { limit: "100" }
    if (search) params.search = search
    api.plants.list(params)
      .then((data) => setPlants(data.plants || []))
      .catch(() => toast.error("Failed to load plants"))
      .finally(() => setLoading(false))
  }, [search])

  useEffect(() => { fetchPlants() }, [fetchPlants])

  const handleDelete = async (id: string) => {
    setDeleting(true)
    try {
      await api.plants.delete(id)
      toast.success("Plant deleted")
      setDeletingId(null)
      fetchPlants()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete plant")
    }
    setDeleting(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Plants</h1>
          <p className="text-sm text-muted-foreground">
            Add, edit, or remove plants from your catalog
          </p>
        </div>
        <Link href="/admin/plants/add">
          <Button>
            <Plus className="mr-2 size-4" />
            Add Plant
          </Button>
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search plants..."
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
          ) : plants.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Plant</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                    <th className="px-4 py-3 font-medium">Rating</th>
                    <th className="px-4 py-3 font-medium">Stock</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {plants.map((plant) => (
                    <tr key={plant._id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="size-10 shrink-0 overflow-hidden rounded-md bg-muted">
                            <img
                              src={plant.images?.[0] || plant.image || "/placeholder.svg"}
                              alt={plant.name}
                              className="size-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{plant.name}</div>
                            {plant.badge && (
                              <Badge variant="secondary" className="mt-0.5 text-[10px]">
                                {plant.badge}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 capitalize text-muted-foreground">
                        {plant.category || "—"}
                      </td>
                      <td className="px-4 py-3">${plant.price?.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        {plant.rating ? `${plant.rating.toFixed(1)} ★` : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {plant.inStock === false ? (
                          <span className="text-xs font-medium text-red-500">Out of stock</span>
                        ) : (
                          <span className="text-xs font-medium text-green-500">In stock</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/plants/${plant._id}/edit`}>
                            <Button variant="ghost" size="icon" className="size-8">
                              <Pencil className="size-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-destructive hover:text-destructive"
                            onClick={() => setDeletingId(plant._id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-muted-foreground">
              {search ? "No plants match your search." : "No plants yet. Add your first plant!"}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!deletingId} onOpenChange={(open) => { if (!open) setDeletingId(null) }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Plant</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this plant? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeletingId(null)}>Cancel</Button>
            <Button
              variant="destructive"
              disabled={deleting}
              onClick={() => deletingId && handleDelete(deletingId)}
            >
              {deleting && <Loader2 className="mr-2 size-4 animate-spin" />}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
