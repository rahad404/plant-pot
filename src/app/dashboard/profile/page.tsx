"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Camera, CheckCircle2, AlertCircle, Loader2, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { authClient } from "@/lib/auth-client"
import { api } from "@/lib/api"
import { uploadImageToImgBB, validateImageFile } from "@/lib/image-upload"

export default function ProfilePage() {
  const { data: session, isPending, refetch: refetchSession } = authClient.useSession()
  const user = session?.user

  const [name, setName] = useState("")
  const [image, setImage] = useState("")
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (user) {
      setName(user.name || "")
      setImage(user.image || "")
    }
  }, [user])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = validateImageFile(file)
    if (!validation.valid) {
      setMessage({ type: "error", text: validation.error || "Invalid file" })
      return
    }

    setUploading(true)
    setMessage(null)
    try {
      const url = await uploadImageToImgBB(file)
      setImage(url)
      setMessage({ type: "success", text: "Image uploaded successfully. Save changes to apply." })
    } catch {
      setMessage({ type: "error", text: "Failed to upload image. Try again." })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleSave = async () => {
    const userId = (user as Record<string, unknown>)?.id as string | undefined
    if (!userId) return
    setSaving(true)
    setMessage(null)
    try {
      await api.users.update(userId, { name, image: image || undefined })
      try {
        await refetchSession()
      } catch {
        // session sync is best-effort
      }
      setMessage({ type: "success", text: "Profile updated successfully." })
    } catch {
      setMessage({ type: "error", text: "Failed to update profile. Try again." })
    } finally {
      setSaving(false)
    }
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U"

  if (isPending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-72" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account details and preferences
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Avatar card */}
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-6">
            <div className="relative">
              {image ? (
                <div className="relative size-28 overflow-hidden rounded-full">
                  <Image
                    src={image}
                    alt={name || "Profile"}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex size-28 items-center justify-center rounded-full bg-muted text-3xl font-bold text-muted-foreground">
                  {initials}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-1 -right-1 cursor-pointer rounded-full border-4 border-background bg-primary p-1.5 text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <Camera className="size-3" />
                )}
              </button>
            </div>
            <div className="text-center">
              <p className="font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Badge
              variant={user.role === "admin" ? "default" : "secondary"}
              className="capitalize"
            >
              {user.role || "user"}
            </Badge>
          </CardContent>
        </Card>

        {/* Edit form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Edit Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user.email || ""}
                disabled
                className="text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Profile Image</Label>
              <div className="flex items-center gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <Upload className="mr-2 size-4" />
                  )}
                  {uploading ? "Uploading..." : "Upload Image"}
                </Button>
                {image && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="relative size-8 overflow-hidden rounded-full border">
                      <Image
                        src={image}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    Image ready
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                JPG, PNG, WebP, or GIF. Max 5MB.
              </p>
            </div>

            {message && (
              <div
                className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${
                  message.type === "success"
                    ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400"
                    : "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400"
                }`}
            >
                {message.type === "success" ? (
                  <CheckCircle2 className="size-4 shrink-0" />
                ) : (
                  <AlertCircle className="size-4 shrink-0" />
                )}
                {message.text}
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={saving || uploading || !name.trim()}>
                {saving && <Loader2 className="mr-1 size-4 animate-spin" />}
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setName(user.name || "")
                  setImage(user.image || "")
                  setMessage(null)
                }}
                disabled={saving || uploading}
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
