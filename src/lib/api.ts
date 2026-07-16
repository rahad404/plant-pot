import { authClient } from "@/lib/auth-client"

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"

// Server-compatible JWT (signed with ACCESS_TOKEN_SECRET)
let serverToken: string | null = null

/** Public request — no auth token attached */
async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }))
    throw new Error(error.error || error.message || `HTTP ${res.status}`)
  }
  return res.json()
}

/**
 * Fetch a server-compatible JWT by sending the user's email to
 * the server's /api/auth/jwt endpoint. The server signs it with
 * ACCESS_TOKEN_SECRET which the verifyToken middleware expects.
 */
async function ensureServerToken(): Promise<string | undefined> {
  if (serverToken) return serverToken
  try {
    const { data: session } = await authClient.getSession()
    const email = session?.user?.email
    if (!email) return undefined
    const name = session?.user?.name || ""
    const uid = (session?.user as Record<string, unknown>)?.id as string || email

    const res = await fetch(`${BASE_URL}/api/auth/jwt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, uid }),
    })
    if (!res.ok) return undefined
    const data = await res.json()
    serverToken = data.token || null
    return serverToken || undefined
  } catch {
    return undefined
  }
}

/** Clear the cached server token (e.g. on logout) */
export function clearServerToken() {
  serverToken = null
}

/**
 * Authenticated request — fetches a server-compatible JWT and
 * attaches it as an Authorization: Bearer header.
 */
async function authRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = await ensureServerToken()

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string> | undefined),
  }
  if (token) headers["Authorization"] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }))
    throw new Error(error.error || error.message || `HTTP ${res.status}`)
  }
  return res.json()
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Plant {
  _id: string
  name: string
  slug?: string
  price: number
  description?: string
  shortDescription?: string
  images?: string[]
  image?: string
  rating?: number
  reviewsCount?: number
  category?: string
  light?: string
  watering?: string
  compost?: string
  medicine?: string
  inStock?: boolean
  badge?: string
  createdAt?: string
  stock?: number
}

export interface Category {
  name: string
  slug: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

// Backend returns: { plants, total, page, totalPages }
interface PlantsResponse {
  plants: Plant[]
  total: number
  page: number
  totalPages: number
  // Normalised pagination object (assembled from flat fields)
  pagination?: Pagination
}

interface CategoriesResponse {
  categories: Category[]
}

export interface Review {
  _id: string
  plantId: string
  userId: string
  userName: string
  userImage?: string
  rating: number
  comment: string
  createdAt: string
}

interface ReviewsResponse {
  reviews: Review[]
  pagination: Pagination
}

export interface Order {
  _id: string
  userId: string
  userName: string
  userEmail: string
  plantId: string
  plantName: string
  price: number
  status: string
  createdAt: string
}

interface OrdersResponse {
  orders: Order[]
  pagination?: Pagination
  total?: number
}

export interface UserProfile {
  _id: string
  id?: string
  name: string
  email: string
  image?: string
  role?: string
  createdAt?: string
}

interface UsersResponse {
  users: UserProfile[]
}

export interface CareSchedule {
  _id: string
  userId: string
  plantId: string
  plantName: string
  orderId: string
  lastWatered: string | null
  nextWatering?: string | null
  createdAt: string
  light?: string
  watering?: string
  compost?: string
  medicine?: string
  image?: string
  wateringFrequencyDays?: number
}

interface DashboardOrdersResponse {
  orders: Order[]
}

interface DashboardMyPlantsResponse {
  plants: CareSchedule[]
}

// ─── Normalise the plants list response ──────────────────────────────────────
// The backend returns { plants, total, page, totalPages } (flat),
// but callers expect a pagination object. We normalise here so both work.
function normalisePlantsResponse(raw: PlantsResponse, limit: number): PlantsResponse & { pagination: Pagination } {
  const page = raw.page ?? 1
  const total = raw.total ?? 0
  const totalPages = raw.totalPages ?? 1
  return {
    ...raw,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  }
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const api = {
  dashboard: {
    myPlants() {
      return authRequest<DashboardMyPlantsResponse>("/api/dashboard/my-plants")
    },
    orders() {
      return authRequest<DashboardOrdersResponse>("/api/dashboard/orders")
    },
    markAsWatered(id: string) {
      return authRequest<{ success: boolean; message: string; nextWatering: string }>(
        `/api/dashboard/care-schedule/${id}/watered`,
        { method: "PATCH" }
      )
    },
  },

  orders: {
    create(data: { plantId: string; plantName: string; price: number }) {
      return authRequest<{ order: Order }>("/api/orders", {
        method: "POST",
        body: JSON.stringify(data),
      })
    },
  },

  contact: {
    submit(data: { name: string; email: string; message: string }) {
      return request<{ success: boolean }>("/api/contact", {
        method: "POST",
        body: JSON.stringify(data),
      })
    },
  },

  admin: {
    orders: {
      async list(params?: Record<string, string>) {
        const qs = params ? "?" + new URLSearchParams(params).toString() : ""
        const raw = await authRequest<OrdersResponse>(`/api/admin/orders${qs}`)
        // Normalise pagination if missing
        if (!raw.pagination && raw.total !== undefined) {
          const limit = Number(params?.limit ?? 10)
          const page = Number(params?.page ?? 1)
          const total = raw.total ?? 0
          const totalPages = Math.ceil(total / limit) || 1
          raw.pagination = {
            page,
            limit,
            total,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          }
        }
        return raw
      },
      update(id: string, data: { status: string }) {
        return authRequest<{ success: boolean; message: string }>(`/api/admin/orders/${id}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        })
      },
    },
  },

  users: {
    list() {
      return authRequest<UsersResponse>("/api/users")
    },
    promoteToAdmin(id: string) {
      return authRequest<{ success: boolean; message: string }>(`/api/users/admin/${id}`, {
        method: "PATCH",
      })
    },
    update(id: string, data: { name?: string; image?: string }) {
      return authRequest<{ success: boolean; message: string }>(`/api/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      })
    },
  },

  plants: {
    async list(params?: Record<string, string>) {
      // Map frontend sort values to server sort values
      const SORT_MAP: Record<string, string> = {
        "price-asc": "price_asc",
        "price-desc": "price_desc",
        "rating": "rating_desc",
      }
      const mappedParams = { ...params }
      if (mappedParams.sort) {
        const serverSort = SORT_MAP[mappedParams.sort]
        if (serverSort) {
          mappedParams.sort = serverSort
        } else {
          // "newest" and "name" — server defaults to createdAt desc
          delete mappedParams.sort
        }
      }
      const qs = mappedParams && Object.keys(mappedParams).length ? "?" + new URLSearchParams(mappedParams).toString() : ""
      const raw = await request<PlantsResponse>(`/api/plants${qs}`)
      const limit = Number(params?.limit ?? 12)
      return normalisePlantsResponse(raw, limit)
    },
    // Backend returns the plant object directly (not wrapped in { plant: ... })
    get(id: string): Promise<Plant> {
      return request<Plant>(`/api/plants/${id}`)
    },
    create(data: Partial<Plant>) {
      return authRequest<{ success: boolean; plantId: string }>("/api/plants", {
        method: "POST",
        body: JSON.stringify(data),
      })
    },
    update(id: string, data: Partial<Plant>) {
      return authRequest<{ success: boolean }>(`/api/plants/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      })
    },
    delete(id: string) {
      return authRequest<{ success: boolean }>(`/api/plants/${id}`, {
        method: "DELETE",
      })
    },
    categories() {
      return request<CategoriesResponse>("/api/plants/categories")
    },
    reviews: {
      list(plantId: string, params?: Record<string, string>) {
        const qs = params ? "?" + new URLSearchParams(params).toString() : ""
        return request<ReviewsResponse>(`/api/plants/${plantId}/reviews${qs}`)
      },
      create(plantId: string, data: { rating: number; comment: string }) {
        return authRequest<{ review: Review }>(`/api/plants/${plantId}/reviews`, {
          method: "POST",
          body: JSON.stringify(data),
        })
      },
    },
  },
}
