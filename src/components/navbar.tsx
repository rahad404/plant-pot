"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, Leaf, LogOut, User, ShoppingBag, LayoutDashboard } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ui/modetoggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { authClient } from "@/lib/auth-client"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Plants", href: "/plants" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const user = session?.user
  const role = user?.role as string | undefined

  const isAdmin = role === "admin"

  const handleLogout = async () => {
    try {
      // Call the better-auth signout endpoint directly to ensure cookie is cleared
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/sign-out`, {
        method: "POST",
        credentials: "include",
      })
      await authClient.signOut()
    } catch {
      // Ignore errors
    }
    toast.success("Logged out")
    router.push("/")
    router.refresh()
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/20">
              <Leaf className="text-primary-foreground" size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Plant<span className="text-primary">Pot</span>
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <>
              <Link
                href="/dashboard"
                className="text-muted-foreground transition-colors hover:text-foreground flex items-center gap-1.5"
              >
                <LayoutDashboard className="size-4" />
                <span>Dashboard</span>
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-muted-foreground transition-colors hover:text-foreground flex items-center gap-1.5"
                >
                  <ShoppingBag className="size-4" />
                  <span>Admin</span>
                </Link>
              )}
            </>
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ModeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 transition-opacity hover:opacity-90 focus:outline-none">
                  <span className="text-sm font-medium text-foreground">{user.name}</span>
                  <Avatar className="size-9 rounded-full">
                    <AvatarImage referrerPolicy="no-referrer" src={user.image ?? undefined} alt={user.name} />
                    <AvatarFallback>{user.name?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex cursor-pointer items-center gap-2">
                    <LayoutDashboard className="size-4" />
                    <span>User Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex cursor-pointer items-center gap-2">
                      <ShoppingBag className="size-4" />
                      <span>Admin Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="flex cursor-pointer items-center gap-2">
                    <User className="size-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex cursor-pointer items-center gap-2 text-destructive focus:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="size-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="border-b bg-background px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <hr className="my-4 border-border" />
          {user ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 rounded-md border bg-muted/40 p-3">
                <Avatar className="size-10 rounded-full">
                  <AvatarImage referrerPolicy="no-referrer" src={user.image ?? undefined} alt={user.name} />
                  <AvatarFallback>{user.name?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
              </div>
              <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <LayoutDashboard className="size-4" />
                  Dashboard
                </Button>
              </Link>
              {isAdmin && (
                <Link href="/admin" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <ShoppingBag className="size-4" />
                    Admin Dashboard
                  </Button>
                </Link>
              )}
              <Link href="/dashboard/profile" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <User className="size-4" />
                  Profile
                </Button>
              </Link>
              <Button
                variant="destructive"
                className="w-full justify-start gap-2"
                onClick={() => { handleLogout(); setIsOpen(false) }}
              >
                <LogOut className="size-4" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full">Log in</Button>
              </Link>
              <Link href="/signup" onClick={() => setIsOpen(false)}>
                <Button className="w-full">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
