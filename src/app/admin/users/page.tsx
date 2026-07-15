"use client"

import { useEffect, useState, useCallback } from "react"
import { Search, Shield, ShieldCheck, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { api, type UserProfile } from "@/lib/api"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [promoting, setPromoting] = useState<string | null>(null)

  const fetchUsers = useCallback(() => {
    setLoading(true)
    api.users.list()
      .then((data) => setUsers(data.users || []))
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const handlePromote = async (userId: string) => {
    setPromoting(userId)
    try {
      await api.users.promoteToAdmin(userId)
      toast.success("User promoted to admin")
      fetchUsers()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to promote user")
    }
    setPromoting(null)
  }

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Manage Users</h1>
        <p className="text-sm text-muted-foreground">
          View all users and manage admin roles
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
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
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Joined</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user) => {
                    const userId = user.id || user._id
                    const role = user.role || "user"
                    return (
                      <tr key={userId} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                              {user.name?.[0]?.toUpperCase() || "?"}
                            </div>
                            <div className="font-medium">{user.name}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                        <td className="px-4 py-3">
                          {role === "admin" ? (
                            <Badge variant="default" className="gap-1">
                              <ShieldCheck className="size-3" />
                              Admin
                            </Badge>
                          ) : (
                            <Badge variant="secondary">User</Badge>
                          )}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {role !== "admin" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1"
                              disabled={promoting === userId}
                              onClick={() => handlePromote(userId)}
                            >
                              {promoting === userId ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <Shield className="size-4" />
                              )}
                              Promote
                            </Button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-muted-foreground">
              {search ? "No users match your search." : "No users found."}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
