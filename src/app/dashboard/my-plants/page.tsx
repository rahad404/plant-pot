"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import {
  Droplets,
  Sprout,
  FlaskConical,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Leaf,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { api, type CareSchedule } from "@/lib/api"

function getWateringInterval(watering?: string): number {
  switch (watering?.toLowerCase()) {
    case "low":
      return 14
    case "moderate":
      return 7
    case "frequent":
      return 3
    default:
      return 7
  }
}

function toDate(dateStr: string | null): Date | null {
  if (!dateStr) return null
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? null : d
}

function isToday(date: Date): boolean {
  const now = new Date()
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  )
}

function daysBetween(a: Date, b: Date): number {
  return Math.floor(
    (a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24)
  )
}

function getWateringStatus(schedule: CareSchedule): {
  label: string
  variant: "default" | "success" | "destructive" | "outline"
  progress: number
  overdue: boolean
  nextWateringDate: Date | null
} {
  const interval = getWateringInterval(schedule.watering)
  const last = toDate(schedule.lastWatered)

  if (!last) {
    return {
      label: "Needs watering",
      variant: "destructive",
      progress: 100,
      overdue: true,
      nextWateringDate: null,
    }
  }

  const daysSince = daysBetween(new Date(), last)
  const progress = Math.min(Math.round((daysSince / interval) * 100), 100)
  const nextDate = new Date(last)
  nextDate.setDate(nextDate.getDate() + interval)

  if (daysSince >= interval) {
    return {
      label: `Overdue by ${daysSince - interval} day${daysSince - interval !== 1 ? "s" : ""}`,
      variant: "destructive",
      progress: 100,
      overdue: true,
      nextWateringDate: nextDate,
    }
  }

  if (daysSince >= interval - 1) {
    return {
      label: "Water tomorrow",
      variant: "outline",
      progress,
      overdue: false,
      nextWateringDate: nextDate,
    }
  }

  return {
    label: `Water in ${interval - daysSince} day${interval - daysSince !== 1 ? "s" : ""}`,
    variant: "default",
    progress,
    overdue: false,
    nextWateringDate: nextDate,
  }
}

function PlantCard({
  schedule,
  onWatered,
  wateringId,
}: {
  schedule: CareSchedule
  onWatered: (id: string) => void
  wateringId: string | null
}) {
  const status = getWateringStatus(schedule)
  const last = toDate(schedule.lastWatered)
  const isLoading = wateringId === schedule._id

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative flex h-48 w-full shrink-0 items-center justify-center bg-muted sm:h-auto sm:w-44">
          {schedule.image ? (
            <Image
              src={schedule.image}
              alt={schedule.plantName}
              fill
              className="object-cover"
            />
          ) : (
            <Sprout className="size-10 text-muted-foreground/40" />
          )}
        </div>

        {/* Content */}
        <CardContent className="flex flex-1 flex-col gap-3 p-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold leading-tight">{schedule.plantName}</h3>
              <div className="mt-0.5 flex flex-wrap gap-1.5">
                {schedule.watering && (
                  <Badge variant="secondary" className="text-[10px]">
                    {schedule.watering} water
                  </Badge>
                )}
                {schedule.light && (
                  <Badge variant="secondary" className="text-[10px]">
                    {schedule.light} light
                  </Badge>
                )}
              </div>
            </div>
            <Badge variant={status.variant} className="shrink-0 text-[10px]">
              {status.label}
            </Badge>
          </div>

          {/* Watering progress */}
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Droplets className="size-3" />
                {last
                  ? `Last watered ${last.toLocaleDateString()}`
                  : "Not watered yet"}
              </span>
              <span>
                {status.nextWateringDate
                  ? `Next: ${status.nextWateringDate.toLocaleDateString()}`
                  : "Water now"}
              </span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full transition-all ${
                  status.overdue
                    ? "bg-destructive"
                    : status.progress > 75
                      ? "bg-amber-500"
                      : "bg-primary"
                }`}
                style={{ width: `${status.overdue ? 100 : status.progress}%` }}
              />
            </div>
          </div>

          {/* Compost & Medicine */}
          <div className="grid grid-cols-2 gap-3">
            {schedule.compost && (
              <div className="rounded-lg bg-green-50 p-2 dark:bg-green-950/30">
                <div className="flex items-center gap-1 text-xs font-medium text-green-700 dark:text-green-400">
                  <Leaf className="size-3" />
                  Compost / Fertilizer
                </div>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{schedule.compost}</p>
              </div>
            )}
            {schedule.medicine && (
              <div className="rounded-lg bg-purple-50 p-2 dark:bg-purple-950/30">
                <div className="flex items-center gap-1 text-xs font-medium text-purple-700 dark:text-purple-400">
                  <FlaskConical className="size-3" />
                  Medicine / Treatment
                </div>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{schedule.medicine}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-auto flex items-center gap-2 pt-1">
            {isLoading ? (
              <Button size="sm" disabled>
                <Loader2 className="mr-1 size-3 animate-spin" />
                Watering...
              </Button>
            ) : !status.overdue && last && isToday(last) ? (
              <Button size="sm" variant="outline" disabled>
                <CheckCircle2 className="mr-1 size-3 text-green-600" />
                Watered Today
              </Button>
            ) : (
              <Button
                size="sm"
                variant={status.overdue ? "default" : "outline"}
                onClick={() => onWatered(schedule._id)}
              >
                <Droplets className="mr-1 size-3" />
                Mark as Watered
              </Button>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

export default function MyPlantsPage() {
  const [plants, setPlants] = useState<CareSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [wateringId, setWateringId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchPlants = useCallback(async () => {
    try {
      const res = await api.dashboard.myPlants()
      setPlants(res.plants || [])
    } catch {
      setError("Failed to load your plants.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPlants()
  }, [fetchPlants])

  const handleWatered = async (id: string) => {
    setWateringId(id)
    try {
      await api.dashboard.markAsWatered(id)
      // Refresh the list to update lastWatered
      await fetchPlants()
    } catch {
      setError("Failed to mark plant as watered. Try again.")
    } finally {
      setWateringId(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <AlertCircle className="mb-3 size-10 text-destructive" />
        <p className="font-medium">{error}</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={fetchPlants}>
          Try Again
        </Button>
      </div>
    )
  }

  const needsWatering = plants.filter(
    (p) => getWateringStatus(p).overdue
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Plants</h1>
        <p className="text-sm text-muted-foreground">
          Track watering schedules and care for your plants
        </p>
      </div>

      {/* Urgent watering banner */}
      {needsWatering.length > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <AlertCircle className="size-5 shrink-0 text-destructive" />
          <span className="font-medium text-destructive">
            {needsWatering.length} plant{needsWatering.length !== 1 ? "s" : ""} need{needsWatering.length === 1 ? "s" : ""} watering
          </span>
        </div>
      )}

      {plants.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Sprout className="mb-3 size-12 text-muted-foreground/40" />
          <p className="text-lg font-medium">No plants yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Plants you purchase will appear here with their care schedule
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {plants.map((p) => (
            <PlantCard
              key={p._id}
              schedule={p}
              onWatered={handleWatered}
              wateringId={wateringId}
            />
          ))}
        </div>
      )}

      {/* Schedule summary */}
      {plants.length > 0 && (
        <Card>
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4 text-sm">
            <div className="flex items-center gap-2">
              <Sprout className="size-4 text-muted-foreground" />
              <span>
                <strong>{plants.length}</strong> plant{plants.length !== 1 ? "s" : ""} in your collection
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="size-4 text-blue-600" />
              <span>
                <strong>{needsWatering.length}</strong> need{needsWatering.length === 1 ? "s" : ""} watering
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-green-600" />
              <span>
                <strong>{plants.filter((p) => !!p.lastWatered).length}</strong> watered
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
