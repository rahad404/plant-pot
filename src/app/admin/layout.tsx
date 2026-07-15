"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Package, ShoppingCart, Users, Leaf } from "lucide-react"

import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"

const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Plants", href: "/admin/plants", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Users", href: "/admin/users", icon: Users },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const role = (session?.user as Record<string, unknown> | undefined)?.role as string | undefined
  const isAdmin = role === "admin"

  useEffect(() => {
    if (!isPending && !isAdmin) {
      router.push("/login?callbackUrl=/admin")
    }
  }, [isPending, isAdmin, router])

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-56 shrink-0 border-r bg-muted/30 md:block">
        <div className="flex h-14 items-center gap-2 border-b px-4">
          <Leaf className="size-5 text-primary" />
          <span className="text-sm font-semibold">Admin Panel</span>
        </div>
        <nav className="space-y-1 p-3">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <link.icon className="size-4" />
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
