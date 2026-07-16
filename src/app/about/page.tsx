import Link from "next/link"
import { Leaf, Sprout, Heart, Shield, Users, Lightbulb, Target, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const values = [
  {
    icon: Leaf,
    title: "Sustainability First",
    description:
      "We work with eco-conscious growers who use peat-free soil, recycled pots, and minimal plastic. Every order is carbon-offset through reforestation partnerships.",
  },
  {
    icon: Heart,
    title: "Plant Parent Support",
    description:
      "Every purchase comes with a personalized care guide and lifetime access to our plant-help hotline. We don't just sell plants — we help them thrive in your home.",
  },
  {
    icon: Shield,
    title: "Quality Guaranteed",
    description:
      "Our growers inspect each plant at 30 days and again at 7 days before shipping. If your plant arrives less than perfect, we replace it free of charge.",
  },
  {
    icon: Lightbulb,
    title: "Education & Empowerment",
    description:
      "We publish free care guides, host monthly webinars with botanists, and build tools like the PlantPot Care Schedule to make plant parenthood simple and rewarding.",
  },
]

const team = [
  {
    name: "Aisha Rahman",
    role: "Co-Founder & Head Botanist",
    avatar: "AR",
    bio: "Former lead horticulturist at the Royal Botanic Gardens. Aisha hand-selects every variety we carry and trains our growers on organic cultivation methods.",
  },
  {
    name: "Marcus Chen",
    role: "Co-Founder & CEO",
    avatar: "MC",
    bio: "Serial e-commerce entrepreneur with a passion for indoor gardening. Marcus built the PlantPot platform to make quality plants accessible to everyone.",
  },
  {
    name: "Priya Sharma",
    role: "Head of Plant Care",
    avatar: "PS",
    bio: "Certified master gardener and author of 'The Urban Jungle Handbook.' Priya designs our care guides and leads the customer support team.",
  },
  {
    name: "James Okonkwo",
    role: "Supply Chain Director",
    avatar: "JO",
    bio: "With a decade in sustainable logistics, James ensures every plant travels from greenhouse to your door in under 48 hours with minimal environmental impact.",
  },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-primary/5 to-background py-20 md:py-28">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 top-10 size-72 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-20 right-10 size-96 rounded-full bg-primary/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <Badge variant="secondary" className="mb-4">About Us</Badge>
          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            We Believe Everyone
            <br />
            <span className="text-primary">Deserves a Little Green</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            PlantPot was founded to make high-quality plants, expert care advice, and a thriving plant community accessible to everyone — from first-time plant parents to seasoned collectors.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="space-y-4">
              <Badge variant="secondary">Our Story</Badge>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">From a Tiny Apartment to Thousands of Homes</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  PlantPot started in 2021 in a small Brooklyn apartment. Co-founders Aisha and Marcus realized that while
                  people wanted to bring plants into their homes, they struggled to find healthy specimens and trustworthy
                  care advice. The big-box stores offered little guidance, and online marketplaces were hit-or-miss.
                </p>
                <p>
                  So they built a better way. They partnered directly with small-scale organic growers across the country,
                  curated each variety for indoor resilience, and wrote the care guides they wished existed. What began as
                  a weekend side project — packing plants in Aisha&apos;s living room — quickly grew into a full-fledged
                  operation as word spread among plant lovers in New York City.
                </p>
                <p>
                  Today, PlantPot ships to all 50 states and works with over 40 family-owned greenhouses. We&apos;ve helped
                  more than 5,000 customers turn their spaces into thriving green sanctuaries. But our mission hasn&apos;t
                  changed: make plants easy, joyful, and accessible for everyone.
                </p>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-emerald-500/20">
              <img
                src="https://ibb.co.com/ccbDHynx"
                alt="Our greenhouse"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Mission */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-2">Our Mission</Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Making Plant Parenthood Effortless</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We exist to remove every barrier between you and the joy of growing things. That means sourcing the
              healthiest plants, writing honest care guides, building tools that remind you when to water, and standing
              behind every purchase with a no-questions-asked guarantee. We measure our success not by how many plants
              we sell, but by how many are still thriving a year later.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {[
                { icon: Target, stat: "5,000+", label: "Happy Customers" },
                { icon: Leaf, stat: "200+", label: "Plant Varieties" },
                { icon: Sprout, stat: "40+", label: "Partner Growers" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border bg-muted/30 p-6">
                  <item.icon className="mx-auto mb-2 size-6 text-primary" />
                  <div className="text-2xl font-bold">{item.stat}</div>
                  <div className="text-sm text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Values */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <Badge variant="secondary" className="mb-2">What We Stand For</Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Our Values</h2>
            <p className="mt-2 text-muted-foreground">The principles that guide every decision we make</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <Card key={value.title} className="border-0 bg-muted/30 shadow-none">
                <CardContent className="p-6">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                    <value.icon className="size-6 text-primary" />
                  </div>
                  <CardTitle className="mb-2 text-lg">{value.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* Team */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <Badge variant="secondary" className="mb-2">Our Team</Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">The People Behind PlantPot</h2>
            <p className="mt-2 text-muted-foreground">
              A small team with big dreams — and a lot of plants
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <Card key={member.name} className="overflow-hidden">
                <div className="flex items-center justify-center bg-gradient-to-b from-primary/10 to-background p-8">
                  <div className="flex size-24 items-center justify-center rounded-full bg-primary/20 text-2xl font-bold text-primary">
                    {member.avatar}
                  </div>
                </div>
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription className="text-xs font-medium uppercase tracking-wider text-primary">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center text-sm text-muted-foreground">
                  {member.bio}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary/5 py-16 md:py-20">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <Sprout className="mx-auto mb-4 size-10 text-primary" />
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Ready to Grow With Us?</h2>
          <p className="mt-3 text-muted-foreground">
            Join thousands of happy plant parents. Browse our collection and find your next green companion.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/plants">
              <Button size="lg">
                Shop Plants
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
