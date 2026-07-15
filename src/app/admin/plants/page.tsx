"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, Pencil, Trash2, X, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { api, type Plant } from "@/lib/api"
import { authClient } from "@/lib/auth-client"

const defaultForm = {
  name: "",
  price: "",
  category: "",
  description: "",
  shortDescription: "",
  light: "",
  watering: "",
  compost: "",
  medicine: "",
  image: "",
  badge: "",
  inStock: "true",
}

type FormData = typeof defaultForm

export default function AdminPlantsPage() {
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const role = (session?.user as Record<string, unknown> | undefined)?.role

  const [plants, setPlants] = useState<Plant[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [categories, setCategories] = useState<{ name: string; slug: string }[]>([])

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>(defaultForm)
  const [saving, setSaving] = useState(false)

  // Delete confirm
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

  useEffect(() => {
    fetchPlants()
    api.plants.categories()
      .then((data) => setCategories(data.categories || []))
      .catch(() => {})
  }, [fetchPlants])

  const openAdd = () => {
    setEditingId(null)
    setForm(defaultForm)
    setDialogOpen(true)
  }

  const openEdit = (plant: Plant) => {
    setEditingId(plant._id)
    setForm({
      name: plant.name || "",
      price: String(plant.price || ""),
      category: plant.category || "",
      description: plant.description || "",
      shortDescription: plant.shortDescription || "",
      light: plant.light || "",
      watering: plant.watering || "",
      compost: plant.compost || "",
      medicine: plant.medicine || "",
      image: (plant.images?.[0] || plant.image) || "",
      badge: plant.badge || "",
      inStock: plant.inStock === false ? "false" : "true",
    })
    setDialogOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        name: form.name,
        price: parseFloat(form.price),
        category: form.category,
        description: form.description,
        shortDescription: form.shortDescription,
        light: form.light,
        watering: form.watering,
        compost: form.compost,
        medicine: form.medicine,
        images: form.image ? [form.image] : [],
        image: form.image,
        badge: form.badge,
        inStock: form.inStock === "true",
      }

      if (editingId) {
        await api.plants.update(editingId, payload)
        toast.success("Plant updated")
      } else {
        await api.plants.create(payload)
        toast.success("Plant created")
      }
      setDialogOpen(false)
      fetchPlants()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save plant")
    }
    setSaving(false)
  }

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
        <Button onClick={openAdd}>
          <Plus className="mr-2 size-4" />
          Add Plant
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search plants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
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
                          <Button variant="ghost" size="icon" className="size-8" onClick={() => openEdit(plant)}>
                            <Pencil className="size-4" />
                          </Button>
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

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Plant" : "Add Plant"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Update the plant details below." : "Fill in the details to add a new plant."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input id="price" type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Input id="shortDescription" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea id="description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="light">Light</Label>
                <Select value={form.light} onValueChange={(v) => setForm({ ...form, light: v })}>
                  <SelectTrigger id="light">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="bright">Bright</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="watering">Watering</Label>
                <Select value={form.watering} onValueChange={(v) => setForm({ ...form, watering: v })}>
                  <SelectTrigger id="watering">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="frequent">Frequent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="compost">Fertilizer / Compost</Label>
                <Input id="compost" value={form.compost} onChange={(e) => setForm({ ...form, compost: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medicine">Medicine / Treatment</Label>
                <Input id="medicine" value={form.medicine} onChange={(e) => setForm({ ...form, medicine: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="badge">Badge</Label>
                <Input id="badge" placeholder="e.g. Bestseller" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inStock">Stock Status</Label>
                <Select value={form.inStock} onValueChange={(v) => setForm({ ...form, inStock: v })}>
                  <SelectTrigger id="inStock">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">In Stock</SelectItem>
                    <SelectItem value="false">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="image">Image URL</Label>
                <Input id="image" placeholder="https://..." value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
                {editingId ? "Save Changes" : "Create Plant"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deletingId} onOpenChange={(open) => { if (!open) setDeletingId(null) }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Plant</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this plant? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeletingId(null)}>
              Cancel
            </Button>
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
