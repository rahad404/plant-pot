import Link from "next/link"
import { Leaf, Globe, Mail, Phone, MapPin } from "lucide-react"

const footerLinks = {
  shop: [
    { label: "All Plants", href: "/plants" },
    { label: "Indoor Plants", href: "/plants?category=indoor" },
    { label: "Outdoor Plants", href: "/plants?category=outdoor" },
    { label: "Succulents", href: "/plants?category=succulents" },
    { label: "Plant Care", href: "/care" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Careers", href: "#" },
    { label: "Blog", href: "#" },
  ],
  support: [
    { label: "FAQ", href: "#" },
    { label: "Shipping", href: "#" },
    { label: "Returns", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/20">
                <Leaf className="text-primary-foreground" size={20} />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Plant<span className="text-primary">Pot</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Your one-stop shop for beautiful plants and expert care tips. Bring nature into your home with PlantPot.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="#" className="flex size-9 items-center justify-center rounded-lg border bg-muted/50 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <Globe size={18} />
              </a>
              <a href="#" className="flex size-9 items-center justify-center rounded-lg border bg-muted/50 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <Globe size={18} />
              </a>
              <a href="#" className="flex size-9 items-center justify-center rounded-lg border bg-muted/50 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <Globe size={18} />
              </a>
            </div>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail size={14} />
                <span>hello@plantpot.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} />
                <span>123 Green Street, Plant City</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Shop</h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} PlantPot. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
