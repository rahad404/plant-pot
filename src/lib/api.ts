const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"

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
    throw new Error(error.error || `HTTP ${res.status}`)
  }
  return res.json()
}

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

interface PlantsResponse {
  plants: Plant[]
  pagination: Pagination
}

interface PlantResponse {
  plant: Plant
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
  pagination: Pagination
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
  createdAt: string
  light?: string
  watering?: string
  compost?: string
  medicine?: string
  image?: string
}

interface DashboardOrdersResponse {
  orders: Order[]
}

interface DashboardMyPlantsResponse {
  plants: CareSchedule[]
}

export const api = {
  dashboard: {
    myPlants() {
      return request<DashboardMyPlantsResponse>("/api/dashboard/my-plants")
    },
    orders() {
      return request<DashboardOrdersResponse>("/api/dashboard/orders")
    },
    markAsWatered(id: string) {
      return request<{ careSchedule: CareSchedule }>(
        `/api/care-schedule/${id}/watered`,
        { method: "PATCH" }
      )
    },
  },
  orders: {
    create(data: { plantId: string; plantName: string; price: number }) {
      return request<{ order: Order }>("/api/orders", {
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
      list(params?: Record<string, string>) {
        const qs = params ? "?" + new URLSearchParams(params).toString() : ""
        return request<OrdersResponse>(`/api/admin/orders${qs}`)
      },
      update(id: string, data: { status: string }) {
        return request<{ order: Order }>(`/api/admin/orders/${id}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        })
      },
    },
  },
  users: {
    list() {
      return request<UsersResponse>("/api/users")
    },
    promoteToAdmin(id: string) {
      return request<{ user: UserProfile }>(`/api/users/admin/${id}`, {
        method: "PATCH",
      })
    },
  },
  plants: {
    list(params?: Record<string, string>) {
      const qs = params ? "?" + new URLSearchParams(params).toString() : ""
      return request<PlantsResponse>(`/api/plants${qs}`)
    },
    get(id: string) {
      return request<PlantResponse>(`/api/plants/${id}`)
    },
    create(data: Partial<Plant>) {
      return request<PlantResponse>("/api/plants", {
        method: "POST",
        body: JSON.stringify(data),
      })
    },
    update(id: string, data: Partial<Plant>) {
      return request<PlantResponse>(`/api/plants/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      })
    },
    delete(id: string) {
      return request<{ success: boolean }>(`/api/plants/${id}`, {
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
        return request<{ review: Review }>(`/api/plants/${plantId}/reviews`, {
          method: "POST",
          body: JSON.stringify(data),
        })
      },
    },
  },
}
