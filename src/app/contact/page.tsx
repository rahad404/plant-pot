"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, Globe, Clock, Send, Loader2, CheckCircle } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { api } from "@/lib/api"

const contactInfo = [
  { icon: Mail, label: "Email", value: "hello@plantpot.com", href: "mailto:hello@plantpot.com" },
  { icon: Phone, label: "Phone", value: "+1 (555) 123-4567", href: "tel:+15551234567" },
  { icon: MapPin, label: "Address", value: "123 Green Street, Brooklyn, NY 11201", href: "#" },
  { icon: Clock, label: "Hours", value: "Mon–Fri, 9 AM – 6 PM EST", href: null },
]

const socials = [
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "Twitter / X", href: "#" },
  { label: "Pinterest", href: "#" },
  { label: "TikTok", href: "#" },
]

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all fields")
      return
    }
    setSending(true)
    try {
      await api.contact.submit({ name: name.trim(), email: email.trim(), message: message.trim() })
      setSent(true)
      toast.success("Message sent! We'll get back to you soon.")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send message. Please try again.")
    }
    setSending(false)
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-primary/5 to-background py-16 md:py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 size-72 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-20 left-10 size-80 rounded-full bg-primary/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <Badge variant="secondary" className="mb-4">Get in Touch</Badge>
          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            We&apos;d Love to Hear From You
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Have a question about a plant, need help with an order, or just want to say hello? We reply within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-10 lg:grid-cols-5">
            {/* Left — Info */}
            <div className="space-y-8 lg:col-span-2">
              <div>
                <h2 className="text-2xl font-bold">Contact Information</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Reach out through any of these channels
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <item.icon className="size-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {item.label}
                      </div>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-sm font-medium transition-colors hover:text-primary"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <div className="text-sm font-medium">{item.value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div>
                <h3 className="mb-3 text-sm font-semibold">Follow Us</h3>
                <div className="flex flex-wrap gap-2">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      className="inline-flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <Globe className="size-4" />
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — Form */}
            <div className="lg:col-span-3">
              <Card>
                <CardContent className="p-6 md:p-8">
                  {sent ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                        <CheckCircle className="size-8 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-xl font-semibold">Message Sent!</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Thank you for reaching out. We typically respond within 24 hours.
                      </p>
                      <Button
                        variant="outline"
                        className="mt-6"
                        onClick={() => {
                          setSent(false)
                          setName("")
                          setEmail("")
                          setMessage("")
                        }}
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h2 className="mb-1 text-2xl font-bold">Send Us a Message</h2>
                      <p className="mb-6 text-sm text-muted-foreground">
                        Fill out the form and we&apos;ll get back to you as soon as possible.
                      </p>
                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid gap-5 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                              id="name"
                              placeholder="Your name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="you@example.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            placeholder="Tell us how we can help..."
                            rows={6}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full sm:w-auto" disabled={sending}>
                          {sending ? (
                            <>
                              <Loader2 className="mr-2 size-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 size-4" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </form>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
