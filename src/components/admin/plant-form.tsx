"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Image as ImageIcon, X } from "lucide-react"
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
import { uploadImageToImgBB, validateImageFile } from "@/lib/image-upload"

const DEFAULT_CATEGORIES = [
  "Indoor",
  "Outdoor",
  "Succulents",
  "Flowering",
  "Tropical",
  "Herbs",
  "Ferns",
  "Air Plants",
]

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
  const [customCategory, setCustomCategory] = useState("")
  const [useCustomCategory, setUseCustomCategory] = useState(false)
  const [light, setLight] = useState("")
  const [watering, setWatering] = useState("")
  const [compost, setCompost] = useState("")
  const [medicine, setMedicine] = useState("")
  const [image, setImage] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [badge, setBadge] = useState("")
  const [inStock, setInStock] = useState("true")
  const [stock, setStock] = useState("10")
  const [dbCategories, setDbCategories] = useState<{ name: string; slug: string }[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.plants
      .categories()
      .then((data) => setDbCategories(data.categories || []))
      .catch(() => setDbCategories([]))
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
      setImagePreview(plant.images?.[0] || plant.image || null)
      setBadge(plant.badge || "")
      setInStock(plant.inStock === false ? "false" : "true")
      setStock(String(plant.stock ?? 10))
    }
  }, [plant])

  const allCategories = [
    ...dbCategories.map((c) => c.name),
    ...DEFAULT_CATEGORIES.filter(
      (d) => !dbCategories.some((c) => c.name.toLowerCase() === d.toLowerCase())
    ),
  ]

  const effectiveCategory = useCustomCategory ? customCategory : category

  const handleImageChange = useCallback((file: File | null) => {
    if (!file) {
      setImageFile(null)
      setImagePreview(null)
      setImage("")
      return
    }

    const validation = validateImageFile(file)
    if (!validation.valid) {
      toast.error(validation.error!)
      return
    }

    setImageFile(file)
    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    handleImageChange(file)
  }, [handleImageChange])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files[0]
    if (file) handleImageChange(file)
  }, [handleImageChange])

  const handleRemoveImage = useCallback(() => {
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    handleImageChange(null)
  }, [imagePreview, handleImageChange])

  const uploadAndSetImage = async (file: File): Promise<string> => {
    setUploadingImage(true)
    try {
      const url = await uploadImageToImgBB(file)
      setImage(url)
      toast.success("Image uploaded successfully")
      return url
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to upload image")
      throw err
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !price) {
      toast.error("Name and price are required")
      return
    }
    if (!effectiveCategory.trim()) {
      toast.error("Category is required")
      return
    }

    let finalImageUrl = image

    if (imageFile && !image.startsWith("http")) {
      try {
        finalImageUrl = await uploadAndSetImage(imageFile)
      } catch {
        return
      }
    }

    setSaving(true)
    try {
      const payload = {
        name: name.trim(),
        price: parseFloat(price),
        category: effectiveCategory.trim().toLowerCase(),
        description,
        shortDescription,
        light,
        watering,
        compost,
        medicine,
        images: finalImageUrl ? [finalImageUrl] : [],
        badge,
        inStock: inStock === "true",
        stock: Number(stock),
      }

      if (isEditing && plant) {
        await api.plants.update(plant._id, payload)
        toast.success("Plant updated successfully")
      } else {
        await api.plants.create(payload)
        toast.success("Plant created successfully")
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

  const hasImage = imagePreview || image

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="name">Plant Name *</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Monstera Deliciosa" required />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="shortDescription">Short Description</Label>
          <Input id="shortDescription" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} placeholder="A brief, catchy description" />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Full Description</Label>
          <Textarea id="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detailed description of the plant..." />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price ($) *</Label>
          <Input id="price" type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock Quantity</Label>
          <Input id="stock" type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} />
        </div>

        {/* Category: dropdown OR free-text input */}
        <div className="space-y-2 md:col-span-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="category">Category *</Label>
            <button
              type="button"
              className="text-xs text-primary underline-offset-2 hover:underline"
              onClick={() => {
                setUseCustomCategory(!useCustomCategory)
                if (!useCustomCategory) setCustomCategory("")
              }}
            >
              {useCustomCategory ? "← Pick from list" : "Type a new category →"}
            </button>
          </div>
          {useCustomCategory ? (
            <Input
              id="customCategory"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="e.g. Carnivorous, Bonsai..."
            />
          ) : (
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {allCategories.map((cat) => (
                  <SelectItem key={cat} value={cat.toLowerCase()}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
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
              <SelectItem value="full sun">Full Sun</SelectItem>
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
              <SelectItem value="low">Low (every 2–3 weeks)</SelectItem>
              <SelectItem value="moderate">Moderate (weekly)</SelectItem>
              <SelectItem value="frequent">Frequent (every 2–3 days)</SelectItem>
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
          <Label htmlFor="badge">Badge Label</Label>
          <Input id="badge" value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="e.g. Bestseller, New, Easy Care" />
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

        {/* Image Upload */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="image">Plant Image *</Label>
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
              hasImage ? "border-transparent bg-muted/30" : "border-muted-foreground/20 hover:border-primary/50"
            }`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="image"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploadingImage}
            />

            {hasImage ? (
              <div className="relative size-20 overflow-hidden rounded-md border bg-muted mx-auto">
                <img
                  src={imagePreview || image}
                  alt="Preview"
                  className="size-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 rounded-full bg-red-500/90 text-white p-1 shadow-lg hover:bg-red-600 transition-colors"
                  aria-label="Remove image"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-center">
                <ImageIcon className="size-12 text-muted-foreground/50" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Drag & drop or click to upload</p>
                  <p className="text-xs text-muted-foreground">JPG, PNG, WebP, GIF up to 5MB</p>
                </div>
              </div>
            )}

            {uploadingImage && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                <Loader2 className="size-8 animate-spin text-white" />
              </div>
            )}
          </div>

          {image && !imagePreview && (
            <p className="text-xs text-muted-foreground">Using existing image URL</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving || uploadingImage}>
          {(saving || uploadingImage) && <Loader2 className="mr-2 size-4 animate-spin" />}
          {isEditing ? "Save Changes" : "Create Plant"}
        </Button>
      </div>
    </form>
  )
}
