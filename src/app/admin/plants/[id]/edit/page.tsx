"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlantForm } from "@/components/admin/plant-form"
import { api, type Plant } from "@/lib/api"

export default function EditPlantPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [plant, setPlant] = useState<Plant | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    api.plants.get(id)
      .then((data) => setPlant(data.plant))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  if (notFound) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-semibold">Plant not found</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The plant you are trying to edit does not exist.
        </p>
        <Link href="/admin/plants">
          <Button variant="outline" className="mt-4">
            Back to Plants
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/plants">
          <Button variant="ghost" size="icon" className="size-8">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Plant</h1>
          <p className="text-sm text-muted-foreground">
            Update the details for {plant?.name || "this plant"}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Plant Details</CardTitle>
          <CardDescription>
            Modify the fields below and save your changes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PlantForm plant={plant} loading={loading} />
        </CardContent>
      </Card>
    </div>
  )
}
