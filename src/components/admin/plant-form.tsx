"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { api, type Plant } from "@/lib/api"

interface PlantFormProps {
  plant?: Plant | null
  loading?: boolean
}

export function PlantForm({ plant, loading }: PlantFormProps) {
  const router = useRouter()
  const isEditing = !!plant

  const [name, setName] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [light, setLight] = useState("")
  const [watering, setWatering] = useState("")
  const [compost, setCompost] = useState("")
  const [medicine, setMedicine] = useState("")
  const [image, setImage] = useState("")
  const [badge, setBadge] = useState("")
  const [inStock, setInStock] = useState("true")
  const [categories, setCategories] = useState<{ name: string; slug: string }[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.plants.categories()
      .then((data) => setCategories(data.categories || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (plant) {
      setName(plant.name || "")
      setShortDescription(plant.shortDescription || "")
      setDescription(plant.description || "")
      setPrice(String(plant.price ?? ""))
      setCategory(plant.category || "")
      setLight(plant.light || "")
      setWatering(plant.watering || "")
      setCompost(plant.compost || "")
      setMedicine(plant.medicine || "")
      setImage(plant.images?.[0] || plant.image || "")
      setBadge(plant.badge || "")
      setInStock(plant.inStock === false ? "false" : "true")
    }
  }, [plant])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !price) {
      toast.error("Name and price are required")
      return
    }
    setSaving(true)
    try {
      const payload = {
        name: name.trim(),
        price: parseFloat(price),
        category,
        description,
        shortDescription,
        light,
        watering,
        compost,
        medicine,
        images: image ? [image] : [],
        image,
        badge,
        inStock: inStock === "true",
      }

      if (isEditing && plant) {
        await api.plants.update(plant._id, payload)
        toast.success("Plant updated")
      } else {
        await api.plants.create(payload)
        toast.success("Plant created")
      }
      router.push("/admin/plants")
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save plant")
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="shortDescription">Short Description</Label>
          <Input id="shortDescription" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Full Description</Label>
          <Textarea id="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price ($) *</Label>
          <Input id="price" type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
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

        <div className="space-y-2">
          <Label htmlFor="light">Light Requirement</Label>
          <Select value={light} onValueChange={setLight}>
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
          <Label htmlFor="watering">Watering Frequency</Label>
          <Select value={watering} onValueChange={setWatering}>
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
          <Label htmlFor="compost">Compost / Fertilizer</Label>
          <Input id="compost" value={compost} onChange={(e) => setCompost(e.target.value)} placeholder="e.g. Liquid seaweed, once a month" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="medicine">Medicine / Treatment Tips</Label>
          <Input id="medicine" value={medicine} onChange={(e) => setMedicine(e.target.value)} placeholder="e.g. Neem oil for pests" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="badge">Badge</Label>
          <Input id="badge" value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="e.g. Bestseller, New" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="inStock">Stock Status</Label>
          <Select value={inStock} onValueChange={setInStock}>
            <SelectTrigger id="inStock">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">In Stock</SelectItem>
              <SelectItem value="false">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="image">Image URL</Label>
          <Input id="image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />
          {image && (
            <div className="mt-2 flex items-center gap-3">
              <div className="size-16 overflow-hidden rounded-md border bg-muted">
                <img src={image} alt="Preview" className="size-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
              </div>
              <span className="text-xs text-muted-foreground">Preview</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
          {isEditing ? "Save Changes" : "Create Plant"}
        </Button>
      </div>
    </form>
  )
}
