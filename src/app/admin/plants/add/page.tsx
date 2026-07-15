"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlantForm } from "@/components/admin/plant-form"

export default function AddPlantPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/plants">
          <Button variant="ghost" size="icon" className="size-8">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add Plant</h1>
          <p className="text-sm text-muted-foreground">
            Add a new plant to your catalog
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Plant Details</CardTitle>
          <CardDescription>
            Fill in the information below to add a new plant.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PlantForm />
        </CardContent>
      </Card>
    </div>
  )
}
