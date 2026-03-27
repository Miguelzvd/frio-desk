"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { TechniciansTable } from "@/components/admin/technicians-table"
import { useAdminTechnicians } from "@/hooks/use-admin"

export default function AdminTechniciansPage() {
  const { technicians, loading } = useAdminTechnicians()

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {technicians.length} técnico{technicians.length !== 1 ? "s" : ""} cadastrado
        {technicians.length !== 1 ? "s" : ""}
      </p>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <TechniciansTable technicians={technicians} />
      )}
    </div>
  )
}
