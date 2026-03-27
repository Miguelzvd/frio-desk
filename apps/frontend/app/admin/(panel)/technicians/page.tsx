"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { TechniciansTable } from "@/components/admin/technicians-table"
import { useAdminTechnicians } from "@/hooks/use-admin"

const PAGE_SIZE = 8

export default function AdminTechniciansPage() {
  const [cursorStack, setCursorStack] = useState<string[]>([])
  const currentCursor = cursorStack[cursorStack.length - 1]
  const { data, isLoading } = useAdminTechnicians(currentCursor)

  const technicians = data?.data ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = cursorStack.length + 1

  function handleNext() {
    if (data?.nextCursor) {
      setCursorStack((prev) => [...prev, data.nextCursor!])
    }
  }

  function handlePrev() {
    setCursorStack((prev) => prev.slice(0, -1))
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {total} técnico{total !== 1 ? "s" : ""} cadastrado{total !== 1 ? "s" : ""} no total
      </p>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <TechniciansTable technicians={technicians} />
      )}

      <div className="flex items-center justify-between pt-2">
        <p className="text-sm text-muted-foreground">
          Página {currentPage} de {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={cursorStack.length === 0 || isLoading}
          >
            <ChevronLeft className="size-4" />
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={!data?.nextCursor || isLoading}
          >
            Próxima
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
