export async function uploadImageToImgBB(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API
  if (!apiKey) {
    throw new Error("Image upload API key not configured")
  }

  const formData = new FormData()
  formData.append("image", file)

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  })

  const data = await res.json()

  if (!res.ok || !data.success) {
    throw new Error(data.error?.message || "Failed to upload image")
  }

  return data.data.url
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Only JPG, PNG, WebP, and GIF images are allowed" }
  }

  if (file.size > maxSize) {
    return { valid: false, error: "Image must be less than 5MB" }
  }

  return { valid: true }
}